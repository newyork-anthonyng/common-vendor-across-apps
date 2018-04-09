const webpack = require("webpack");

const VENDOR_ENTRY = "sharedVendor.js";

function getSharedVendorEntry(customEntry) {
    return Object.assign({}, 
        customEntry,
        {
            [VENDOR_ENTRY]: ["react", "lodash"]    
        }
    );
}

function extractVendorChunkPlugin() {
    return [
        new webpack.NamedChunksPlugin(chunk => {
            if (chunk.name) {
                return chunk.name;
            }

            // handle code split chunks without a name
            return chunk.mapModules(m => path.relative(m.context, m.request)).join("_");
        }),
        new webpack.NamedModulesPlugin(),

        
        new webpack.optimize.CommonsChunkPlugin({
            name: VENDOR_ENTRY,
            minChunks: Infinity
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest.js",
            minChunks: Infinity
        }),
    ]
}

module.exports = {
    getSharedVendorEntry: getSharedVendorEntry,
    extractVendorChunkPlugin: extractVendorChunkPlugin
};