import express from 'express'

import homeRoute from './app/controllers/home'
import manifestRoute from './app/controllers/manifest'

const router = express.Router()

router.get('/', homeRoute)

/**
 * Please don't remove this route
 */
router.get('/manifest.json', manifestRoute)

export default router
