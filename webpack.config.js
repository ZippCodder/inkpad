// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');

const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV == 'production';
const isModern = process.env.BROWSERSLIST_ENV == "modern";

const config = {

    entry: { 
	polyfill: "./src/polyfill.js", 
	home: "./src/components/home.tsx"
	    },
    output: {
        path: path.resolve(__dirname, `dist/${process.env.BROWSERSLIST_ENV}`),
        filename: `[name].bundle.${process.env.BROWSERSLIST_ENV}.js`,
	chunkFormat: "module",
	clean: true
    },
    devServer: {
        open: true,
        host: 'localhost',
	port: 5000,
	contentBase: path.resolve(__dirname,`./dist/${process.env.BROWSERSLIST_ENV}`)
    },
    plugins: [
 	 new HtmlWebpackPlugin({template: `./public/index.${process.env.NODE_ENV}.html`, title: "Inkpad", filename: `index.html`}),
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader','css-loader',"postcss-loader"],
            },
	    {   
		test: /\.(tsx|ts)$/,
                use: ['babel-loader']
	    },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset/inline',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
};

module.exports = () => {
  /*  if (isProduction) {
        config.mode = 'production';
        
        
    } else {
        config.mode = 'development';
    } */
    return config;
};
