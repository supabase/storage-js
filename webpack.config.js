const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: './src/index.ts',
  externals: {
    'tus-js-client': 'tus-js-client',
  },
  output: {
    path: path.resolve(__dirname, 'dist/umd'),
    filename: 'supabase.js',
    library: {
      type: 'umd',
      name: 'supabase',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  plugins: [
    new webpack.DefinePlugin({
      process: 'process/browser',
    }),
  ],
}
