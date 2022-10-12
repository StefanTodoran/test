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
For some reason, the minifier used in `build.js` is really bad. It seems to be fine at doing the javascript and html files, but it somehow makes the css file <strong>bigger??</strong> At some point this needs to be looked at. 

The site still loads in pretty slow, even with the minification, so looking in to something to either remedy that or adding a loader element to cover everything while the images and text are loaded would be a good idea.