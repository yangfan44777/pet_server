var Comment = require( '../models/comment' )
var Feed = require( '../models/feed' )
var express = require( 'express' )
var router = express.Router()


router.route( '/comment/delete/:comment_id' )
  .put( ( req, res ) => {
    Comment.findOne( { _id : req.params.comment_id }, ( err, comment ) => {

      if( err ){
        return res.send( err )
      }

      comment.isdeleted = 1

      comment.save( ( err ) => {
        if( err ){
          return res.send( err )
        }
        res.json( { message : 'Comment updated.' } )
      } )

    } )
  } )

router.route( '/comment/:feed_id' )
  .get( ( req, res ) => {
    Comment.find( { feed_id : req.params.feed_id } ).exec( ( err, comments ) => {
      if( err ) {
        return res.send( err )
      }
      res.json( comments )
    } )
  } )
  .post( ( req, res ) => {
    var reqBody = Object.assign( req.body, { feed_id : req.params.feed_id } )
    const comment = new Comment( Object.assign( req.body, { feed_id : req.params.feed_id } ) )
    comment.save( ( err, result ) => {
      if( err ) {
        return res.send( err )
      }
      // console.log('hehehehe', comment)
      /* 更新feed的comments */
      Feed.findById(req.params.feed_id).exec((err, feed) => {
        if (err) {
          return;
        } else {
          feed.comments.push(comment);
          feed.save();
        }
      });
      res.send( comment )
    } )
  } )

module.exports = router
