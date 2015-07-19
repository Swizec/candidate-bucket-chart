
# BigScreen job candidates visualization

![Visualization with test data](http://i.imgur.com/mJLcQdw.png)

# How to integrate

## Dependencies

This chart is built with [React](https://facebook.github.io/react/)
and [d3.js](http://d3js.org/). To keep JavaScript file sizes small,
the code assumes both React and d3.js are loaded as externals.

You should either add them to your build process or include them in
your page like this:

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react-with-addons.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>
```

This shouldn't affect any of your other JavaScript files or libraries.

## Getting the code into JS

You can integrate this chart in one of two ways:

  - with a `require` statement
  - using a global function

### With require

If your JavaScript environment supports requiring files, you can load
the entire chart through the production build JavaScript file.

```javascript
const RenderApplicantsChart = require('path/to/lib/build/prod_build.js');

RenderApplicantsChart( ... );
```

### Using a global function

To accomodate environments without the ability to require, this
library also exports a global function attached to the `window`
scope. You call it the same as above:

```javascript
RenderApplicantsChart( ... );
```

But you will have to manually add a `<script>` tag to load the
code. Add this line next to your other script tags:

```html
<script src="<path/to/lib/build/prod_build.js"></script>
```

## The parameters

There are some basic parameters you can set when calling the chart
function. You should send them as a params object.

```javascript
RenderApplicantsChart({
    selector: '.container', // required, tells chart where to render into
    urlRoot: 'rest/', // required, defines the root URL of the
    data REST API
    width: 800, // optional, specifies the chart's width
    height: 500, // optional, specifies the chart's height
    // Note: height doesn't account for the height of filters,
    // title, or meta text. It's just for the graphic part
    max_r: 10, // optional, maximum size factor for datapoints; is
    // not a direct pixel value, but does have linear correlation to
    // the max
    default_pass_line: 'median' // optional, the pass line's
    // default value; can be set as a number or a function name to be
    // calculated for each dataset - median or mean
});
```

## The styling

This chart's example implementation is based on Bootstrap, but in
theory the styling does not assume Bootstrap is present. A minimal of
Bootstrap classes are used for the filter forms and Glyphicons are
assumed to make the stars score in each applicant's tooltip.

You should include the CSS in your page like this:

```html
<link rel="stylesheet" href="path/to/lib/build/style.css">
```

# How to modify

You will need [node.js](http://nodejs.org/) to build the code and run
the enclosed development server.

## Local environment

 1. Download the repository. I recommend using `git clone` to do so.
 2. In the repository's directory, run `npm install`
 3. You need a global [Webpack](http://webpack.github.io/) binary to compile for production. Run:
 `npm install -g webpack`
 4. You will need [grunt](http://gruntjs.com/) to build LESS. Run:
 `npm install -g grunt-cli`
 5. To start developing run:
   5.1 `npm start` to run the development server and live JS compiler
   5.2 `grunt watch` to run the live LESS compiler

Every time you change a file both compilers will run automatically and
refreshing the browser will let you see your changes. You can observe
each compiler's output to find syntax errors.

The JavaScript will compile with full sourcemap support so errors
thrown by the browser will point to the correct file and line number.

## Building

Production builds are configured not to use sourcemaps. This makes the
resulting JS file less than a third of the size of the dev file. (470kB
vs. 1.6MB).

To make a production build run:

    $ webpack --config=webpack.prod.config.js

This creates a new file in the `build/` directory called
`build_prod.js`. Or replaces the old one.

If you want to host a dev build outside of the development server
enclosed with the project, you have to run this:

    $ webpack --config=webpack.config.js

This overwrites the `build/build.js` file with a new version.

You don't have to do anything for CSS. If you've had `grunt watch`
running, the file `build/style.css` is always up to date.
