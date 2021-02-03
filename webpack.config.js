const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ENV = process.env.npm_lifecycle_event;
const isDev = ENV === 'dev';
const isProd = ENV === 'build';

function setDevTool() {
  if (isDev) {
    return 'cheap-module-eval-source-map';
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
  target: "web",
  entry: {index: './src/js/index.js'},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  mode: setDMode(),
  devtool: setDevTool(),
  module: {
    rules: [{
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: false
        }
      }]
    },
      {
        test: /\.js$/,
        use: ['babel-loader' , 'eslint-loader' ],
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'postcss-loader',
            options: { sourceMap: true, config: { path: './postcss.config.js' } }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'postcss-loader',
            options: { sourceMap: true, config: { path: './postcss.config.js' } }
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|svg|gif|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'img',
              name: '[name].[ext]'
            }},
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug : true,
              mozjpeg: {
                progressive: true,
                quality: 75
              },
              // optipng.enabled: false will disable optipng
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
          }
        ]
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'fonts'
          }
        }]
      },
      {
        test: /\.(mp3|wav|wma|ogg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'audio'
          }
        }
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
      favicon: './src/icon/favicon.ico'
    }),
    new CopyWebpackPlugin([
      // {from: './src/static', to: './'},
      {from: './src/icon/cash.svg', to: './icon/cash.svg'},
      {from: './src/icon/web.svg', to: './icon/web.svg'},
      {from: './src/icon/food.svg', to: './icon/food.svg'},
      {from: './src/icon/foods.svg', to: './icon/foods.svg'},
      {from: './src/icon/car.svg', to: './icon/car.svg'},
      {from: './src/icon/care.svg', to: './icon/care.svg'},
      {from: './src/icon/family.svg', to: './icon/family.svg'},
      {from: './src/icon/gifts.svg', to: './icon/gifts.svg'},
      {from: './src/icon/health.svg', to: './icon/health.svg'},
      {from: './src/icon/home.svg', to: './icon/home.svg'},
      {from: './src/icon/other.svg', to: './icon/other.svg'},
      {from: './src/icon/rest.svg', to: './icon/rest.svg'},
      {from: './src/icon/shopping.svg', to: './icon/shopping.svg'},
      {from: './src/icon/study.svg', to: './icon/study.svg'},
      {from: './src/icon/card.svg', to: './icon/card.svg'},
      {from: './src/icon/favicon.ico', to: './icon/favicon.ico'},
      {from: './src/icon/options.svg', to: './icon/options.svg'},
      {from: './src/icon/analytics.svg', to: './icon/analytics.svg'},
      {from: './src/icon/operations.svg', to: './icon/operations.svg'},
      {from: './src/icon/search.svg', to: './icon/search.svg'},
      {from: './src/icon/plus.svg', to: './icon/plus.svg'},
      {from: './src/icon/minus.svg', to: './icon/minus.svg'},
      {from: './src/icon/delete.svg', to: './icon/delete.svg'},
      {from: './src/icon/analytics-chosen.svg', to: './icon/analytics-chosen.svg'},
      {from: './src/icon/operations-chosen.svg', to: './icon/operations-chosen.svg'},
      {from: './src/icon/accounts.svg', to: './icon/accounts.svg'},
      {from: './src/icon/options-chosen.svg', to: './icon/options-chosen.svg'},
      {from: './src/icon/github.svg', to: './icon/github.svg'},
      {from: './src/icon/in.svg', to: './icon/in.svg'},
      {from: './src/icon/rs.svg', to: './icon/rs.svg'}
    ]),
  ],

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    overlay: true,
    stats: 'errors-only',
    clientLogLevel: 'none'
  }
}

module.exports = config;