import app from './app/app'

const {
  SERVER_PORT: port,
  SERVER_HOST: host,
  APP_HOME = '/'
} = process.env

app.listen(port, host, () => {
  console.log(`-> server running at: http://${host}:${port}${APP_HOME}`)
})
