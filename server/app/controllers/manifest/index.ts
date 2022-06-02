import { Request, Response } from 'express'

import manifest from '../../../../manifest.json'

export default async (req: Request, res: Response) => {
  res.json(manifest)
}
