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

var DurationLog = require("../util.js").DurationLog; 




var startTime = function () {
    this.st = +(new Date());
};
/*  */
var findCommentsByFeedIdAsync = function (feedId) {
  return Comment.find({feed_id: feedId}).exec();
}

var findLikesByFeedIdAsync = function (feedId) {
  return Like.find({feed_id: feedId}).exec();
}

var findFeeds = async function (userid, orientation, sid, limit, offset) {

    var feeds;

    limit = parseInt( limit ) || 10
    offset = parseInt( offset ) || 1

    if (orientation && sid) {
        feeds = await Feed.pageQueryFeeds(orientation, sid, limit, {userid: userid});
    } else {
        /*默认加载前10条*/
        feeds = await Feed.pageQuery(offset, limit, {userid: userid}, null, {sort: {_id: -1}});
    }

    feeds = feeds.map((feed) => {
        return new Promise(async (resolve, reject) => {
            try {
                var info = await Promise.all([findCommentsByFeedIdAsync(feed.id), findLikesByFeedIdAsync(feed.id)]);

                var comments = info[0];
                var likes = info[1];
                comments = _.filter(comments, function(comment){ return comment.isdeleted !== 1 })
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
        var dur = DurationLog.start(req);
        //var offset = parseInt(req.query.offset || 1);
        //var limit = parseInt(req.query.limit || 4);
        var orientation = req.query.ort;
        var sid = req.query.sid;
        var limit = req.query.limit || 5;
        var offset = req.query.offset || 1

        res.json(await findFeeds(req.params.userid, orientation, sid, limit, offset));
        dur.end();
        return;
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
    //var dur = DurationLog.start(req);
    /* 被查找的userid */
    var userid = req.params.userid;

    /* offset为第几页 */
    var offset = parseInt(req.query.offset) || 1;

    /* limit为每页个数上限 */
    var limit = parseInt(req.query.limit) || 4;

    var ort = req.query.ort;

    var sid = req.query.sid;

    /* 包装后的结果放在里这 */
    var result = [];

    try {
        var follows = await Follows.findOne({userid: userid}).exec();

        var _follows = follows && follows.follows;


        if (_follows && _follows.length) {


            if (req.query.offset && req.query.limit) {
                _follows = _follows.slice((offset - 1) * limit, offset * limit);
            } else if (ort && sid) {
                /* 上下翻刷新 */
                /* 如果sid被删除了，就会返回所有follows */
                var index = _follows.indexOf(sid);
                if (parseInt(ort, 10) === 1) {
                    _follows = _follows.slice(0, index);
                } else {
                    _follows = _follows.slice(index + 1, index + 1 + limit );
                }
            }

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
            res.json(await Promise.all(_follows));

            return; //dur.end();
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

    var ort = req.query.ort;

    var sid = req.query.sid;

    try {

        /* userid下所有followed */
        var followed = await Followed.findOne({userid: userid}).exec();

        var _followed = followed && followed.followed;


        /* 获取当前页的followed */
        //var _followed = followed && followed.followed.slice((offset - 1) * limit, offset * limit);

        if (_followed && _followed.length) {

            if (req.query.offset && req.query.limit) {
                _followed = _followed.slice((offset - 1) * limit, offset * limit);
            } else if (ort && sid) {
                var index = _followed.indexOf(sid);
                if (parseInt(ort, 10) === 1) {
                    _followed = _followed.slice(0, index);
                } else {
                    _followed = _followed.slice(index + 1, index + 1 + limit);
                }
            }

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

router.route( '/profile/extraInfo/:userid' )
    .get(async (req, res)=> {

        try {
            var userId = req.params.userid;

            var user = await User.findOne({openid : userId}).exec();

            res.json(user.extraInfo);
        } catch (err) {
            res.send(err);
        }
    })
    .post(async (req, res) => {
        try {

            var userId = req.params.userid;
            var user = await User.findOne({openid : userId}).exec();
            var nickname = req.body.nickname;
            var pic = req.body.pic;

            if (req.body && nickname) {
                try {
                    await user.validNickname(nickname);
                    /* 同步所有feed中的nick, 忽略返回值*/
                    Feed.update({userid: userId}, {nick: nickname}, { multi: true }).exec();
                } catch (err) {
                    // 昵称重复
                    return res.json({err: 1});
                }
            }
            if (req.body && pic) {
                /* 同步所有feed中的avator, 忽略返回值*/
                Feed.update({userid: userId}, {avator: pic}, { multi: true }).exec();
            }

            user.set({extraInfo:req.body});
            var location = req.body.location.split( ', ' )
            user.set( {
              nickname : req.body.nickname,
              sex : req.body.sex,
              province : location && location[ 0 ] ? location[ 0 ] : user.province,
              city : location && location[ 1 ] ? ( location[ 2 ] ? location[ 1 ] + ', ' + location[ 2 ] : location[ 1 ] ) : user.city,
              headimgurl : req.body.pic ? req.body.pic : user.headimgurl
            } )
            await user.save();

            res.json( { message : 'extra info saved' } );
        } catch(err) {
            res.send(err);
        }
    });


router.route( '/profile/recommend/detail' )
  .get(async ( req, res ) => {

     /* offset为第几页 */
    var offset = parseInt(req.query.offset) || 1;

    /* limit为每页个数上限 */
    var limit = parseInt(req.query.limit) || 10;

    var ort = req.query.ort;

    var sid = req.query.sid;

    try {

        var users;

        if (req.query.offset && req.query.limit) {
            users = await User.pageQuery(offset, limit, null, null, {sort: {follower: -1}});
        } else if (ort && sid) {
            users = await User.pageQueryFeeds(ort, sid, limit);
        } else {
            return res.end();
        }


        users = users.map((user) => {

            return new Promise(async (resolve, reject) => {

                const userid = user.openid;

                try {
                    //var userDetail = User.findOne({openid: userid}).exec();

                    const feedsResult = [];
                    var feeds = await Feed.pageQuery(1, 3, {userid: user.openid}, null, {sort: {_id: -1}});
                    // console.log( feeds )
                    feeds.forEach((feed) => {
                        feedsResult.push({
                            image: feed.image
                        });
                    });

                    resolve({
                        _id: user._id,
                        userid : user.openid,
                        nickname : user.nickname,
                        headimgurl : user.headimgurl,
                        feeds : feedsResult,
                        fan_c : user.follower
                    });

                } catch (err) {
                    reject(err);
                }
            });
        });

        return res.json(await Promise.all(users));

    } catch (err) {
        return res.send(err);
    }
});

module.exports = router
