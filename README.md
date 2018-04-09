# Common Shared Vendor Across App

This is a demo that shows how we can have a consistent shared vendor bundle across 3 applications.

We have 3 applications that have different dependencies.
* firstApp
    * is-regexp
    * lodash
    * react
* secondApp
    * lodash
    * react
    * rgb-hex
* thirdApp
    * is-finite
    * lodash
    * react

Notice how `lodash` and `react` are shared between all three web applications. We want to create a bundle file that has the same chunk hash shared between all three web applications.

# To test
* Go into each web application. (`firstApp`, `secondApp`, `thirdApp`)
* Run `npm install`
* Run `npm run build`
* Compare the `sharedVendor` file from each web application. The `chunkHash` should be the same for each file.

# Suggested API

The shared vendor files will be hard-coded into the `hw-common-vendor.js` file. This way, we will ensure consistency. One team won't be able to update a dependency on their own. All teams will have to do it together.

The API will look like this:
``` javascript
// webpack.config.js
const hwCommonVendor = require("./hw-common-vendor");

const entry = hwCommonVendor.getSharedVendorEntry({
    main: "./index.js"
});

const plugins = hwCommonVendor.extractVendorChunkPlugin().concat([
    new CleanWebpackPlugin(["dist"])
])

module.exports = {
    entry: entry,

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[chunkhash].js"
    },

    plugins: plugins
};
```

