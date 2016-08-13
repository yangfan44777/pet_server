var mongoose = require( 'mongoose' )
var ModelExtend = require('./modelExtend.js');

const Schema = mongoose.Schema

const feedSchema = new Schema( {
  avator : String,
  userid : String,
  nick : String,
  date : Date,
  image : String,
  content : String,
  //likes : [ { type: Schema.Types.ObjectId, ref: 'Like' } ],
  likes: [
      /*{
        liker_id : String,
        liker_avator : String
      }*/
      Schema.Types.Mixed
  ],
  like_count : Number,
  //comments : [ { type: Schema.Types.ObjectId, ref: 'Comment' } ],
  comments: [
    /*{
      commenter_id : String,
      commenter_nick : String,
      content : String,
      commentee : {
        commentee_id : String,
        commentee_nick : String
      },
      isdeleted : Number
    }*/
    Schema.Types.Mixed
  ],
  comment_count : Number,
  topic : String,
  isdeleted : Number
} )

var Feed = mongoose.model( 'Feed', feedSchema );

ModelExtend.doApply(Feed);

module.exports = Feed;//mongoose.model( 'Feed', feedSchema )
