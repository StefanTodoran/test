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
For some reason, the minifier used in `build.js` is unable to pass options to its css minifying dependency, and the documentation is unclear. There is a hack fix, but this should be looked at. It seems to be encoding background-image properties from css to base64, which is an odd default behavior for a supposed minifier...

The site still loads in pretty slow, even with the minification, so looking in to cutting some of the image sizes and perhaps some compresion could help.

Finally, the plant decorations look cool but I want the jungle to feel alive! Consider potential methods for giving the plants some subtle swaying in the wind animations. At the same time, the plant decorations are a bit visually busy, so some way to make them less distracting could help.