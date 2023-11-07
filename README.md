<h1>
  Welcome to my portfolio website! 
  <img src="assets/leaf-logo.png" style="height: 0.8em;"/>
</h1>

You probably want to [click here](https://todoran.dev/) to go to the actual website. This readme simply consists of random tidbits and notes to myself related to the development process for the website and probably isn't very interesting, but you can read it if you like.

# Development Instructions

## Getting Started

The website only has a few dependencies, and they are all dev dependencies. The main portfolio website requires `typescript` and `sass`, and the build script requires `fs-extra`, `minify`, and `try-to-catch`. 

```
git clone https://github.com/StefanTodoran/StefanTodoran.github.io.git
cd StefanTodoran.github.io.git
npm i
```

## Directories Overview

### `./assets`

Contains all client logos, work previews, icon `svg`s, and other asset files, such as the favicon and resume. There is some organization within the directory between file types.

### `./css`

Contains the `.sass` source files and the output `index.css` file used by the website.

### `./deployment`

Contains the `.ts` source and `.js` emit files for the build script, which takes site files from the root of the project, minifies them, then copies them to `./docs`.

### `./docs`

Contains the minified production version of the site, is the hosting source for Github Pages.

## Useful Scripts

### `npm run dev`

Starts the python server, which manages the `sass` and `typescript` compilers as subprocesses. 

### `npm run build`

Runs the build script, minifying and copying files to the `./docs` folder.

### `npm run docs`

Starts the python server but without the `sass` and `typescript` compilers, instead server the files stored in `./docs`.

### `npm run deploy`

Bumps the npm package version, builds changes with the build script, then commits and pushes changes.

## TODO

* The website needs a proper contact feature, not just a `mailto` link. Easiest way to set this up would probably be firebase.

* Modify the python server and index.js to allow auto refresh when files are changed.

* For some reason, the minifier used in `build.js` is unable to pass options to its css minifying dependency, and the documentation is unclear. It seems to be encoding background-image properties from css to base64, which is an odd default behavior for a supposed "minifier"...

* The site still loads in pretty slow, even with the minification, so looking in to cutting some of the image sizes and perhaps some other compresion could help.

* The plant decorations look cool but I want the jungle to feel alive! Consider potential methods for giving the plants some subtle swaying in the wind animations. At the same time, the plant decorations are a bit visually busy, so some way to make them less distracting could help.

## Known Issues

In firefox (not an issue in chrome, need to check safari) sometimes if your mouse is within the bounding box of a parallax section during the animation, it just becomes invisible and stays that way. Seems to be an issue with firefox and animations, but I haven't been able to find a workaround as opening the inspector fixes the issue.