import production from './production'

// eslint-disable-next-line
let config = production

if (process.env.NODE_ENV !== 'production') {
  config = require('./development').default
}

export default config
