from http.server import HTTPServer, SimpleHTTPRequestHandler
import re
import subprocess
import sys
import os
from pathlib import Path
import threading

class logStatus:
  GOOD = "\033[92m"
  WARN = "\033[93m"
  FAIL = "\033[91m"

watch = True
watcher = None
directory = ""
silent = False
banner = r"""
 ___         _    __     _ _       ___                      
| _ \___ _ _| |_ / _|___| (_)___  / __| ___ _ ___ _____ _ _ 
|  _/ _ \ '_|  _|  _/ _ \ | / _ \ \__ \/ -_) '_\ V / -_) '_|
|_| \___/_|  \__|_| \___/_|_\___/ |___/\___|_|  \_/\___|_|  
"""

def setOutputMode(isSilent):
  global silent
  silent = isSilent

def formatLog(data, status = None):
  pre = ""
  if status == logStatus.GOOD:
    pre = "($) "
  if status == logStatus.WARN:
    pre = "(?) "
  if status == logStatus.FAIL:
    pre = "(!) "
  return f"{status}{pre}{data}\033[0m"

def output(data, status = None, newLine = False, end="\n"):
  data = str(data)
  if silent: return
  if newLine: print("")
  if status: print(formatLog(data, status), end=end)
  else: print(data, end=end)

def locateAllPages(root: str = ""):
  dir = Path(root)
  pages = sorted(dir.glob("*.html"))
  output(f"Located {len(pages)} site pages...")
  return pages

def locateAll(root: str, glob: str, ignore: list[str] = None):
  """
  root (str)
  The directory in which to search for files.
  
  glob (str)
  The glob to match files to, e.g. "*.txt" to match all files
  with the ".txt" extension.

  ignore (list[str])
  A list of file names to ignore. Glob will proceed as normal
  and each match will be checked against this blacklist.
  """

  dir = Path(root)
  all = sorted(dir.glob(glob))
  output(f"Located {len(all)} {glob} files: {[str(file) for file in all]}")

  if ignore:
    ignore = {str(Path(root) / file) for file in ignore}
    files = [file for file in all if str(file) not in ignore]
    pruned = list(set(all) - set(files))
    output(f"Ignored {len(pruned)} of located files: {[str(file) for file in pruned]}")
    return files
  else:
    return all

def handleSubprocessErrors(proc):
  good_keywords = ["compiled", "watching", "0 errors"]
  error_keywords = ["error", "warning"]
  sass_error = re.compile(r"[a-z]*.sass\s*\d+:\d+[a-z ]*stylesheet", re.IGNORECASE)

  for rawLine in proc.stdout:
    line = rawLine.decode("utf-8").strip()
    
    if any([word in line.lower() for word in good_keywords]):
      output(line)
    elif any([word in line.lower() for word in error_keywords]) or sass_error.match(line):
      output(line, logStatus.WARN)

# Found this funky little function on stack overflow:
# https://stackoverflow.com/questions/40419276/python-how-to-print-text-to-console-as-hyperlink
def link(uri, label=None):
  if label is None: 
    label = uri
  parameters = ""

  # OSC 8 ; params ; URI ST <name> OSC 8 ;; ST 
  escape_mask = "\033]8;{};{}\033\\{}\033]8;;\033\\"
  return escape_mask.format(parameters, uri, label)

def prepare(message: str):
  global watcher

  os.system("cls" if os.name=="nt" else "clear")
  output(banner)
  output(message)

  if watch:
    output("Searching for components to watch for changes...")
    components = locateAll("components/", "_*.html")
    watcher = FileWatcher(components)
  else:
    output("Note that components will not be watched for changes!")

  output("Server ready and waiting at " + link("http://localhost:8000/") + "\n", logStatus.GOOD, newLine=True)

# ============== #
# *** SERVER *** #

