// const chai = require('chai')
// const { expect } = chai
// const chaiHttp = require('chai-http')
// const mongoose = require('mongoose')
// const app = require('../src/app')
// const ShortenedUrl = require('../src/models/url')
// // const URL = require('url').URL
// const { URLPattern, randomString } = require('./utils')

// chai.use(chaiHttp)
// mongoose.Promise = global.Promise

// describe('Candidate tests', (done) => {
//   beforeEach(() =>
//     mongoose.connect('mongodb://localhost/test', {
//       useFindAndModify: false,
//       useNewUrlParser: true,
//       useCreateIndex: true,
//     })
//   )

//   afterEach((done) =>
//     mongoose.connection.db.dropDatabase(() => mongoose.connection.close(done))
//   )

//   describe('POST /data/shorten', function (done) {
//     it('should create a shortened URL', function (done) {
//       const url = 'www.hello.com'
//       chai
//         .request(app)
//         .post('/data/shorten')
//         .type('form')
//         .send({ url })
//         .end((err, res) => {
//           expect(err).to.be.null
//           expect(res).to.have.status(200)
//           expect(res).to.be.json
//           expect(res.body.data).to.be.a('string')
//           expect(!!URLPattern.test(res.body.data)).to.be.true
//           expect(url).to.not.equal(res.body.data)
//           done()
//         })
//     })

//     it('should error when receiving a bad url', function (done) {
//       chai
//         .request(app)
//         .post('/data/shorten')
//         .type('form')
//         .send({ url: 'I am a bad URL' })
//         .end((err, res) => {
//           expect(err).to.be.null
//           expect(res).to.have.status(400)
//           expect(res).to.be.json
//           expect(res.body.error).to.be.a.string
//           done()
//         })
//     })

//     it('should return shortened URL even if shortened url is longer than supplied URL', function (done) {
//       const url = 'a.co'
//       chai
//         .request(app)
//         .post('/data/shorten')
//         .type('form')
//         .send({ url })
//         .end((err, res) => {
//           const shortened = res.body.data.slice(0).replace(/(^\w+:|^)\/\//, '')
//           expect(err).to.be.null
//           expect(res).to.have.status(200)
//           expect(res).to.be.json
//           expect(url.length).to.be.lessThan(shortened.length)
//           done()
//         })
//     })

//     it('should return same shortened URL if submitted twice', function (done) {
//       const url = 'www.webflow.com'
//       chai
//         .request(app)
//         .post('/data/shorten')
//         .type('form')
//         .send({ url })
//         .end((err1, res1) => {
//           chai
//             .request(app)
//             .post('/data/shorten')
//             .type('form')
//             .send({ url })
//             .end((err2, res2) => {
//               expect(!!URLPattern.test(res1.body.data)).to.be.true
//               expect(!!URLPattern.test(res2.body.data)).to.be.true
//               expect(res1).to.have.status(200)
//               expect(res2).to.have.status(200)
//               expect(res1.body.data).to.equal(res2.body.data)
//               done()
//             })
//         })
//     })

//     it('should return different URLs for different input URLs', function (done) {
//       chai
//         .request(app)
//         .post('/data/shorten')
//         .type('form')
//         .send({ url: 'www.webflow.com' })
//         .end((err1, res1) => {
//           chai
//             .request(app)
//             .post('/data/shorten')
//             .type('form')
//             .send({ url: 'webflow.com/ix2' })
//             .end((err2, res2) => {
//               expect(!!URLPattern.test(res1.body.data)).to.be.true
//               expect(!!URLPattern.test(res2.body.data)).to.be.true
//               expect(res1).to.have.status(200)
//               expect(res2).to.have.status(200)
//               expect(res1.body.data).to.not.equal(res2.body.data)
//               done()
//             })
//         })
//     })

//     it('should return different URLs for different input URLs in concurrent requests', function (done) {
//       Promise.all(
//         ['www.webflow.com', 'webflow.com/ix2'].map(
//           (url) =>
//             new Promise((resolve) => {
//               chai
//                 .request(app)
//                 .post('/data/shorten')
//                 .type('form')
//                 .send({ url: url })
//                 .end((err, res) => {
//                   expect(err).to.be.null
//                   expect(res.body.err).to.be.undefined
//                   resolve(res.body.data)
//                 })
//             })
//         )
//       ).then(([url1, url2]) => {
//         expect(url1).not.to.equal(url2)
//         done()
//       })
//     })

