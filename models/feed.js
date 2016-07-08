var mongoose = require( 'mongoose' )
const Schema = mongoose.Schema

const feedSchema = new Schema( {
  avator : String,
  userid : String,
  nick : String,
  date : Date,
  image : String,
  content : String,
  likes : [  ],
  like_count : Number,
  comments : [  ],
  comment_count : Number,
  topic : String
} )

module.exports = mongoose.model( 'Feed', feedSchema )
