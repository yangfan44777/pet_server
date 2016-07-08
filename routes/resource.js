var request = require( 'request' )
var express = require( 'express' )
var multer = require('multer')
var router = express.Router()

var upload = multer({
  dest: './public/uploads/',
}).single( 'photo' )

router.post('/resource/upload', upload, function(req, res, next) {
  // console.log( req.file )
  res.send( req.file )
})

module.exports = router
