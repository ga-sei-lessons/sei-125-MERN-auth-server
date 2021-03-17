// require packages
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rowdy = require('rowdy-logger')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
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

// auth middleware
// jwt middleware on every route makes reqs with bad auth tokens
// default to 500 res's or get stuck in redirect loops
// app.use(async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization
//     const decode = await jwt.verify(authHeader, process.env.JWT_SECRET)
//     console.log(decode)
//     const foundUser = await db.User.findById(decode.id)
//     console.log(foundUser)
//     res.locals.user = foundUser
//     next()
  
//   } catch(error) {
//     res.locals.user = null
//     // console.log(error)
//     // next({type: 'auth', error: error})
//     res.redirect('/')
//   }
// })

// maybe this isn't needed
app.use((req, res, next) => {
  res.locals.user = null
  next()
})

// route specific middleware for jwt authorization
const authRoute = async (req, res, next) => {
    try {
    // jwt from client
    const authHeader = req.headers.authorization
    // will throw to catch if jwt can't be verified
    const decode = await jwt.verify(authHeader, process.env.JWT_SECRET)
    // find user from db
    const foundUser = await db.User.findById(decode.id)
    // mount user on locals
    res.locals.user = foundUser
    next()
  
  } catch(error) {
    console.log(error)
    // respond with status 400 if auth fails
    res.status(400).json({ msg: 'auth failed' })
  }
} 

// GET / - for testing 
app.get('/', (req, res) => {
  console.log(res.locals)
  res.json({ msg: 'Hello Planet Earth 🌏', user: res.locals.user})
})

// controllers
app.use('/api-v1/users', require('./controllers/api-v1/users.js'))

// GET /auth-locked - will redirect if bad jwt token is found
app.get('/auth-locked', authRoute, (req, res) => {
  res.json({ msg: 'welcome to the auth route' })
})

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