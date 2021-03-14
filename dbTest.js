require('dotenv').config()
const mongoose = require('mongoose')
const db = require('./models')

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
    })

    db.on('error',  err => {
      console.error(`🔥 Database Error:\n${err}`);
    })

  } catch (error) {
    console.log(error)
  }
})()

const userTest = (async () => {
  try {
    // CREATE
    const newUser = new db.User({
      name: 'bing',
      email: 'bing@bang.com',
      password: 'bingbang'
    })
  
    await newUser.save()
    console.log('newUser', newUser)

    // READ
    const foundUser =  await db.User.findOne({
      name: newUser.name
    }).exec()

    console.log('foundUser', foundUser)

    // UPDATE
    foundUser.name = 'bangBang'

    await foundUser.save()

    const findUserAgain = await db.User.findOne({
      name: 'bangBang'
    }).exec()

    console.log('findUserAgain', findUserAgain)

    // DESTROY
    const deleteUser = await db.User.deleteOne({
      name: 'bangBang'
    }).exec()

    console.log('deleteUser', deleteUser)

    // we done
    process.exit()
  } catch (error) {
    console.log(error)
    process.exit()
  }
})()