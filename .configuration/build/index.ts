import webpack from 'webpack'
import path from 'path'
import fs from 'fs-extra'

import config from '../../webpack.config'

async function run() {
  console.log('[ + ] Building web app was started')
  
  const stats: any = await compile()

  console.log(
    `[ + ] Webpack compile is complete in ${stats.time / 1000} seconds`
  )

  fs.copySync(
    path.join(path.resolve(__dirname, '../../app'), 'static'),
    path.join(path.resolve(__dirname, '../../dist-web'), 'static')
  )
}

function compile() {
  const compiler = webpack(config)

  return new Promise((resolve, reject) => {
    compiler.run((err: any, stats: any) => {
      if (err) {
        console.trace('Run error', err.stack)

        return reject(err)
      }

      const jsonStats = stats.toJson(true)

      if (jsonStats.errors.length > 0) {
        console.log('[ * ] Webpack compiler encountered errors.')
        jsonStats.errors.forEach((err: any) => {
          console.log(err)
        })

        return reject(new Error('Webpack compiler encountered errors'))
      }

      if (jsonStats.warnings.length > 0) {
        console.log('[ ! ] Webpack compiler encountered warnings.')
        jsonStats.warnings.forEach((warning: any) => {
          console.log(warning.message)
        })
      }

      return resolve(jsonStats)
    })
  })
}

run().catch(error => {
  console.trace('Build Error: ', error)
  process.exit(1)
})
