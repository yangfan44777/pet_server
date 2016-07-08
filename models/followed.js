var mongoose = require( 'mongoose' )
const Schema = mongoose.Schema

const followedSchema = new Schema( {
  userid : String,
  followed : Array
} )

module.exports = mongoose.model( 'Followed', followedSchema )
