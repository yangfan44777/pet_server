var Feed = require( '../models/feed' )
var Comment = require( '../models/comment' )
var Like = require( '../models/like' )
var express = require( 'express' )
var router = express.Router()

router.route( '/feed/:feed_id' )
  .get( ( req, res ) => {
    Feed.findOne( { _id : req.params.feed_id } ).exec( ( err, feed ) => {
      if( err ) {
        return res.send( err )
      }
      if( feed.isdeleted === 1 ) {
        return res.json( { isdeleted : 1 } )
      }
      var _counter = 0
      Comment.find( { feed_id : `${feed._id}` } )
        // .sort( { _id : -1 } )
        .exec( ( err, comments ) => {
          if( ! err ) {
            feed.comments = comments
            feed.comment_count = comments.length
          }
        } ).then( () => {
          if( ( ++_counter ) === 2 ) {
            res.json( feed )
          }
        } )

      Like.find( { feed_id : `${feed._id}` } )
        .sort( { _id : -1 } )
        .exec( ( err, likes ) => {
          if( ! err ) {
            feed.likes = likes
            feed.like_count = likes.length
          }
        } ).then( () => {
          if( ( ++_counter ) === 2 ) {
            res.json( feed )
          }
        } )

      // res.json( feeds )
    } )
  } )

  module.exports = router
