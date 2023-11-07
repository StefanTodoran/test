import { minify } from "minify";
import tryToCatch from "try-to-catch";
import fse from "fs-extra";
import path from "path";

interface getFilesOptions {
  recursive?: boolean, 
  directory?: string, 
  ignoreDirectories?: string[], 
  ignoreUnderscored?: boolean,
}

/**
 * REQUIRED:
 * @param {fse.PathLike} root 
 * @param {string} extension
 * 
 * OPTIONAL:
 * @param {getFilesOptions} useOptions
 * Options given of the form described below. By default
 * is not recursive, searches the root directory, ignores
 * only the "docs" sub-directory, and does not ignore files whose
 * names begin with underscores.
 */
function getFilesWithExtension(root: fse.PathLike, extension: string, useOptions: getFilesOptions) {
  const defaultOptions = {
    recursive: false,
    directory: "",
    ignoreDirectories: ["docs"],
    ignoreUnderscored: false,
  }
  const options = Object.assign(defaultOptions, useOptions);

  const target = root + options.directory;
  if (!fse.existsSync(target)) { // Check if the directory exists
    console.log(`(error) \x1b[91mdirectory "${target}" does not exist!\x1b[0m`);
    throw new Error("FAILED");
  }

  // Read the contents of the directory
  const files = searchDirectory(target, options.recursive, options.ignoreDirectories);

  // Filter files by the extension
  const filtered = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    if (options.ignoreUnderscored && file.startsWith('_')) return false;
    return ext === extension.toLowerCase();
  });

  const result = filtered.map(file => options.directory + file);
  return result;
}

/**
 * @param {fse.PathLike} directory Directory to seach for files.
 * @param {boolean} recursive Whether to search sub-directories.
 * @param {string[]} ignore List of sub-directories to ignore.
 */
function searchDirectory(directory: fse.PathLike, recursive?: boolean, ignore?: string[]) {
  const files = fse.readdirSync(directory);
  const results: string[] = [];

  for (const file of files) {
    const filePath = path.join(directory.toString(), file);
    const fileStat = fse.statSync(filePath);

    if (recursive && fileStat.isDirectory() && !ignore?.includes(file)) {
      const sub = searchDirectory(filePath);
      results.push(...sub);
    } else if (fileStat.isFile()) {
      results.push(filePath);
    }
  }

  return results;
}

function getDirectoryName(filePath: string) {
  const index = Math.max(filePath.lastIndexOf("/"), filePath.lastIndexOf("\\"));
  if (index === -1) return filePath;
  return filePath.substring(0, index);
}

async function calculateFileSize(fileList: string[]) {
  try {
    let totalSize = 0;

    for (const filePath of fileList) {
      const stats = await fse.stat(filePath);

      if (stats.isFile()) {
        totalSize += stats.size;
      }
    }

    return totalSize;
  } catch (error: any) {
    console.log("(error) \x1b[91mfailed while calculating size:\x1b[0m\n" + error.message);
    throw new Error("FAILED");
  }
}

async function grabAndMinify(file: string) {
  const options = {
    img: {
      maxSize: 0,
      // Defaults to 4096, if we don't set it to zero then relative url() images
      // in the css get converted to base64 and our css becomes massively bloated.
    },
  };

  const [error, data] = await tryToCatch(minify, file, options);
  if (error) {
    console.log("(error) \x1b[91merror occured while minifying:\x1b[0m\n" + error.message);
    throw new Error("FAILED");
  }
  return data;
}

async function main() {
  let src = "./";
  let dest = "./docs/";

  if (process.cwd().includes("deployment")) {
    src = "." + src;
    dest = "." + dest;
  }

  console.log(`(setup) clearing ${dest} folder and contents`);
  fse.rmSync(dest, { recursive: true, force: true });
  console.log(`(setup) creating empty ${dest} folder`);
  fse.mkdirSync(dest);

  console.log(`(setup) creating CNAME file in ${dest}`);
  fse.writeFile(dest + "CNAME", "todoran.dev");

  const cssFiles = getFilesWithExtension(src, ".css", { recursive: true, ignoreDirectories: ["docs"] });
  const htmlFiles = getFilesWithExtension(src, ".html", { recursive: true, ignoreDirectories: ["docs"] });
  const jsFiles = getFilesWithExtension(src, ".js", { recursive: true, ignoreDirectories: ["docs", "deployment"] });

  let files = [...htmlFiles, ...cssFiles, ...jsFiles];
  if (process.cwd().includes("deployment")) files = files.map(file => file.slice(1));

  for (let i = 0; i < files.length; i++) {
    const srcFile = src + files[i];
    const destFile = dest + files[i];

    const mini = await grabAndMinify(srcFile);
    console.log(`\n(minify) read and minified ${srcFile}`);

    fse.ensureDirSync(getDirectoryName(destFile));
    fse.writeFileSync(destFile, mini);
    console.log(`(copy) copied ${srcFile} --> ${destFile}`);
  }

  // Everything below this point is exclusively logging related.

  console.log(`\n(recursive copy) ${src + "assets"} --> ${dest + "assets"}`);
  fse.copySync(src + "assets", dest + "assets", { overwrite: true });

  let assetFiles = fse.readdirSync(dest + "assets");
  assetFiles = assetFiles.map(file => dest + "assets/" + file);

  const assetTotal = await calculateFileSize(assetFiles) / 1000;
  console.log(`(result) total size of all assets: \x1b[93m${assetTotal}\x1b[0m kb`)

  const srcFiles = files.map(file => src + file);
  const destFiles = files.map(file => dest + file);

  const srcTotal = await calculateFileSize(srcFiles) / 1000;
  const destTotal = await calculateFileSize(destFiles) / 1000;

  console.log(`\n(result) raw size of html, css, and js: \x1b[93m${srcTotal}\x1b[0m kb`);
  console.log(`(result) minified size: \x1b[93m${destTotal}\x1b[0m kb`);
  console.log(`(result) compressed by \x1b[92m${Math.round((1 - (destTotal / srcTotal)) * 100)}%\x1b[0m\n`);
}

console.log(
  "===================================\n" +
  "STARTING PORTFOLIO SITE MINIFER ...\n" +
  "===================================\n"
);
main();