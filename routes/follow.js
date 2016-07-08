var User = require( '../models/user' )
var Follows = require( '../models/follows' )
var Followed = require( '../models/followed' )
var Feed = require( '../models/feed' )
var express = require( 'express' )
var router = express.Router()

// router.route( '/follow' )
//   .post( ( req, res ) => {
//     const follows = new Follows( req.body )
//
//     follows.save( ( err ) => {
//       if( err ) {
//         return res.send( err )
//       }
//       res.send( { message : 'Follows added.' } )
//     } )
  // } )

router.route( '/follow/:follower_id/:followee_id' )
  .post( ( req, res ) => {

    var c = 0

    Followed.findOne( { userid : req.params.follower_id }, ( err, followed ) => {
      if( err ) {
        return res.send( err )
      }

      if( !followed ) {
        const followed = new Followed( {
          userid : req.params.follower_id,
          followed : [ req.params.followee_id ]
        } )

        followed.save( ( err ) => {
          if( err ) {
            return res.send( err )
          }
          if( c === 3 ) {
            res.json( { message : 'Followed added.' } )
          }
          c++
        } )

      } else {
        followed.followed.indexOf( req.params.followee_id ) === -1 &&followed.followed.push( req.params.followee_id )
        followed.save( ( err ) => {
          if( err ){
            return res.send( err )
          }
          if( c === 3 ) {
            res.json( { message : 'Followed followed updated.' } )
          }
          c++
        } )
      }
    } )

    Follows.findOne( { userid : req.params.followee_id }, ( err, follows ) => {
      if( err ){
        return res.send( err )
      }

      if( ! follows ){
        const follows = new Follows( req.body )

        follows.save( ( err ) => {
          if( err ) {
            return res.send( err )
          }
          if( c === 3 ) {
            res.json( { message : 'Follows added.' } )
          }
          c++
        } )
      } else {

        follows.follows.indexOf( req.params.follower_id ) === -1 &&follows.follows.push( req.params.follower_id )
        follows.save( ( err ) => {
          if( err ){
            return res.send( err )
          }
          if( c === 3 ) {
            res.json( { message : 'Follows follow updated.' } )
          }
          c++
        } )
      }

    } )

    User.findOne( { openid : req.params.follower_id }, ( err, user ) => {
      // console.log( 'followfollowfollowfollow', user.follow )
      if( err ){
        return res.send( err )
      }

      user.follower = user.follower + 1
      // for( prop in req.body ){
      //   feed[ props ] = req.body[ props ]
      // }

      //
      user.save( ( err ) => {
        if( err ){
          return res.send( err )
        }
        if( c === 3 ) {
          res.json( { message : 'User follow updated.' } )
        }
        c++
      } )

    } )
    //
    // User.findOne( { openid : req.params.follower_id }, ( err, user ) => {
    //   // console.log( 'followfollowfollowfollow', user.follow )
    //   if( err ){
    //     return res.send( err )
    //   }
    //
    //   user.follower = user.follower + 1
    //   // for( prop in req.body ){
    //   //   feed[ props ] = req.body[ props ]
    //   // }
    //   user.save( ( err ) => {
    //     if( err ){
    //       return res.send( err )
    //     }
    //     if( c === 3 ) {
    //       res.json( { message : 'User follow updated.' } )
    //     }
    //     c++
    //   } )
    //
    // } )

    User.findOne( { openid : req.params.followee_id }, ( err, user ) => {
      if( err ){
        return res.send( err )
      }

      user.follow = user.follow + 1
      // for( prop in req.body ){
      //   feed[ props ] = req.body[ props ]
      // }



      Feed.find( { userid : req.params.follower_id } ).limit( 5 ).sort( { _id : -1 } ).exec( ( err, feeds ) => {
        // console.log( feed )
        if( feeds ) {
          feeds.forEach( ( feed ) => {
            user.news.push( feed.get( 'id' ) )
          } )
        }

        user.save( ( err ) => {
          if( err ){
            return res.send( err )
          }
          if( c === 3 ) {
            res.json( { message : 'User follow updated.' } )
          }
          c++
        } )

      } )

      // user.save( ( err ) => {
      //   if( err ){
      //     return res.send( err )
      //   }
      //   if( c === 3 ){
      //     res.json( { message : 'User follow updated.' } )
      //   }
      //   c++
      // } )

    } )

  } )

module.exports = router
