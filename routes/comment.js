var Comment = require( '../models/comment' )
var Feed = require( '../models/feed' )
var express = require( 'express' )
var router = express.Router()


router.route( '/comment/delete/:feed_id/:comment_id' )
  .put( async ( req, res ) => {
    /*Comment.findOne( { _id : req.params.comment_id }, ( err, comment ) => {

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

    } )*/
      try {
        var feed = await Feed.findById(req.params.feed_id, 'comments').exec();
        var idx = _.findIndex(feed.comments, (comment) => {return comment.comment_id === req.params.comment_id});
        if (idx > -1) {
          feed.comments[idx]['isdeleted'] = 1;
          await feed.save();
          res.json(feed.comments[idx]);
        }
      } catch (err) {
        res.send(err);
      }
  } )

router.route( '/comment/:feed_id' )
  .get( async ( req, res ) => {
    /*Comment.find( { feed_id : req.params.feed_id } ).exec( ( err, comments ) => {
      if( err ) {
        return res.send( err )
      }
      res.json( comments )
    } )*/
    try {
      var feedLean = await Feed.findById(req.params.feed_id, 'comments').lean().exec();
      res.json(feedLean.comments);
    } catch (err) {
      res.send(err);
    }

  } )
  .post(async ( req, res ) => {
    /*var reqBody = Object.assign( req.body, { feed_id : req.params.feed_id } )
    const comment = new Comment( Object.assign( req.body, { feed_id : req.params.feed_id } ) )
    comment.save( ( err, result ) => {
      if( err ) {
        return res.send( err )
      }
      // console.log('hehehehe', comment)
      /* 更新feed的comments */
     try {
        var comment = Object.assign(req.body, {feed_id: req.params.feed_id, _id: uuid()});
        var feed = await Feed.findById(req.params.feed_id, 'comments').exec();
        feed.comments.push(comment);
        await feed.save();
        res.json(comment);
      } catch (err) {
        res.send(err);
      }
    //} )
  } )

  /* 用于生成唯一id */
  function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
 
    var uuid = s.join("");
    return uuid;
  }
  /* 迁移接口 */
  router.route('/comment/trans/do')
    .get(async (req, res) => {
      var allComments = await Comment.find().exec();
      allComments.forEach(async (comment) => {
        var feed = await Feed.findById(comment.feed_id).exec();
        feed.comments.push({
            _id: comment._id,
            commenter_id : comment.commenter_id,
            commenter_nick : comment.commenter_nick,
            content : comment.content,
            commentee : {
              commentee_id : comment.commentee.commentee_id,
              commentee_nick : comment.commentee.commentee_nick
            },
            isdeleted : comment.isdeleted
        });
        //feed.comments.push(comment);
        feed.save();
      });

    });

module.exports = router
