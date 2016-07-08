var Feed = require( '../models/feed' )
var User = require( '../models/user' )
var Topic = require( '../models/topic' )
var Followed = require( '../models/followed' )
var Comment = require( '../models/comment' )
var Like = require( '../models/like' )
var express = require( 'express' )
var router = express.Router()
var _ = require( 'underscore' )


// http://192.168.1.102:8000/api/feeds/following/oWSLis-9ebxj3ff_Tgy8e7pSLsMo/0/0/1
router.route( '/feeds/following/:userid/:latest/:earliest/:type' )
  .get( ( req, res ) => {

    User.findOne( { openid : req.params.userid }, ( err, user ) => {

      if( err ) {
        return res.send( err )
      }

      var feeds = []
      if( user && user.news ){
        var c = 0

        // 如果是加载更早的 feeds，则 type 应该等于 2，否则 type 应该等于 1
        var pageSize = 5
        var latestIndex = user.news.indexOf( req.params.latest )
        var earliestIndex = user.news.indexOf( req.params.earliest )

        var i,len

        if( req.params.type == 2 ) {
          i = earliestIndex + 1
          len = ( 5 + i ) > user.news.length ? user.news.length : ( 5 + i )
        } else {
          i = 0
          len = latestIndex === -1 ? 5 : latestIndex
          len = len > user.news.length ? user.news.length : len
          len = len === 0 ? 1 : len
          len = ( req.params.latest == 0 && req.params.earliest == 0 && user.news.length === 1 ) ? 1 : len
        }

        var startIndex = i
        // console.log( 'xxxx', i, len, req.params.latest, req.params.earliest, latestIndex, earliestIndex, user.news )

        if( i < len ) {
          for( i; i < len; i++ ){
            Feed.findOne( { _id : user.news[ i ] }, ( err, feed ) => {
              if( feed ) {
                Comment.find( { feed_id : feed._id } )
                  .exec( ( err, comments ) => {

                    if( ! err ) {
                      feed.comments = comments
                      feed.comment_count = comments.length
                      feeds.push( feed )
                      if( c === ( len - startIndex ) * 2 - 1 ) {
                        res.json( _.sortBy( feeds, '_id' ).reverse() )
                      }
                      c++
                    }
                  } )

              Like.find( { feed_id : feed._id } )
                .sort( { _id : -1 } )
                .exec( ( err, likes ) => {

                  if( ! err ) {
                    feed.likes = likes
                    feed.like_count = likes.length
                    feeds.push( feed )

                    if( c === ( len - startIndex ) * 2 - 1 ) {
                      return res.json( _.sortBy( feeds, '_id' ).reverse() )
                    }
                    c++
                  }

                } )

              } else {
                return res.json( feeds )
              }

            } )
          }
        } else {
          return res.json( feeds )
        }
        // if( i === len && i === 0 ) {
        //   // console.log('here')
        //   return res.json( feeds )
        // }
        // user.news.forEach( ( feed_id ) => {

        // } )
      } else {
        return res.json( feeds )
      }

    } )

  } )

