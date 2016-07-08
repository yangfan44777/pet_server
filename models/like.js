var mongoose = require( 'mongoose' )
const Schema = mongoose.Schema

const likeSchema = new Schema( {
  feed_id : String,
  liker_id : String,
  liker_avator : String,
} )

module.exports = mongoose.model( 'Like', likeSchema )
