const path = require('path');

module.exports = {
  entry: {
    firebase: './www/js/services/Firebase.ts',
    scoreboard: './www/js/services/Scoreboard.ts',
    game: './www/js/index.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'www', 'dist')
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'www')
    },
    compress: true,
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
};