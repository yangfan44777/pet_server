var mongoose = require( 'mongoose' )
const Schema = mongoose.Schema

const topicSchema = new Schema( {
  title : String,
  image_url : String,
  desc : String,
  feeds : Array
} )

module.exports = mongoose.model( 'Topic', topicSchema )
