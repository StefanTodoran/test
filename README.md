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

The site still loads in pretty slow, even with the minification, so looking in to cutting some of the image sizes and perhaps some compresion could help.

Finally, the plant decorations look cool but I want the jungle to feel alive! Consider potential methods for giving the plants some subtle swaying in the wind animations. At the same time, the plant decorations are a bit visually busy, so some way to make them less distracting could help.

## Known Issues
Tabbing through the site doesn't seem to work for parallax sections, it just doesn't scroll far enough... not sure there is even a way to fix this, since itt only occurs on firefox.

The resume button used to have an issue where the `<a>` was bigger than its `<img>`. I managed to fix that, but introduced the most bizarre bug. If the window is resized to a width small enough to have the icon-buttons shrink (screen width less than 500px), the resume button's img becomes stretched horizontally, but only when not hovered. This issue persists even if the window is resized to a larger width, and even on refresh somehow??

Also, the resume button has weird tabbing issues. First tab press goes to the second icon button on the page, even though the resume button comes before it. It is still tabbable, one just has to press tab and then shift tab, as if it some kind of -1st element in the order. Super bizzare.

In firefox (not an issue in chrome, need to check safari) if you move your mouse over a parallax section very fast during the animation, it just becomes invisible and stays that way. Seems to be an issue with firefox and animations, but haven't found a workaround.