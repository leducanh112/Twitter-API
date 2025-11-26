import { Router } from 'express'
import { uploadImageController } from '~/controllers/media.controllers'

const mediaRouter = Router()

mediaRouter.post('/upload-image', uploadImageController)

export default mediaRouter
