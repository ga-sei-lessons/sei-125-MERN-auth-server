const router = require('express').Router()

// GET /users - test endpoint
router.get('/', (req, res) => {
  res.json({ msg: 'welcome to the users endpoint' })
})

router.post('/register', (req, res) => {
  res.json({ msg: 'register a user', body: req.body})
})

router.post('/login', (req, res) => {
  res.json({ msg: 'login a user' , body: req.body })
})

module.exports = router