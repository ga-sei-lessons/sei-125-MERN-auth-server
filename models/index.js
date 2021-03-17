const mongoose = require("mongoose")

// mongoose config
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mernAuth'

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection;

// Connection methods
db.once('open', () => {
  console.log(`🔗 Connected to MongoDB at ${db.host}:${db.port}`);
});

db.on('error',  err => {
  console.error(`🔥 Datacenter burned down:\n${err}`);
});