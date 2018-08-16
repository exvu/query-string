// const webpack = require("webpack");
const path = require("path");
const { description, version } = require('./package');

module.exports = {
    mode: 'production',
    entry: path.join(__dirname, '/lib/index.ts'),
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: `${description}-${version}.js`,
        library: "UrlParse",
        libraryTarget: 'window',
        umdNamedDefine: true,
        libraryExport: 'default'
    },
    externals: function () {
        let manifest = require('./package.json');
        let dependencies = manifest.dependencies;
        let externals = {};
        for (let p in dependencies) {
            externals[p] = 'commonjs ' + p;
        }
        externals["cfg"] = "commonjs cfg";
        return externals;
    }(),
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts?$/, loader: "ts-loader", options: {
                    "declaration": false,
                }
            },
        ]
    },
    plugins: [
    ]
}