import { merge } from 'webpack-merge'

const __DEV__ = process.env.NODE_ENV !== 'production'
const webpack = require(`./.configuration/webpack/${__DEV__ ? 'development' : 'production'}`).default

export default merge(webpack, {
  // your custom webpack configurations here
})