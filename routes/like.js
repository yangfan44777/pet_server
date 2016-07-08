var Like = require( '../models/like' )
var express = require( 'express' )
var router = express.Router()

router.route( '/like/:feed_id' )
  .get( ( req, res ) => {
    Like.find( { feed_id : req.params.feed_id } ).sort( { _id : -1 } ).exec( ( err, likes ) => {
      if( err ) {
        return res.send( err )
      }
      res.json( likes )
    } )
  } )
  .post( ( req, res ) => {
    var reqBody = Object.assign( req.body, { feed_id : req.params.feed_id } )
    const like = new Like( Object.assign( req.body, { feed_id : req.params.feed_id } ) )
    like.save( ( err, result ) => {
      if( err ) {
        return res.send( err )
      }
      // console.log('111111111111111', like)
      res.send( like )
    } )
  } )

module.exports = router
