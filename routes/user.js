'use strict';

var User = require( '../models/user' )
var request = require( 'request' )
var express = require( 'express' )
var Follows = require( '../models/follows' )
var Followed = require( '../models/followed' )
var router = express.Router()


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
      extraInfo = extraInfo.extraInfo || {}

      var result = Object.assign( JSON.parse( body ), { extraInfo : extraInfo } )

      // 使用自定义昵称
      result.nickname = extraInfo.nickname || result.nickname

      // 使用自定义性别
      result.sex = extraInfo.sex || result.sex

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
            user.follow = follows.follows.length
          }
          if( c == 1 ) {
            res.json( user )
          }
          c++
        })

        Followed.findOne( { userid : req.params.userid } ).exec( ( err, followed ) => {
          if( followed ) {
            user.follower = followed.followed.length
          }
          if( c == 1 ){
            res.json( user )
          }
          c++
        })


      } )
    } )

  router.route( '/user/register' )
    .post( ( req, res ) => {
      var c = 0
      User.findOne( { openid : req.body.openid }, ( err, user ) => {
        if( err ){
          return res.send( err )
        }
        if( user ) {
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
              return res.send( err )
            }
            // console.log( 'hehehehe' )
            return res.send( { message : 'User info synced.', not_new : 1 } )
          } )
          // res.send( { message : 'User exist.' } )
        } else {
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
              return res.json( { message : 'Followed added.' } )
            }
            c++
          } )
          user.save( ( err ) => {
            if( err ) {
              return res.send( err )
            }
            if( c === 1 ){
              return res.send( { message : 'User registered.' } )
            }
            c++
          } )
        }
      } )

    } )

  module.exports = router
