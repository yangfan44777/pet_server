var mongoose = require( 'mongoose' )
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

module.exports = mongoose.model( 'Article', articleSchema )
