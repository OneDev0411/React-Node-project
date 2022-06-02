import path from 'path'
import { merge } from 'webpack-merge'
import manifest from '../../manifest.json'

import base from './base'

export default merge(base, {
  mode: 'production',
  output: {
    filename: `bundle.${manifest.build}.js`,
    path: path.resolve(__dirname, '../../dist-web')
  }
})