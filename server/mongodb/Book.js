const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Plant
let schema = new Schema(
{
    title: {
      type: String
    },
    author: {
      type: String
    }
},
{
    collection: 'books'
});

module.exports = mongoose.model('Books', schema);