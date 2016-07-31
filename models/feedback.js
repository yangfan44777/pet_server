var mongoose = require( 'mongoose' )
const Schema = mongoose.Schema

const feedback = new Schema({
  userid: String,
  content: String,
  date: String
});

module.exports = mongoose.model( 'Feedback', feedback )
