const nodeExternals = require('webpack-node-externals')

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
  resolve:
  {
    modules:
    [
      "node_modules"
    ],
    extensions: ['.js']
  }
}
