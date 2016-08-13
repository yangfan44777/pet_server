<<<<<<< HEAD
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var bannerSchema = new Schema({
  // 1 => 网页
  // 2 => 达人
  // 3 => 话题
  type: Number,

  // banner 图 url 地址
  image: String,

  // 1 可用，2 不可用
  available: Number,

  // type === 1 时有效
  url_url: String,
  url_title: String,

  // type === 3 时有效
  topic_title: String,
  topic_image: String,
  topic_desc: String,
  topic_thumbnail: String

});

var Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
=======
var mongoose = require( 'mongoose' )
const Schema = mongoose.Schema

var bannerSchema = new Schema( {
  // 1 => 网页
  // 2 => 达人
  // 3 => 话题
  type : Number,

  // banner 图 url 地址
  image : String,

  // 1 可用，2 不可用
  available : Number,

  // type === 1 时有效
  url_url : String,
  url_title : String,

  // type === 3 时有效
  topic_title : String,
  topic_image : String,
  topic_desc  : String,
  topic_thumbnail : String

} )

var Banner = mongoose.model( 'Banner', bannerSchema );

module.exports = Banner;
>>>>>>> f540bcac70c8b859b404bc87e2b523561f9ab57b
