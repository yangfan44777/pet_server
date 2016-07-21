"use strict";

var Article = require( '../models/article' )
var RecommendArticle = require( '../models/recommend_article' )
var express = require( 'express' )
var router = express.Router()

router.route( '/article/all' )
  .get( async ( req, res ) => {
    try{

      var offset = req.query.offset;
      var limit = req.query.limit;
      var sid = req.query.sid;
      var ort = req.query.ort;

      var articles = [];
      if (offset && limit) {
        articles = await Article.pageQuery(parseInt(offset, 10), parseInt(limit, 10), null, null, {sort: {_id: -1}});
      } else if (sid && ort) {
        articles = await Article.pageQueryFeeds(ort, sid, limit || 10);
      } else {
        articles = await Article.find().sort( { _id : -1 } ).exec();
      }

      
      //var articles = await Article.find().sort( { _id : -1 } ).exec()
      res.json( articles )
    } catch( e ) {
      res.send( e )
    }
  } )

router.route( '/article/recommend' )
  .get( async ( req, res ) => {
    try {

      var offset = req.query.offset;
      var limit = req.query.limit;
      var sid = req.query.sid;
      var ort = req.query.ort;

      var articles = [];
      if (offset && limit) {
        articles = await RecommendArticle.pageQuery(parseInt(offset, 10), parseInt(limit, 10), null, null, {sort: {_id: -1}});
      } else if (sid && ort) {
        articles = await RecommendArticle.pageQueryFeeds(ort, sid, limit || 10);
      } else {
        articles = await RecommendArticle.find().exec()
      }

      //var articles = await RecommendArticle.find().exec()
      res.json( articles )
    } catch (e) {
      res.send( e )
    }

  } )
  .post( async ( req, res ) => {
    var recommendArticle = new RecommendArticle( req.body )
    try{

      var article = await Article.findOne( { id : req.body.id } ).exec()
      article.has_recommend = 1

      await article.save()
      await recommendArticle.save()
      res.json( { message : 'article recommend success.' } )

    } catch( e ) {

      res.send( e )

    }

  } )


module.exports = router
