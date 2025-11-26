import { Router } from 'express'
import { serveImageController } from '~/controllers/media.controllers'

const staticRouter = Router()

staticRouter.get('/image/:name', serveImageController)

export default staticRouter
