require('./models')
const User = require('./models/User.js')


const userTest = async () => {
  try {
    // CREATE
    const newUser = new User({
      name: 'bing',
      email: 'bing@bang.com',
      password: 'bingbang'
    })
  
    await newUser.save()
    console.log('newUser', newUser)

    // READ
    const foundUser =  await User.findOne({
      name: newUser.name
    })

    console.log('foundUser', foundUser)

    // UPDATE
    foundUser.name = 'bangBang'

    await foundUser.save()

    const findUserAgain = await User.findOne({
      name: 'bangBang'
    })

    console.log('findUserAgain', findUserAgain)

    // DESTROY
    const deleteUser = await User.deleteOne({
      name: 'bangBang'
    })

    console.log('deleteUser', deleteUser)

    // we done
    process.exit()
  } catch (error) {
    console.log(error)
    process.exit()
  }
}

userTest()