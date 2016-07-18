"use strict";

var Topic = require( '../models/topic' )
var express = require( 'express' )
var router = express.Router()

router.route( '/topic' )
  // 获取最新4个 topic
  /*.get( ( req, res ) => {
    Topic.find().sort( { _id : -1 } ).limit( 4 ).exec( ( err, topics ) => {
      if( err ) {
        return res.send( err )
      }
      res.json( topics )
    } )
  } )*/
  .get(async (req, res) => {
    try {
      var topics = await Topic.pageQuery(1, 4, null, null, {sort:{_id: -1}});
      res.json(topics);
    } catch (err) {
      res.send(err);
    }
  })
  // 提交一个 topic
  .post( ( req, res ) => {
    const topic = new Topic( req.body )
    topic.save( ( err ) => {
      if( err ) {
        return res.send( err )
      }
      res.send( { message : 'Topic added.' } )
    } )
  } )

router.route( '/topic/:title' )
  .get( ( req, res ) => {
    Topic.findOne( { title : req.params.title }, ( err, topic ) => {
      if( err ){
        return res.send( err )
      }
      res.json( topic )
    } )
  } )

  module.exports = router