//     it('should error if no x-www-form-urlencoded { url: String } provided', function (done) {
//       const url = 'a.co'
//       chai
//         .request(app)
//         .post('/data/shorten')
//         .end((err, res) => {
//           expect(err).to.be.null
//           expect(res).to.have.status(400)
//           expect(res).to.be.json
//           expect(res.body.error).to.be.a.string
//           done()
//         })
//     })

//     it('should return hostname as wf.io', function (done) {
//       chai
//         .request(app)
//         .post('/data/shorten')
//         .type('form')
//         .send({ url: 'www.webflow.com' })
//         .end((err, res) => {
//           expect(err).to.be.null
//           expect(res).to.have.status(200)
//           expect(res).to.be.json
//           expect(!!URLPattern.test(res.body.data)).to.be.true
//           const url = new URL(res.body.data)
//           expect(url.hostname).to.equal('wf.io')
//           done()
//         })
//     })

//     it('should return pathname that is <= 8 characters', function (done) {
//       chai
//         .request(app)
//         .post('/data/shorten')
//         .type('form')
//         .send({ url: 'www.webflow.com' })
//         .end((err, res) => {
//           expect(err).to.be.null
//           expect(res).to.have.status(200)
//           expect(res).to.be.json
//           expect(!!URLPattern.test(res.body.data)).to.be.true
//           const url = new URL(res.body.data)
//           expect(url.pathname.length).to.be.greaterThan(1)
//           expect(url.pathname.length).to.be.lessThan(9)
//           done()
//         })
//     })

//     it('fuzzy: should return slugs without clashes', function (done) {
//       this.timeout(10000)
//       const amount = 2
//       const protocol = ['http', 'https']
//       const urls = Array.from(
//         new Set(Array.from(new Array(100)).map(() => randomString(5)))
//       )
//       const tld = ['com', 'net', 'co', 'co.uk']
//       var variants = []
//       protocol.forEach((protocol) => {
//         urls.forEach((url) => {
//           tld.forEach((tld) => {
//             const u = `${protocol}://${url}.${tld}`
//             variants.push(`${protocol}://${url}.${tld}`)
//           })
//         })
//       })

//       Promise.all(
//         variants.map(
//           (url) =>
//             new Promise((resolve) => {
//               chai
//                 .request(app)
//                 .post('/data/shorten')
//                 .type('form')
//                 .send({ url })
//                 .end((err, res) => {
//                   expect(err).to.be.null
//                   expect(res.body.error).to.be.undefined
//                   expect(res).to.have.status(200)
//                   expect(res).to.be.json
//                   expect(!!URLPattern.test(res.body.data)).to.be.true
//                   resolve(res.body.data)
//                 })
//             })
//         )
//       )
//         .then((urls) => {
//           expect(Array.from(new Set(urls))).to.have.length(urls.length)
//           done()
//         })
//         .catch((err) => {
//           expect(err).to.be.null
//           done()
//         })
//     })
//   })

//   it('should not use test utils in application code', () => {
//     const path = require('path')
//     const fs = require('fs')
//     const src = path.join(__dirname, '..', 'src')
//     function readDir(dir) {
//       fs.readdir(dir, (err, files) => {
//         if (err) {
//           // assume qualified.io runner access error
//           console.error(err)
//           return
//         }
//         files.forEach((file) => {
//           const p = path.join(dir, file)
//           const stats = fs.lstatSync(p)
//           if (stats.isDirectory()) {
//             return readDir(p)
//           } else if (stats.isFile()) {
//             if (fs.readFileSync(p, 'utf8').indexOf('../test/utils') > 0) {
//               throw new Error('Test utils in application code is disallowed.')
//             }
//             return
//           } else {
//             // ignore other file types that may exist in qualified.io
//           }
//         })
//       })
//     }
//     readDir(src)
//   })
// })
