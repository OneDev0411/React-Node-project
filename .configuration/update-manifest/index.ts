import fs from 'fs-extra'
import path from 'path'

import manifest from '../../manifest.json'

export function main() {
  manifest.build = Math.floor(new Date().getTime() / 1000).toString()
  
  fs.writeFileSync(
    path.resolve(__dirname, '../../manifest.json'), 
    JSON.stringify(manifest, null, 2)
  )
}

main()