const jwt = require('jsonwebtoken')

const jwtTest = (async () => {
  try {
    // create jwt payload
    const payload = {
      name: 'user name',
      id: 'im a user id!'
    }
  
    // sign a jwt token
    const token = await jwt.sign(payload, 'My super big secret', { expiresIn: 3600 })
    console.log(token)
    
    // decode jst token
    const decode = await jwt.verify(token, 'My super big secret')
    console.log(decode)
    
  } catch(error) {
    console.log(error)
  } 
})()