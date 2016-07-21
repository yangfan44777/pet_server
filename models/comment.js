var mongoose = require( 'mongoose' )
const Schema = mongoose.Schema

const commentSchema = new Schema( {
  feed_id : String,
  commenter_id : String,
  commenter_nick : String,
  content : String,
  commentee : {
    commentee_id : String,
    commentee_nick : String
  },
  isdeleted : Number
} )

module.exports = mongoose.model( 'Comment', commentSchema )
