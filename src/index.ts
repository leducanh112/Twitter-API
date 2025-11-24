import express from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/errors.middlewares'

databaseService.connect()

const app = express()
const port = 3000

app.use(express.json())
app.use('/users', userRouter)
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
