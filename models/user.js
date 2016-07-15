var mongoose = require( 'mongoose' )
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

module.exports = mongoose.model( 'User', userSchema )
