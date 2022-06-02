import path from 'path'
import type { Configuration } from "webpack"

const config: Configuration = {
  entry: [
    path.resolve(__dirname, '../../app/index.tsx')
  ],
  output: {
    libraryTarget: 'module'
  },
  experiments: {
    outputModule: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        use: 'file-loader'
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, '../../app'),
      '@libs': path.resolve(__dirname, '../../app/core/libs'),
    },
    extensions: [
      '.tsx',
      '.ts',
      '.js'
    ]
  }
}

export default config