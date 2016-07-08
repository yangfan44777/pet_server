var mongoose = require( 'mongoose' )
const Schema = mongoose.Schema

const followsSchema = new Schema( {
  userid : String,
  follows : Array
} )

module.exports = mongoose.model( 'Follows', followsSchema )
