const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const hwCommonVendor = require("../hw-common-vendor");

const entry = hwCommonVendor.getSharedVendorEntry({
    main: "./index.js"
});

const plugins = hwCommonVendor.extractVendorChunkPlugin().concat([
    new CleanWebpackPlugin(["dist"])
])

module.exports = {
    context: path.resolve(__dirname, "src"),

    entry: entry,

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[chunkhash].js"
    },

    plugins: plugins
};

// Old webpack configuration that does not use hwCommonVendor
// module.exports = {
//     context: path.resolve(__dirname, "src"),

//     entry: {
//         main: "./index.js"
//     },

//     output: {
//         path: path.resolve(__dirname, "dist"),
//         filename: "[name].[chunkhash].js"
//     },

//     plugins: [
//         new CleanWebpackPlugin(["dist"])
//     ]
// };