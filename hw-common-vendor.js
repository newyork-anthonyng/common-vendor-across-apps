const webpack = require("webpack");
const readPkgUp = require("read-pkg-up");
const chalk = require("chalk");

const VENDOR_FILE_NAME = "sharedVendor.js";

const sharedCommonVendors = {
    "lodash": "4.17.5",
    "react": "16.3.1"
};

function getSharedVendorEntry(customEntry) {
    return Object.assign({}, 
        customEntry,
        {
            [VENDOR_FILE_NAME]: Object.keys(sharedCommonVendors)
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
            name: VENDOR_FILE_NAME,
            minChunks: Infinity
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest.js",
            minChunks: Infinity
        }),

        // this plugin throws an Error when the client's versions do not match what we have
        function() {
            this.plugin("done", function() {
                // read the closest package.json
                readPkgUp().then(result => {
                    const clientDependencies = result.pkg.dependencies;
                    let hasError = false;

                    // go through each of our shared vendor entries
                    Object.keys(sharedCommonVendors).forEach(currentDependency => {
                        const actualDependencyVersion = clientDependencies[currentDependency];
                        const expectedDependencyVersion = sharedCommonVendors[currentDependency];

                        // check to see if version is the same
                        if (actualDependencyVersion !== expectedDependencyVersion) {
                            logError(currentDependency, expectedDependencyVersion, actualDependencyVersion);
                            hasError = true;
                        }
                    });

                    if (hasError) {
                        process.exit(1);
                    }
                });
            });
        }
    ]
}

function logError(packageName, expectedVersion, actualVersion) {
    console.error(chalk.bgRed('Something went wrong'));
    console.error(chalk.red(chalk.underline(packageName), 'has version', chalk.underline(actualVersion), 'but expected', chalk.underline(expectedVersion)));
}

module.exports = {
    getSharedVendorEntry: getSharedVendorEntry,
    extractVendorChunkPlugin: extractVendorChunkPlugin
};