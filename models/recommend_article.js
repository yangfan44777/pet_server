var mongoose = require( 'mongoose' )
var ModelExtend = require('./modelExtend.js');

const Schema = mongoose.Schema

var recommendArticleSchema = new Schema( {
  id : String,
  title : String,
  desc : String,
  url : String,
  cover : String,
  content : String,
  tags : Array,
  category : String
} )

var RecommendArticle = mongoose.model( 'RecommendArticle', recommendArticleSchema );

ModelExtend.doApply(RecommendArticle);

module.exports = RecommendArticle;
