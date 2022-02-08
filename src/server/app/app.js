
import api from './routes/api'
import { resolve } from 'path'
import staticRoute from './routes/static'
import express from 'express'
import index from './routes/view-index'
import logger from 'morgan'

const {
  APP_HOME
} = process.env

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('tiny'))
staticRoute(app)
app.set('views', resolve(__dirname, '../views'))
app.set('view engine', 'pug')
app.get(APP_HOME, index)
api(app)

export default app
