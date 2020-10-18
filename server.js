require('dotenv').config()

const fs = require('fs')
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config.js')
const mongoose = require('mongoose')
const urlRoutes = require('./urlRoutes')
const bodyParser = require('body-parser')
const compiler = webpack(webpackConfig)
const app = express()
const PORT = process.env.PORT || 4000

const db = mongoose.connection
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use(express.static('bundle'))
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('connected to database'))
// HMR

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  })
)
app.use(
  webpackHotMiddleware(compiler, {
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
  })
)

// /api/breeds endpoint
// app.get('/api/breeds', (_, res) => {
//   res.writeHead(200, { 'content-type': 'application/json' })
//   fs.createReadStream('./data/breeds.json').pipe(res)
// })

// assets

app.get('/', (_, res) => {
  res.sendFile(`${__dirname}/index.html`)
})
app.use('/', urlRoutes)

mongoose.connect(process.env.REACT_APP_NOT_MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
app.listen(PORT, () => {
  global.console.log(`Listening on ${PORT}`)
})
