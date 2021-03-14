// require packages
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rowdy = require('rowdy-logger')
const morgan = require('morgan')
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
const db = require('./models')

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

// mongoose config
const MONGODB_URI = process.env.MONGODB_URI

const mongoConnect = (async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    const db = mongoose.connection;

    // Connection methods
    db.once('open', () => {
      console.log(`🔗 Connected to MongoDB at ${db.host}:${db.port}`);
    });

    db.on('error',  err => {
      console.error(`🔥 Database Error:\n${err}`);
    });

  } catch (error) {
    console.log(error)
  }
})()

// auth middleware
app.use(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const decode = await jwt.verify(authHeader, process.env.JWT_SECRET)
    console.log(decode)
    const foundUser = await db.User.findById(decode.id)
    console.log(foundUser)
    res.locals.user = foundUser
    next()
  
  } catch(error) {
    res.locals.user = null
    console.log(error)
    next({type: 'auth', error: error})
  }
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