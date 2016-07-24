var request = require( 'request' )
var express = require( 'express' )
var multer = require('multer')
var easyimg = require('easyimage')
var router = express.Router()

var crypto = require('crypto');

var encrypt = function (str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
　enc += cipher.final('hex');
　return enc;
};

var md5 = function (str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, './public/uploads/')
    cb( null, '/usr/share/nginx/images/' )
    // cb( null, '/tmp/ngnix/images/' )
  },
  filename: function (req, file, cb) {

    cb( null, file.fieldname + '-' + Date.now() + md5( file.fieldname ) + '.jpg' )
  }
})

var upload = multer({ storage: storage }).single( 'photo' )
//
// var upload = multer({
//   dest: './public/uploads/',
// }).single( 'photo' )

router.post('/resource/upload', upload, function(req, res, next) {
  // console.log( req.file )
  easyimg.resize( {
    src : req.file.path,
    dst : req.file.path.replace( /\.jpg/, '_thumbnail.jpg' ),//path to destination image.
    width : 120,
    height : 120
  } )
  res.send( req.file )
})

module.exports = router
