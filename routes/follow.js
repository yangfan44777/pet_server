var User = require( '../models/user' )
var Follows = require( '../models/follows' )
var Followed = require( '../models/followed' )
var Feed = require( '../models/feed' )
var express = require( 'express' )
var Promise = require('bluebird');
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

router.route( '/unfollow/:follower_id/:followee_id' )
  .post(async (req, res) => {
    try { 
        var followerId = req.params.follower_id;
        var followeeId = req.params.followee_id;

        var task = [];
        /* follower的关注列表里 去掉 followee */
        task.push(new Promise(async (resolve, reject) => {
            try {
                
                var follows = await Follows.findOne({userid: followerId}).exec();
                
                var followsList = follows.follows;
                
                var idx = followsList.indexOf(followeeId);
                
                if (idx > -1) {
                    followsList.splice(idx, 1);
                    follows.set({follows: followsList});
                    await follows.save();
                }
                
                resolve();
            } catch (err) {
                
                reject(err);
            }
        }));

        /* followee 的粉丝列表里去掉 follower */
        task.push(new Promise(async (resolve, reject) => {
            try {
                var followed = await Followed.findOne({userid: followeeId}).exec();
                var followedList = followed.followed;
                var idx = followedList.indexOf(followerId);
                if (idx > -1) {
                    followedList.splice(idx, 1);
                    followed.set({followed: followedList});
                    await followed.save();
                }
                resolve();
            } catch (err) {
                reject();
            }
        }));

        /* follower 的news列表里去掉所有属于followee的feed_id */
        task.push(new Promise(async (resolve, reject) => {
            try {
                var user = await User.findOne({openid: followerId}).exec();
                var news = user.news;
                var feeds = await Feed.find({userid: followeeId}, {_id: 1}).exec();
                feeds.forEach((feed) => {
                    var idx = news.indexOf(feed._id);
                    if (idx > -1) {
                        news.splice(idx, 1);
                    }
                });
                user.set({news: news});
                await user.save();
                resolve();
            } catch (err) {
                reject(err);
            }
        }));

        await Promise.all(task);
        res.send("success");
    } catch (err) {
        res.send(err.toString());
    }
});

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