router.route( '/feeds' )
  // 提交一个 feed
  .post( ( req, res ) => {

    var feed = new Feed( req.body )

    feed.save( ( err ) => {
      if( err ) {
        return res.send( err )
      }
      var c = 0
      if( req.body.topic ) {
        Topic.findOne( { title : req.body.topic.replace( /#/g, '' ) }, ( err, topic ) => {
          if( err ) {
            return res.send( err )
          }
          if( topic ) {
            topic.feeds.unshift( feed._id )
            topic.save( ( err ) => {
              if( err ) {
                return res.send( err )
              }
              broadcast()
            } )
          } else {
            broadcast()
          }

        } )
      } else {
        broadcast()
      }

      function broadcast() {
        Followed.findOne( { userid : req.body.userid }, ( err, followed ) => {
          if( err ) {
            return res.send( err )
          }
          if( followed ) {
            followed.followed.forEach( ( follow, index ) => {

              User.findOne( { openid : follow } ).exec( ( err, user ) => {
                if( err ) {
                  return res.send( err )
                }
                if( ! user.news ) {
                  user.news = []
                }
                user.news.unshift( feed.get( 'id' ) )

                // console.log( user.news )

                user.save( ( err ) => {
                  if( err ){
                    return res.send( err )
                  }
                  if( c === followed.followed.length - 1 ) {
                    res.send( { message : 'Feed added.' } )
                  }
                  c++
                } )

              } )

            } )

          } else {
            res.send( { message : 'Feed added.' } )
          }

        } )
      }



      // console.log('ididid', feed.get( 'id' ) )
      // res.send( { message : 'Feed added.' } )
    } )
  } )


router.route( '/feeds/topic/:topic/:latest/:earliest/:type' )
  .get( ( req, res ) => {

    Topic.findOne( { title : req.params.topic.replace( /#/g, '' ) }, ( err, topic ) => {

      if( err ) {
        return res.send( err )
      }

      var feeds = []
      if( topic && topic.feeds ){
        var c = 0

        // 如果是加载更早的 feeds，则 type 应该等于 2，否则 type 应该等于 1
        var pageSize = 5
        var latestIndex = topic.feeds.indexOf( req.params.latest ) // 0
        var earliestIndex = topic.feeds.indexOf( req.params.earliest ) // 8

        var i,len

        if( req.params.type == 2 ) {
          i = earliestIndex + 1 // 9
          len = ( 5 + i ) > topic.feeds.length ? topic.feeds.length : ( 5 + i ) // 9
        } else {
          i = 0
          len = latestIndex === -1 ? 5 : latestIndex // 5
          len = len > topic.feeds.length ? topic.feeds.length : len // 5
          len = len === 0 ? 1 : len // 5
          len = ( req.params.latest == 0 && req.params.earliest == 0 && topic.feeds.length === 1 ) ? 1 : len
        }
        var startIndex = i

        if( i < len ) {
          for( i; i < len; i++ ){
            Feed.findOne( { _id : topic.feeds[ i ] }, ( err, feed ) => {
              if( feed ) {
                Comment.find( { feed_id : feed._id } )
                  .exec( ( err, comments ) => {

                    if( ! err ) {
                      feed.comments = comments
                      feed.comment_count = comments.length
                      feeds.push( feed )
                      if( c === ( len - startIndex ) * 2 - 1 ) {
                        return res.json( _.sortBy( feeds, '_id' ).reverse() )
                      }
                      c++
                    }
                  } )

                Like.find( { feed_id : feed._id } )
                  .sort( { _id : -1 } )
                  .exec( ( err, likes ) => {

                    if( ! err ) {
                      feed.likes = likes
                      feed.like_count = likes.length
                      feeds.push( feed )
                      if( c === ( len - startIndex ) * 2 - 1  ) {
                        return res.json( _.sortBy( feeds, '_id' ).reverse() )
                      }
                      c++
                    }

                  } )

              } else {
                return res.json( feeds )
              }

            } )
          }
        } else {
          return res.json( feeds )
        }
        // if( i === len ) {
        //   // console.log('here')
        //   return res.json( feeds )
        // }
        // user.news.forEach( ( feed_id ) => {

        // } )
      } else {
        return res.json( feeds )
      }

    } )

  } )


// router.route( '/feeds/:userid' )
//   .get( ( req, res ) => {
//     Feed.find( { userid : req.params.userid } ).sort( { _id : -1 } ).exec( ( err, feeds ) => {
//       if( err ) {
//         return res.send( err )
//       }
//       res.json( feeds )
//     } )
//   } )

router.route( '/feeds/:id' )
  // 修改一个 feed
  .put( ( req, res ) => {
    Feed.findOne( { _id : req.params.id }, ( err, feed ) => {
      if( err ){
        return res.send( err )
      }
      for( prop in req.body ){
        feed[ props ] = req.body[ props ]
      }
      feed.save( ( err ) => {
        if( err ){
          return res.send( err )
        }
        res.json( { message : 'Feed updated.' } )
      } )

    } )
  } )
  // 获取一个 feed
  .get( ( req, res ) => {
    Feed.findOne( { _id : req.params.id }, ( err, feed ) => {
      if( err ){
        return res.send( err )
      }
      res.json( feed )
    } )
  } )
  // 删除一个 feed
  .delete( ( req, res ) => {
    Feed.remove( {
      _id : req.params.id
    }, ( err, feed ) => {
      if( err ){
        return res.send( err )
      }
      res.json( { message : 'Deleted.' } )
    } )
  } )

  module.exports = router
