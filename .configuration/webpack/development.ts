import { merge } from 'webpack-merge'
import Webpackbar from 'webpackbar'

import type { Configuration } from 'webpack'

import base from './base'

const config: Configuration = {
  mode: 'development',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new Webpackbar()
  ]
}

export default merge(base, config)