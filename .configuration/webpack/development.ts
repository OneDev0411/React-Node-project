import { merge } from 'webpack-merge'
import Webpackbar from 'webpackbar'

import type { Configuration } from 'webpack'

import base from './base'

const config: Configuration = {
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new Webpackbar()
  ]
}

export default merge(base, config)