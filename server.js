// require packages
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rowdy = require('rowdy-logger')
const morgan = require('morgan')
require('./models')

// config express app
const app = express()
const PORT = process.env.PORT
// (╯°□°）╯︵ ┻━┻
const rowdyResults = rowdy.begin(app)
// allow cross origin resource sharing
app.use(cors())
// // log requests
app.use(morgan('tiny'))
// request body parser middleware for POST reqs
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// maybe this isn't needed
app.use((req, res, next) => {
  res.locals.user = null
  next()
})

// GET / - for testing 
app.get('/', (req, res) => {
  console.log(res.locals)
  res.json({ msg: 'Hello Planet Earth 🌏', user: res.locals.user})
})

// controllers
app.use('/api-v1/users', require('./controllers/api-v1/users.js'))

// 404 middleware
app.use((req, res, next) => {
  res.status(404).json({ msg: 'resource note found 😅' })
})

// error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ msg: 'something has gone terribly wrong 🚨' })
  console.log(err)
})

// hey, listen...
app.listen(PORT, () => {
  rowdyResults.print()
  console.log(`listening to the smooth sounds of ${PORT} in morning 🌊`)
})