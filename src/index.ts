import express from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/errors.middlewares'
import mediaRouter from './routes/media.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import staticRouter from './routes/static.routes'
import { UPLOAD_VIDEO_DIR } from './constants/dir'

config()

databaseService.connect()

const app = express()
const port = process.env.PORT || 3000

initFolder()

app.use(express.json())
app.use('/users', userRouter)
app.use('/media', mediaRouter)

app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

app.use('/static', staticRouter)
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
