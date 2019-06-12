const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Plant
let schema = new Schema(
{   
  username: {
    type: String
  },
  salt: {
    type: String
  },
  passwordHash: {
    type: String
  },
  roles: {
    type: [String]
  },
  emailAddress: {
    type: String
  },
  mobileNumber: {
    type: String
  }
},
{
    collection: 'users'
});

module.exports = mongoose.model('Users', schema);