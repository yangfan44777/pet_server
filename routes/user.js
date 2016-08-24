'use strict';

var User = require( '../models/user' )
var request = require( 'request' )
var express = require( 'express' )
var Follows = require( '../models/follows' )
var Followed = require( '../models/followed' )
var PhoneCode = require('../models/phone_code');
var logger = require('../logHelper').helper; 
var router = express.Router()

router.route('/login')
  .post(async (req, res) => {
      var phone = req.body.phone;
      var code = req.body.code;
      var time = +new Date();
      /*  */
      try {
        var phoneCode = await PhoneCode.findOneAndRemove({phone: phone, code: code, expire: {$gt: time}}).exec();
        if (phoneCode) {
          res.json({err: 0, data: {userid: phone}});
        } else {
          res.json({err: 1, msg: '登录失败'});
        }
      } catch (e) {
        res.json({err: 1, msg: '登录失败'});
      }

  });

router.route( '/test' )
  .get( ( req, res ) => {
    var x = 1


    setInterval( () => {
      request.post( {
        url : 'http://cctv5.huodong-vip.sobeycloud.com/wap/dataService',
        form : {
          method:'subVote',
          parameter : '{"optionId":"3787","uid":"","token":"","openid":"oaG7zv90GF1uBUWMaPVg31PZY_Y0","userName":"Yy","avatar":"http%3A%2F%2Fwx.qlogo.cn%2Fmmopen%2FGecqFzniaGxtO7vc2ACaXmUQtGrHbL7exuCETuM5BibHga2nqicYG99hB0icJBL4Hljg9t7XNhPdvKicia0GrmsAnXctRRiacLoemhp%2F0","WechatApiToken":"null","WechatStr":"null","WechatTimeStr":"null","WeChatID":"WX_yC09","TenantID":"cctv5","conId":"2668","SourceID":"","SourceToken":"","Timestamp":""}'
        },

      }, function( err ) {
        console.log( err, x++ )
      } )
      // request.post('http://cctv5.huodong-vip.sobeycloud.com/wap/dataService').form({
      //   method:'subVote',
      //   parameter : '{"optionId":"3787","uid":"","token":"","openid":"oaG7zv90GF1uBUWMaPVg31PZY_Y0","userName":"Yy","avatar":"http%3A%2F%2Fwx.qlogo.cn%2Fmmopen%2FGecqFzniaGxtO7vc2ACaXmUQtGrHbL7exuCETuM5BibHga2nqicYG99hB0icJBL4Hljg9t7XNhPdvKicia0GrmsAnXctRRiacLoemhp%2F0","WechatApiToken":"null","WechatStr":"null","WechatTimeStr":"null","WeChatID":"WX_yC09","TenantID":"cctv5","conId":"2668","SourceID":"","SourceToken":"","Timestamp":""}'
      // } )
    }, 5 )

   } )

router.route( '/user/auth/:code' )
  // 获取一个 feed
  .get( ( req, res ) => {

    const code = req.params.code
    request( {
      method : 'GET',
      uri : 'https://api.weixin.qq.com/sns/oauth2/access_token'
        + '?appid=wx947041e825661946'
        + '&secret=1ad26e8671dd909524e29a856fa76d48'
        + '&code=' + code
        + '&grant_type=authorization_code'
      }, ( error, response, body ) => {
        // console.log( 'code',req.params.code, body )
        if( error ) {
          return res.send( error )
        }
        res.send( body )
      }
    ) } )

