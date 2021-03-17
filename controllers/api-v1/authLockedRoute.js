const jwt = require('jsonwebtoken')
const User = require('../../models/User.js')

// route specific middleware for jwt authorization
const authLockedRoute = async (req, res, next) => {
  try {
  // jwt from client
  const authHeader = req.headers.authorization
  // will throw to catch if jwt can't be verified
  const decode = await jwt.verify(authHeader, process.env.JWT_SECRET)
  // find user from db
  const foundUser = await User.findById(decode.id)
  // mount user on locals
  res.locals.user = foundUser
  next()

  } catch(error) {
    console.log(error)
    // respond with status 400 if auth fails
    res.status(400).json({ msg: 'auth failed' })
  }
} 

module.exports = authLockedRoute