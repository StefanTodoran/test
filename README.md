<h1>
  Welcome to my portfolio website! 
  <img src="assets/leaf-logo.png" style="height: 0.8em;"/>
</h1>

You probably want to [click here](https://todoran.dev/) to go to the actual website. This readme simply consists of random tidbits notes to myself related to the development process for the website and probably isn't very interesting, but you can read it if you like.

## Getting Started

The website only has a few dependencies, and they are all dev dependencies. The first is the css preprocessor SASS and the other three are for the build script (fs-extra, minify, and try-to-catch). To install, do the following in a terminal of your choice starting in the root directory:

```
npm i
cd deployment
npm i
```

Not sure why I split up the dependencies like this so maybe change it when you have the time.

## Making Changes

Start by opening a terminal and running the following inside the root directory:
```
cd css
sass --watch index.sass index.css
```

The github pages site serves from the `docs` folder, so make sure to run the following when changes are ready to be made live:
```
cd deployment
node build.js
```

Make sure to manually minify the css file.

## TODO

For some reason, the minifier used in `build.js` is unable to pass options to its css minifying dependency, and the documentation is unclear. It seems to be encoding background-image properties from css to base64, which is an odd default behavior for a supposed "minifier"...

The site still loads in pretty slow, even with the minification, so looking in to cutting some of the image sizes and perhaps some other compresion could help.

Finally, the plant decorations look cool but I want the jungle to feel alive! Consider potential methods for giving the plants some subtle swaying in the wind animations. At the same time, the plant decorations are a bit visually busy, so some way to make them less distracting could help.

## Known Issues

In firefox (not an issue in chrome, need to check safari) sometimes if your mouse is within the bounding box of a parallax section during the animation, it just becomes invisible and stays that way. Seems to be an issue with firefox and animations, as opening the inspector fixes the issue, but I haven't found a workaround.

The resume button used to have an issue where the `<a>` was bigger than its `<img>`. I managed to fix that, but introduced the most bizarre bug. If the window is resized to a width small enough to have the icon-buttons shrink (screen width less than 500px), the resume button's img becomes stretched horizontally, but only when not hovered. This issue persists even if the window is resized to a larger width, and even on refresh somehow??

The build deployment script is broken if run from the `deployment` directory.