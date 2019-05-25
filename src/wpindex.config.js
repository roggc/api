const nodeExternals = require('webpack-node-externals')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports=
{
  target: 'node',
  externals: [nodeExternals()],
  entry:['babel-polyfill','./src/index.js'],
  module:
  {
    rules:
    [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use:
        {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins:
  [
    new CleanWebpackPlugin()
  ],
  resolve:
  {
    modules:
    [
      "node_modules"
    ],
    extensions: ['.js']
  }
}
