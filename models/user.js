var mongoose = require( 'mongoose' )
var ModelExtend = require('./modelExtend.js');

const Schema = mongoose.Schema

const userSchema = new Schema( {
  unionid : String,
  openid : String,
  nickname : String,
  city : String,
  province : String,
  headimgurl : String,

  follower : Number,
  follow : Number,
  news : Array,
  device_token : String
} )
var User = mongoose.model( 'User', userSchema );

ModelExtend.doApply(User);
module.exports = User;
