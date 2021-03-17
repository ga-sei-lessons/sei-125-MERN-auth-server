const router = require('express').Router()
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// GET /users - test endpoint
router.get('/', (req, res) => {
  res.json({ msg: 'welcome to the users endpoint' })
})

// POST /users/register - CREATE new user
router.post('/register', async (req, res) => {
  try {
    // check if user exists already
    const findUser = await User.findOne({
      email: req.body.email
    })

    // don't allow emails to register twice
    if(findUser) return res.status(400).json({ msg: 'email exists already', body: req.body})
  
    // hash password
    const password = req.body.password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds)
  
    // create new user
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
  
    await newUser.save()

    // create jwt payload
    const payload = {
      name: newUser.name,
      id: newUser.id
    }

    // sign jwt and send back
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 })

    res.json({ token })
  } catch (error) {
    next(error)
  }
})

// POST /users/login -- validate login credentials
router.post('/login', async (req, res) => {
  try {
    // try to find user in the db
    const foundUser = await User.findOne({
      email: req.body.email
    })

    const noLoginMessage = 'Incorrect username or password'

    // if the user is not found in the db
    if(!foundUser) return res.status(400).json({ msg: noLoginMessage, body: req.body})
    
    // check the password from the req body against the database
    const matchPasswords = await bcrypt.compare(req.body.password, foundUser.password)
    
    // if provided password does not match
    if(!matchPasswords) return res.status(400).json({ msg: noLoginMessage, body: req.body})

    // create jwt payload
    const payload = {
      name: foundUser.name,
      email: foundUser.email, 
      id: foundUser.id
    }

    // sign jwt and send back
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 })

    res.json({ token })
  } catch(error) {
    next(error)
  }
})

// GET /users/auth - validate a jwt token (but thats it)
router.get('/auth', async (req, res) => {
  try {
    // jwt from client
    const authHeader = req.headers.authorization
    // will throw to catch if jwt can't be verified
    const decode = await jwt.verify(authHeader, process.env.JWT_SECRET)
    // res with status of okay if jwt was verified
    res.status(200).json({ msg: 'auth succeeded' })
  } catch (error) {
    console.log(error)
    // respond with status 400 if auth fails
    res.status(400).json({ msg: 'auth failed' })
  }
})

module.exports = router