def run(server_class=HTTPServer, handler_class=SimpleHTTPRequestHandler, bg_procs=[], print_threads=[]):
  server_address = ("", 8000)
  httpd = server_class(server_address, handler_class)

  try:
    httpd.serve_forever()
  except:
    if len(bg_procs) > 0:
      output("Recieved keyboard interrupt, killing compiler and exiting...", logStatus.WARN)
      
      for bg_proc in bg_procs:
        bg_proc.kill()
      for print_thread in print_threads:
        print_thread.join()
    else:
      output("Recieved keyboard interrupt, exiting...", logStatus.WARN)
    output("")

class NoExtensionHandler(SimpleHTTPRequestHandler):
  def do_GET(self):
    print("\nUnmodified path: " + self.path)
    output("\nUnmodified path: " + self.path)
    self.path = directory + self.path
    output("With directory: " + self.path)
    
    home_paths = ["/", "/docs/"]
    # The exclusion of paths with a period excludes image, js and other file types
    if self.path not in home_paths and not "." in self.path:
      self.path += ".html"
      output("Extension added: " + self.path)

    # if watch and watcher.check():
    #   output("File modified, refreshing page...")
    #   TODO

    SimpleHTTPRequestHandler.do_GET(self)

class FileWatcher(object):
  def __init__(self, paths: list[str]):
    self._cachedStamps = [None] * len(paths)
    self.watchPaths = paths

  def check(self):
    for index in range(len(self.watchPaths)):
      file = self.watchPaths[index]
      stamp = os.stat(file).st_mtime

      output(f"Checking {file} modified time: {stamp}, {self._cachedStamps[index]}", newLine=True)
      if stamp != self._cachedStamps[index]:
        self._cachedStamps[index] = stamp
        return True # file changed
    
    return False # file unchanged

def startSubprocess(args: list, success: str, failure: str):
  try:
    output(success) 
    return subprocess.Popen(args, shell=True, stdout=subprocess.PIPE)
  except:
    raise EnvironmentError(formatLog(failure, logStatus.FAIL))

# ============ #
# *** MAIN *** #

def main(
    serveDocs = False, 
    watchSass = False, 
    watchTypescript = False, 
    watchFiles = False
  ):
  global watch, watcher, directory

  if serveDocs:
    watch = False  # We can serve from the docs folder or watch for head changes, but it doesn't make sense to do both. 
    directory = "/docs"

    prepare(f"Recieved '{sys.argv[1]}' flag, serving from /docs/ directory...")
    run(HTTPServer, NoExtensionHandler)
  else:

    if watchFiles:
      output("Searching for file to watch for changes...")
      files = locateAll("", "*.html") + locateAll("", "*.css") + locateAll("", "*.js")
      watcher = FileWatcher(files)

    procs = []
    if watchTypescript:
      procs.append(startSubprocess(
        ["npx", "tsc", "--watch"], 
        "\nStarting tsx and watching for .ts changes...",
        "Failed to start tsc compiler, verify installion.",
      ))
    if watchSass:
      procs.append(startSubprocess(
        ["sass", "--watch", "css/index.sass", "css/index.css"], 
        "\nStarting sass and watching for .css changes...",
        "Failed to start sass compiler, verify installion.",
      ))
    
    prepare("Serving from root directory...")
    
    print_threads = []
    for proc in procs:
      print_thread = threading.Thread(target=handleSubprocessErrors, args=(proc,))
      print_thread.start()
      print_threads.append(print_thread)

    run(HTTPServer, NoExtensionHandler, procs, print_threads)


if len(sys.argv) == 1:
  main(False, True, True, True)

elif len(sys.argv) == 2:
  dir_flags = ["--docs", "-d"]

  if sys.argv[1] in dir_flags:
    main(True)
  
  else:
    output(f"Invalid flag provided. Expected one of {str(dir_flags)}, got '{sys.argv[1]}'")

else:
  output(f"Invalid number of arguments. Expected at most 1, got {len(sys.argv) - 1}")