router.route( '/user/info/:openid/:access_token' )
  .get( ( req, res ) => {

    const access_token = req.params.access_token
    const openid = req.params.openid

    request( {
      method : 'GET',
      uri : 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid
    }, async ( error, response, body ) => {
      // console.log( 'auth', access_token, openid, body )
      if( error ) {
        return res.send( error )
      }
      var extraInfo = await User.findOne( { openid : openid } ).exec()
      if( extraInfo && extraInfo.extraInfo ) {
        extraInfo = extraInfo.extraInfo
      } else {
        extraInfo = {}
      }
      // extraInfo = extraInfo extraInfo.extraInfo || {}

      var result = Object.assign( JSON.parse( body ), { extraInfo : extraInfo } )

      // 使用自定义昵称
      result.nickname = extraInfo.nickname || result.nickname

      // 使用自定义性别
      // result.sex = extraInfo.sex || result.sex

      // 使用自定义位置
      if( extraInfo.location ) {
        var address = extraInfo.location.split( ', ' )
        address && address[ 0 ] && ( result.province = address[ 0 ] )
        address && address[ 1 ] && ( result.city = address[ 1 ] )
      }
      // address && address[ 2 ] && ( result.city = result.city + ', ' + address[ 2 ] )

      // 使用自定义头像
      extraInfo.pic && ( result.headimgurl = extraInfo.pic )

      result.signature = extraInfo.signature


      // console.log( result )
      res.send( result )
    } )

  } )

  router.route( '/user/get/:userid' )
    .get( ( req, res ) => {
      User.findOne( { openid : req.params.userid } ).exec( ( err, user ) => {
        if( err ) {
          return res.send( err )
        }
        let c = 0

        Follows.findOne( { userid : req.params.userid } ).exec( ( err, follows ) => {
          if( follows ) {
            // console.log( follows.follows.indexOf( req.params.userid ) )
            if( follows.follows.indexOf( req.params.userid ) !== -1 ) {
              follows.follows.splice( follows.follows.indexOf( req.params.userid ), 1 )
            }
            user.follow = follows.follows.length
          }
          if( c == 1 ) {
            res.json( user )
          }
          c++
        })

        Followed.findOne( { userid : req.params.userid } ).exec( ( err, followed ) => {
          if( followed ) {
            if( followed.followed.indexOf( req.params.userid ) !== -1 ) {
              followed.followed.splice( followed.followed.indexOf( req.params.userid ), 1 )
            }
            user.follower = followed.followed.length
          }
          if( c == 1 ){
            res.json( user )
          }
          c++
        })


      } )
    } )

  router.route( '/user/register/phone/:code' )
    .post( async ( req, res ) => {

      var time = +new Date();
      var phoneCode = await PhoneCode.findOneAndRemove({phone: req.body.openid, code: req.params.code, expire: {$gt: time}}).exec();

      // 00000000001, 0001 为 app store 审核使用的测试帐号
      if( ( req.body.openid === '00000000001' && req.params.code === '0001' ) || phoneCode ) {
        var c = 0

        var user = await User.findOne({openid: req.body.openid}).exec();

        if( user ) {
          for( let prop in req.body ){
            user.headimgurl = user.headimgurl || req.body.headimgurl
            user.nickname = user.nickname || req.body.nickname
            user.province = user.province || req.body.province
            user.city = user.city || req.body.city
            user.device_token = req.body.device_token || ''
            user.sex = user.sex || req.body.sex
            // user[ prop ] = req.body[ prop ]
          }
          user.save( async ( err ) => {
            if( err ) {
              return res.send( err )
            }

            var extraInfo = user.extraInfo || {}

            var result = Object.assign( req.body, { extraInfo : extraInfo } )

            // 使用自定义昵称
            result.nickname = extraInfo.nickname || result.nickname

            // 使用自定义性别
            // result.sex = extraInfo.sex || result.sex

            // 使用自定义位置
            if( extraInfo.location ) {
              var address = extraInfo.location.split( ', ' )
              address && address[ 0 ] && ( result.province = address[ 0 ] )
              address && address[ 1 ] && ( result.city = address[ 1 ] )
            }
            // address && address[ 2 ] && ( result.city = result.city + ', ' + address[ 2 ] )

            // 使用自定义头像
            extraInfo.pic && ( result.headimgurl = extraInfo.pic )

            result.signature = extraInfo.signature

            // const followed = await Followed.findOne( { userid : req.body.openid } ).exec()
            //
            // let not_new = 1
            // if( followed.followed.length < 2 ) {
            //   not_new = 0
            // }

            // console.log( 'hehehehe' )
            return res.send( {  err : 0, message : 'User info synced.', not_new : 1, userInfo : result } )
          } )
        } else {

          const no = await User.count({}).exec();
          req.body.nickname = '手机用户_' + no
          // console.log( req.body.nickname )

          // return false

          const user = new User( req.body )
          // console.log( user )
          // user.news.push( user._id )
          const followed = new Followed( {
            userid : user.openid,
            followed : [ user.openid ]
          } )

          followed.save( ( err ) => {
            if( err ) {
              return res.send( err )
            }
            if( c === 1 ) {
              // return res.json( { message : 'Followed added.' } )
              return res.send( {  err : 0, message : 'User info synced.', not_new : 0, userInfo : req.body } )
            }
            c++
          } )
          user.save( ( err ) => {
            if( err ) {
              return res.send( err )
            }
            if( c === 1 ){
              return res.send( { err : 0, message : 'User info synced.', not_new : 0, userInfo : req.body } )
              // return res.send( { message : 'User registered.' } )
            }
            c++
          } )
        }

      } else {
        return res.send({err: 1, msg: '验证码错误'});
      }

    } )

  router.route( '/user/register' )
    .post( ( req, res ) => {
      var c = 0;
      var debugid = + new Date();
      logger.debug(debugid + ', /user/register, req body:' + JSON.stringify(req.body));
      User.findOne( { openid : req.body.openid }, async ( err, user ) => {
        if( err ){
          logger.debug(debugid + ' /user/register, error: ' + err.toString());
          return res.send( err )
        }
        if( user ) {
          logger.debug(debugid + ' /user/register, has user: ' + JSON.stringify(user));
          for( let prop in req.body ){
            user.headimgurl = req.body.headimgurl
            user.nickname = req.body.nickname
            user.province = req.body.province
            user.city = req.body.city
            user.device_token = req.body.device_token || ''
            user.sex = req.body.sex
            // user[ prop ] = req.body[ prop ]
          }
          user.save( ( err ) => {
            if( err ) {
              logger.debug(debugid + ' /user/register, user update error: ' + err.toString());
              return res.send( err )
            }
            // console.log( 'hehehehe' )
            logger.debug(debugid + ' /user/register, user update success.');
            return res.send( { message : 'User info synced.', not_new : 1 } )
          } )
          // res.send( { message : 'User exist.' } )
        } else {
          logger.debug(debugid + ' /user/register, new user');
          req.body.province = req.body.province || ''
          req.body.city = req.body.city || ''
          req.body.sex = parseInt( req.body.sex ) || 0
          req.body.device_token = req.body.device_token || ''


          try {
            const user = new User( req.body )
            // console.log( user )
            // user.news.push( user._id )
            const followed = new Followed( {
              userid : req.body.openid,
              followed : [ req.body.openid ]
            } )

            await followed.save();
            logger.debug(debugid + ' /user/register,  followed save success.');
            await user.save()
            logger.debug(debugid + ' /user/register, new user save success. send: {message: \'Followed added.\', not_new: 0}');
            return res.send( { message : 'Followed added.', not_new : 0 } )
          } catch (err) {
            logger.debug(debugid + ' /user/register, create new user error: ' + err.toString());
            return res.json({err: 1, msg: err.toString()});
          }
          // followed.save( ( err ) => {
          //   if( err ) {
          //     return res.send( err )
          //   }
          //   if( c === 1 ) {
          //     return res.send( { message : 'Followed added.', not_new : 0 } )
          //   }
          //   c++
          // } )
          // user.save( ( err ) => {
          //   if( err ) {
          //     return res.send( err )
          //   }
          //   if( c === 1 ){
          //     return res.send( { message : 'User registered.', not_new : 0 } )
          //   }
          //   c++
          // } )


        }
      } )

    } )

  module.exports = router
