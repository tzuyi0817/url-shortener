const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Url = require('./models/url')
const shortenUrl = require('./shorten')
const flash = require('connect-flash')

//dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//setting body-parser
app.use(bodyParser.urlencoded({ extended: true }))

//setting handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting css
app.use(express.static('public'))

//setting mongodb
mongoose.set('debug', true)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/url', { useNewUrlParser: true, useCreateIndex: true })

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
      const existUrl = 'http://localhost:3000/' + url.shortenUrl
      console.log(existUrl)
      res.render('index', { errors, url, existUrl })
    } else {
      const newUrl = new Url({ originalUrl: req.body.url, shortenUrl: shortenUrl() })

      newUrl.save().then(url => {
        console.log(url.shortenUrl)
        const createUrl = 'http://localhost:3000/' + url.shortenUrl
        res.render('index', { createUrl })
      })
        .catch(err => console.log(err))
    }
  })
    .catch(err => console.log(err))
})


app.get('/:shortenUrl', (req, res) => {

  Url.findOne({ shortenUrl: req.params.shortenUrl }).then(url => {
    res.redirect(url.originalUrl)
  })
    .catch(err => console.log(err))
})


app.listen(process.env.PORT || 3000, () => {
  console.log('Express is running on http://localhost:3000')
})
