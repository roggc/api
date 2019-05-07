//webpack.config.js

const path= require('path')
const nodeExternals = require('webpack-node-externals')

module.exports=
{
  target: 'node',
  externals: [nodeExternals()],
  entry:
  {
    server: './src/server.js'
  },
  output:
  {
    path: path.join(__dirname,'out'),
    filename: '[name].bundle.js'
  },
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
  }
}
