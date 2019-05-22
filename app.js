const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Url = require('./models/url')
const generateRandomString = require('./shorten')
const flash = require('connect-flash')

//setting body-parser
app.use(bodyParser.urlencoded({ extended: true }))

//setting handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting css
app.use(express.static('public'))

//setting mongodb
mongoose.set('debug', true)
mongoose.connect('mongodb://localhost/url', { useNewUrlParser: true, useCreateIndex: true })

const db = mongoose.connection

//連線異常
db.on('error', () => {
  console.log('mongodb error')
})

//連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

//connect-flash
app.use(flash())


//setting routers
app.get('/', (req, res) => {
  res.render('index')
})


app.post('/', (req, res) => {
  const { url } = req.body

  let errors = []

  Url.findOne({ originalUrl: url }).then(url => {
    if (url) {
      errors.push({ message: '這個網址已經產生過短網址!' })
      res.render('index', { errors, url })
    } else {
      const newUrl = new Url({ originalUrl: req.body.url, shortenUrl: generateRandomString() })

      Url.findOne({ shortenUrl: newUrl.shortenUrl }).then(url => {
        if (url) {
          return newUrl
        } else {
          newUrl.save().then(url => {
            console.log(url.shortenUrl)
            res.redirect(`/${url.shortenUrl}`)
          })
            .catch(err => console.log(err))
        }
      })
    }
  })
})


app.get('/:shortenUrl', (req, res) => {
  Url.findOne({ shortenUrl: req.params.shortenUrl }).then(url => {
    createUrl = 'http://localhost:3000/' + url.shortenUrl
    res.render('shorten', { url, createUrl })
  })
    .catch(err => console.log(err))
})


app.listen(3000, () => {
  console.log('Express is running on http://localhost:3000')
})
