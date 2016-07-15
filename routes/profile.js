var Feed = require( '../models/feed' )
var Comment = require( '../models/comment' )
var Like = require( '../models/like' )
var Follows = require( '../models/follows' )
var Followed = require( '../models/followed' )
var User = require( '../models/user' )
var express = require( 'express' )
var _ = require( 'underscore' )
var router = express.Router()


router.route( '/profile/feeds/:userid' )
  .get( ( req, res ) => {
    Feed.find( { userid : req.params.userid } ).exec( ( err, feeds ) => {
      if( err ) {
        return res.send( err )
      }
      var _counter = 0
      if( feeds && feeds.length === 0 ) {
        return res.json( [] )
      } else {
        feeds.forEach( ( feed, i ) => {
          // 对每个 feed 获取其 comments 和 comment_count
          Comment.find( { feed_id : `${feed._id}` } )
            // .sort( { _id : -1 } )
            .exec( ( err, comments ) => {
              if( ! err ) {
                feeds[ i ].comments = comments
                feeds[ i ].comment_count = comments.length
              }
            } ).then( () => {
              if( ( ++_counter ) === feeds.length * 2 ) {
                res.json( feeds )
              }
            } )

          Like.find( { feed_id : `${feed._id}` } )
            .sort( { _id : -1 } )
            .exec( ( err, likes ) => {
              if( ! err ) {
                feeds[ i ].likes = likes
                feeds[ i ].like_count = likes.length
              }
            } ).then( () => {
              if( ( ++_counter ) === feeds.length * 2 ) {
                res.json( feeds )
              }
            } )

        } )
      }
    } )
  } )


router.route( '/profile/follows/:userid' )
  .get( ( req, res ) => {
    Follows.findOne( { userid : req.params.userid } ).exec( ( err, follows ) => {
      // console.log( 'followsfollowsfollows', follows )
      if( err ) {
        return res.send( err )
      }
      res.json( follows || { userid : req.params.userid, follows : [] } )
    } )
  } )

router.route( '/profile/follows/detail/:userid' )
  .get( ( req, res ) => {
    Follows.findOne( { userid : req.params.userid } ).exec( ( err, follows ) => {
      if( err ) {
        return res.send( err )
      }
      const result = []
      let c = 0
      if( follows ) {
        follows.follows.forEach( ( follow, index ) => {
          // console.log( 'find', follow )
          User.findOne( { openid : follow } ).exec( ( err, user ) => {
            if( err ) {
              return res.send( err )
            }

            const feedsResult = []
            Feed.find( { userid : user.openid } ).limit(3).sort( { _id : -1 } ).exec( ( err, feeds ) => {
              feeds.forEach( ( feed ) => {
                feedsResult.push( {
                  image : feed.image
                } )
              } )

              result.push( {
                userid : user.openid,
                nickname : user.nickname,
                headimgurl : user.headimgurl,
                feeds : feedsResult
              } )
              // console.log( result )
              //res.json( user )
              if( c === follows.follows.length - 1 ) {
                res.json( result )
              }
              c++

            } )


          } )
        } )
      } else {
        res.json( result )
      }


    } )
  } )





router.route( '/profile/fans/detail/:userid' )
  .get( ( req, res ) => {
    Followed.findOne( { userid : req.params.userid } ).exec( ( err, followed ) => {
      if( err ) {
        return res.send( err )
      }
      const result = []
      let c = 0
      if( followed ) {
        followed.followed.forEach( ( follow, index ) => {

          // console.log( 'find', follow )
          User.findOne( { openid : follow } ).exec( ( err, user ) => {
            if( err ) {
              return res.send( err )
            }

            const feedsResult = []
            Feed.find( { userid : user.openid } ).limit(3).sort( { _id : -1 } ).exec( ( err, feeds ) => {
              // console.log( feeds )
              feeds.forEach( ( feed ) => {
                feedsResult.push( {
                  image : feed.image
                } )
              } )

              result.push( {
                userid : user.openid,
                nickname : user.nickname,
                headimgurl : user.headimgurl,
                feeds : feedsResult
              } )
              // console.log( result )
              //res.json( user )
              if( c === followed.followed.length - 1 ) {
                res.json( result )
              }
              c++

            } )
          } )
        } )
      } else {
        res.json( result )
      }
    } )
  } )






router.route( '/profile/recommend/detail' )
  .get( ( req, res ) => {

    User.find().sort( { _id : -1 } ).limit( 50 ).exec( ( err, users ) => {
      if( err ) {
        return res.send( err )
      }
      const result = []
      let c = 0
      if( users ) {


        users.forEach( ( user, index ) => {

          const userid = user.openid

          User.findOne( { openid : userid } ).exec( ( err, user ) => {
            if( err ) {
              return res.send( err )
            }

            const feedsResult = []
            Feed.find( { userid : user.openid } ).limit(3).sort( { _id : -1 } ).exec( ( err, feeds ) => {
              // console.log( feeds )
              feeds.forEach( ( feed ) => {
                feedsResult.push( {
                  image : feed.image
                } )
              } )

              result.push( {
                userid : user.openid,
                nickname : user.nickname,
                headimgurl : user.headimgurl,
                feeds : feedsResult,
                fan_c : user.follower
              } )
              // console.log( result )
              //res.json( user )
              if( c === users.length - 1 ) {
                var s_result = _.sortBy( result, ( r ) => {
                  return -r.fan_c
                } )

                res.json( s_result )
              }
              c++

            } )
          } )
        } )
      } else {
        res.json( result )
      }
    } )

  } )


  module.exports = router
