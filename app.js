const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

//setting body-parser
app.use(bodyParser.urlencoded({ extended: true }))

//setting handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting css
app.use(express.static('public'))

//setting mongodb
mongoose.set('debug', true)
mongoose.connect('mongodb://localhost/', { useNewUrlParser: true, useCreateIndex: true })

const db = mongoose.connection

//連線異常
db.on('error', () => {
  console.log('mongodb error')
})

//連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

//setting routers
app.get('/', (req, res) => {

})

app.post('/', (req, res) => {

})


app.listen(3000, () => {
  console.log('Express is running on http://localhost:3000')
})
