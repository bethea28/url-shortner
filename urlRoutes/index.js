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
  console.log('full', fullUrl)
  const final = await Url.find()
  let last = final.filter((a) => {
    return a.shortUrl === fullUrl
  })
  console.log('final', last)

  let end = last[0] ? last[0].longUrl : null
  res.redirect('https://' + end)
}

const getAllUrls = async (req, res, next) => {
  const final = await Url.find()
  res.send(final)
}

const createShortUrl = async (req, res, next) => {
  // let split = req.body ? req.body.longUrl.split(' ').join('') : null
  // console.log('req.body', req.body)
  if (!req.body.longUrl) {
    console.log('four', req.body)
    res.status(400).send({ error: 'no body' })
  } else if (req.body.longUrl ? req.body.longUrl.includes(' ') : null) {
    console.log('one')
    console.log('req.boduy', req.body)
    res.status(400).send({ error: 'bad ass url; has spaces' })
    // throw new Error('BROKEN')
    // next()
  } else {
    console.log('two', req.body)
    await Url.findOrCreate({
      longUrl: req.body.longUrl,
      shortUrl: req.body.shortUrl,
    }).then((result) => {
      console.log('three', result)
      res.status(200).json({ data: 'good' })
    })
  }
  // Url.findOrCreate({
  //   longUrl: req.body.longUrl,
  //   shortUrl: req.body.shortUrl,
  // })
  //   .then(function (result) {
  //     console.log('thenn')
  //     let final = result.doc
  //     res.status(200).send({
  //       shortUrl: req.body.shortUrl,
  //       data: 'goodd',
  //     })
  //   })
  //   .catch((err) => {
  //     console.log('CATch')
  //   })
}

urlRoutes.route('/getAllUrls').get(getAllUrls)
urlRoutes.route('/*').get(redirect)
urlRoutes.route('/').post(createShortUrl)

module.exports = urlRoutes
