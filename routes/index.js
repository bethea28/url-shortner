var express = require('express')
var app = express()
var artistRoutes = express.Router()
var Schemas = require('../models.js')
const axios = require('axios')
const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')

// let FinalPerson = Person.model('Person', Person.PersonSchema)
// console.log("SCHEM", Schemas.UrlSchema);
let Url = mongoose.model('Url', Schemas.UrlSchema)
// let Exercise = mongoose.model("Excercise", Schemas.ExcerciseSchema);
// console.log("FinalPerson", Exercise);
// var Artist = require('../models/artist-model')
// module.exports = mongoose.model("Person", PersonSchema);

// MyModel.find({ name: 'john', age: { $gte: 18 }});

const redirect = async (req, res, next) => {
  let baseUrl = req.headers.host
  let path = req.baseUrl
  let fullUrl = baseUrl + req._parsedUrl.path
  console.log('FLULL', req._parsedUrl)
  const final = await Url.find()
  let last = final.filter((a) => {
    console.log('shorturl', a.shortUrl)
    return a.shortUrl === fullUrl
  })
  console.log('lastyl', last)

  let end = last[0] ? last[0].longUrl : null
  console.log('END', end)
  console.log('LAST', last[0])
  // res.redirect(end)
  // res.redirect('https://' + last.longUrl)
  res.redirect('https://' + end)
  console.log('GETTTTI IT SHAWTY', req.headers.host)
}

const getAllUrls = async (req, res, next) => {
  console.log('GETALL')
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

artistRoutes.route('/getAllUrls').get(getAllUrls)
artistRoutes.route('/*').get(redirect)
artistRoutes.route('/').post(createShortUrl)

module.exports = artistRoutes
