var mongoose = require( 'mongoose' )
var ModelExtend = require('./modelExtend.js');

const Schema = mongoose.Schema

const topicSchema = new Schema( {
  title : String,
  image_url : String,
  desc : String,
  feeds : Array
} )

var Topic = mongoose.model( 'Topic', topicSchema );

ModelExtend.doApply(Topic);

module.exports = Topic;//mongoose.model( 'Topic', topicSchema )
