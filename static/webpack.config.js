const webpack = require('webpack'),
  path=require('path'),
  distPath = path.join(__dirname, '/dist/js/');
module.exports = {
  entry: './src/js/test.js',
  output: {
    path: distPath,
    filename: 'app.js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  },
  resolve: {
    modulesDirectories: ["web_modules", "node_modules", "bower_components"]
  },
  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
    )
  ]
}