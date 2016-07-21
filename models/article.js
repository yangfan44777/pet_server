var mongoose = require( 'mongoose' )
var ModelExtend = require('./modelExtend.js');

const Schema = mongoose.Schema

var articleSchema = new Schema( {
  id : String,
  title : String,
  desc : String,
  url : String,
  cover : String,
  content : String,
  tags : Array,
  category : String,
  has_recommend : Number // 0 未推荐, 1 推荐
} )

var Article = mongoose.model( 'Article', articleSchema );

ModelExtend.doApply(Article);

module.exports = Article;
