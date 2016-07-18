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
  likes : [  ],
  like_count : Number,
  comments : [  ],
  comment_count : Number,
  topic : String,
  isdeleted : Number
} )

var Feed = mongoose.model( 'Feed', feedSchema );

ModelExtend.doApply(Feed);

module.exports = Feed;//mongoose.model( 'Feed', feedSchema )
