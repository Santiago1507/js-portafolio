const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

//se genera el module.export para pasarle las configuraciones que va a contener nuestro webpack
module.exports = {
  //con entry establecemos el punto inicial de nuestra app
  entry: './src/index.js',
  //se genera el output para enviar todo el codigo compilado por defecto se llama dist
  output: {
    path: path.resolve(__dirname, 'dist'), //con este path se asegura que en cualquier momento el va a poder reconocer la ruta del directorio
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'assets/images/[hash][ext][query]',
  },
  mode: 'production',
  // conf de las extenciones con las que se van a trabajar
  resolve: {
    extensions: ['.js'],
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@templates': path.resolve(__dirname, 'src/templates/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@images': path.resolve(__dirname, 'src/assets/images/'),
    },
  },
  module: {
    // se genera un modulo para pasarle unas reglas y configurar el babel loader
    rules: [
      {
        //lo primero es relizar un test con una exprecion regular la cual significa que va a usar cualquier archivo .js o .mjs
        test: /\.js$/,
        // Use es un arreglo u objeto donde dices que loader aplicaras
        use: {
          loader: 'babel-loader',
        },
        // Exclude permite omitir archivos o carpetas especificas
        exclude: /node_modules/,
      },
      {
        test: /\.css|.styl$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'],
      },
      {
        test: /\.png/,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
            name: '[name].[contenthash].[ext]',
            outputPath: './assets/fonts/',
            publicPath: '../assets/fonts/',
            esModule: false,
          },
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './public/index.html',
      filename: './index.html',
    }),

    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css',
    }),
    //Esta instancia me permite generar  copias de imagenes y poder optimizar la carga
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', 'assets/images'),
          to: 'assets/images',
        },
      ],
    }),
    //Esta instancia me permite crear ambientes de tramajo
    new Dotenv(),
    //Esta instancia me permite borrar los archivos basura que se genera en cada job
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(), // minimizar archivos relacionados con css
      new TerserPlugin(),
    ], // minimizar archivos relacionados con js
  },
};
