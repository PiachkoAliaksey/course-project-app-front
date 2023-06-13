const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const ENV = process.env.npm_lifecycle_event;
const isDev = ENV === 'dev';
const isProd = ENV === 'build';

function setDevTool() {
  if (isDev) {
    return 'source-map';
  } else {
    return 'none';
  }
}

function setDMode() {
  if (isProd) {
    return 'production';
  } else {
    return 'development';
  }
}

const config = {
  mode: setDMode(),
  devtool: setDevTool(),
  context: __dirname,
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    overlay: true,
    stats: 'errors-only',
    clientLogLevel: 'none',
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: false
          }
        }]
      },

      {
        test: /\.(ts|js)x?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/env", "@babel/preset-react", "@babel/preset-typescript"],
            plugins: ["@babel/plugin-proposal-class-properties", "@babel/transform-runtime"]
          }
        }
      },

      {
        // Apply rule for .sass, .scss or .css files
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../' // path to director where assets folder is located
            }
          },

          {
            loader: "css-loader"
          },

          {
            loader: "postcss-loader"
          },

          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            }
          }
        ]
      },

      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: './dist/assets/img',
              name: '[name].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              mozjpeg: {
                progressive: true,
                quality: 75
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
                optimizationLevel: 1
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          },
        ]
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: './assets/fonts',
            name: '[name].[ext]'
          }
        }]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/bundle.css"
    }),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname,'src/index.html'),
      filename: 'index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/assets/img'),
          to: path.resolve(__dirname, 'dist/assets/img'),
          noErrorOnMissing: true
        },
      ],
    }),
  ]
};

module.exports = config;

