var mongoose = require( 'mongoose' )
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

module.exports = mongoose.model( 'RecommendArticle', recommendArticleSchema )
