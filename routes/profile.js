"use strict";

var Feed = require( '../models/feed' )
var Comment = require( '../models/comment' )
var Like = require( '../models/like' )
var Follows = require( '../models/follows' )
var Followed = require( '../models/followed' )
var User = require( '../models/user' )
var express = require( 'express' );
var _ = require( 'underscore' );
var Promise = require('bluebird');
var router = express.Router()


/*  */
var findCommentsByFeedIdAsync = function (feedId) {
  return Comment.find({feed_id: feedId}).exec();
}

var findLikesByFeedIdAsync = function (feedId) {
  return Like.find({feed_id: feedId}).exec();
}

var findFeeds = async function (userid, offset, limit) {

    var feeds = await Feed.pageQuery(offset, limit, {userid: userid});
    var length = feeds.length;

    feeds = feeds.map((feed) => {
        return new Promise(async (resolve, reject) => {
            try {
                var info = await Promise.all([findCommentsByFeedIdAsync(feed.id), findLikesByFeedIdAsync(feed.id)]);

                var comments = info[0];
                var likes = info[1];

                Object.assign(feed, {
                    comments: comments,
                    comments_count: comments.length,
                    likes: likes,
                    likes_count: likes.length
                });
                resolve(feed);
            } catch (e) {
                reject(e);
            }
        });
    });

    return Promise.all(feeds);
}

/* 获取userid下的所有feeds，附加comments和likes */
router.route( '/profile/feeds/:userid' )
  .get(async (req, res) => {
    try {
        var offset = parseInt(req.query.offset || 1);
        var limit = parseInt(req.query.limit || 4);
        return res.json(await findFeeds(req.params.userid, offset, limit));
    } catch (err) {
        return res.send(err);
    }
})
  
/* 获取userid下的所有follows */
router.route( '/profile/follows/:userid' )
  .get( ( req, res ) => {
    Follows.findOne( { userid : req.params.userid } ).exec( ( err, follows ) => {
      // console.log( 'followsfollowsfollows', follows )
      if( err ) {
        return res.send( err )
      }
      res.json( follows || { userid : req.params.userid, follows : [] } )
    })
})


/* 根据userid获取follows的详细信息 */
router.route( '/profile/follows/detail/:userid' )
  .get(async ( req, res ) => {

    /* 被查找的userid */
    var userid = req.params.userid;

    /* offset为第几页 */
    var offset = parseInt(req.query.offset) || 1;

    /* limit为每页个数上限 */
    var limit = parseInt(req.query.limit) || 4;

    /* 包装后的结果放在里这 */
    var result = [];

    try {
        var follows = await Follows.findOne({userid: userid}).exec();
        /* 获取当前页的follows */
        var _follows = follows && follows.follows.slice((offset - 1) * limit, offset * limit);
      
        if (_follows && _follows.length) {

            _follows = _follows.map((follow) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        var user = await User.findOne({openid : follow}).exec();
                        var feeds = await Feed.pageQuery(1, 3,  {userid: user.openid}, null, {sort:{_id: -1}});
                        var feedsResult = [];
                    
                        feeds.forEach((feed) => {
                            feedsResult.push({
                                image: feed.image
                            }); 
                        });
                        resolve({
                            userid: user.openid,
                            nickname: user.nickname,
                            headimgurl: user.headimgurl,
                            feeds: feedsResult
                        });
                    } catch (e) {
                        reject(e);
                    }
                });
            });
            return res.json(await Promise.all(_follows));
        } else {
            return res.end();
        }
    } catch (e) {
        return res.send(err);
    }
});

router.route( '/profile/fans/detail/:userid' )
  .get(async (req, res) => {

    /* 被查找的userid */
    var userid = req.params.userid;

    /* offset为第几页 */
    var offset = parseInt(req.query.offset) || 1;

    /* limit为每页个数上限 */
    var limit = parseInt(req.query.limit) || 4;

    try {

        /* userid下所有followed */
        var followed = await Followed.findOne({userid: userid}).exec();

        /* 获取当前页的followed */
        var _followed = followed && followed.followed.slice((offset - 1) * limit, offset * limit);

        if (_followed && _followed.length) {
            _followed = _followed.map((follow) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        var user = await User.findOne({openid : follow}).exec();
                        var feeds = await Feed.pageQuery(1, 3, {userid: user.openid}, null, {sort:{_id: -1}});
                        var feedsResult = [];
                        
                        feeds.forEach((feed) => {
                            feedsResult.push({
                                image: feed.image
                            }); 
                        });
                        resolve({
                            userid: user.openid,
                            nickname: user.nickname,
                            headimgurl: user.headimgurl,
                            feeds: feedsResult
                        });
                    } catch (err) {
                        reject(err);
                    }
                });
            });
            return res.json(await Promise.all(_followed));
        } else {
            return res.end();
        }
    } catch (err) {
        return res.send(err);
    }
});



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
