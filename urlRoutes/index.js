var express = require('express')
var app = express()
var urlRoutes = express.Router()
var Schemas = require('../models.js')
const axios = require('axios')
const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')

let Url = mongoose.model('Url', Schemas.UrlSchema)

const redirect = async (req, res, next) => {
  let baseUrl = req.headers.host
  let fullUrl = baseUrl + req._parsedUrl.path
  const final = await Url.find()
  let last = final.filter((a) => {
    return a.shortUrl === fullUrl
  })

  let end = last[0] ? last[0].longUrl : null
  res.redirect('https://' + end)
}

const getAllUrls = async (req, res, next) => {
  const final = await Url.find()
  res.send(final)
}

const createShortUrl = async (req, res) => {
  Url.findOrCreate({
    longUrl: req.body.longUrl,
    shortUrl: req.body.shortUrl,
  }).then(function (result) {
    let final = result.doc
    res.send(final)
  })
}

urlRoutes.route('/getAllUrls').get(getAllUrls)
urlRoutes.route('/*').get(redirect)
urlRoutes.route('/').post(createShortUrl)

module.exports = urlRoutes
