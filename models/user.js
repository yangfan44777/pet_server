var mongoose = require( 'mongoose' )
var ModelExtend = require('./modelExtend.js');
var Promise = require('bluebird');

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
  device_token : String,
  extraInfo: {
    nickname: String,
    location: String,
    signature: String,
    sex: Number,//0女 1男 -1未知
    pic: String

  }/* [昵称, 位置, 签名, 性别, 头像] */
} )
var User = mongoose.model( 'User', userSchema );

ModelExtend.doApply(User);

User.prototype.validNickname = function (nickname) {
  var self = this;
  return new Promise( async (resolve, reject) => {
    var user = await User.findOne({'extraInfo.nickname':nickname}).exec();
    if (!user || self.extraInfo.nickname === nickname) {
      resolve(true);
    } else {
      reject('昵称已被使用');
    }
  });  
}

module.exports = User;
