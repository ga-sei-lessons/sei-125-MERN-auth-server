const router = require('express').Router()
const db = require('../../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// GET /users - test endpoint
router.get('/', (req, res) => {
  res.json({ msg: 'welcome to the users endpoint' })
})

router.post('/register', async (req, res) => {
  try {
    // check if user exists already
    const findUser = await db.User.findOne({
      email: req.body.email
    })

    // don't allow emails to register twice
    if(findUser) return res.status(400).json({ msg: 'email exists already', body: req.body})
  
    // hash password
    const password = req.body.password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds)
  
    // create new user
    const newUser = new db.User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
  
    await newUser.save()

    // console.log(newUser.id)
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

router.post('/login', async (req, res) => {
  try {
    // try to find user in the db
    const foundUser = await db.User.findOne({
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
      id: foundUser.id
    }

    // sign jwt and send back
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 })

    res.json({ token })

  } catch(error) {
    next(error)
  }
})

module.exports = router