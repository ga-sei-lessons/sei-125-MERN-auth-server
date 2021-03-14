// require packages
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rowdy = require('rowdy-logger')
const morgan = require('morgan')
const mongoose = require("mongoose")

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



// GET / - for testing 
app.get('/', (req, res) => {
  res.json({ msg: 'Hello Planet Earth 🌏'})
})

// controllers
app.use('/api-v1/users', require('./controllers/api-v1/users.js'))

// 404 middleware
app.use((req, res, next) => {
  res.status(404).json({ msg: 'resource note found 😅' })
})

// error handling middleware
app.use((req, res, next, err) => {
  res.status(500).json({ msg: 'something has gone terribly wrong 🚨', err })
  console.log(err)
})

// hey, listen...
app.listen(PORT, () => {
  rowdyResults.print()
  console.log(`listening to the smooth sounds of ${PORT} in morning 🌊`)
})