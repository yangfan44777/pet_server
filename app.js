var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var feeds = require('./routes/feeds'); //routes are defined here
var comment = require( './routes/comment' )
var user = require( './routes/user' )
var resource = require( './routes/resource' )
var like = require( './routes/like' )
var profile = require( './routes/profile' )
var feed = require( './routes/feed' )
var follow = require( './routes/follow' )
var notify = require( './routes/notify' )
var topic = require( './routes/topic' )
var article = require( './routes/article' )
var feedback = require( './routes/feedback' )
var banner = require( './routes/banner' )
var checkApi = require('./routes/checkApi')
var banner = require('./routes/banner')
var FileStreamRotator = require('file-stream-rotator');
var logger = require('morgan');
var app = express();


/* access日志 */
var logDirectory = __dirname + '/logs';
var accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: logDirectory + '/access-%DATE%.log',
    frequency: 'daily',
    verbose: false
});

app.use(logger('combined', {stream: accessLogStream}));


/* 数据库 */
var dbName = 'petDB'

var connectionString = 'mongodb://101.200.150.4/' + dbName + '?poolSize=100'
 // var connectionString = 'mongodb://127.0.0.1/' + dbName + '?poolSize=100'

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
  console.log('mongodb opend');
});

mongoose.connect( connectionString )


/* 静态目录 */
app.use( express.static(__dirname+ '/public')  )

app.use( bodyParser.json() )
app.use( bodyParser.urlencoded() )


/* 验证api来源及是否合法 */
var secretkey = 'dbb6e2c753660cbafa25a2639c059e5f';
// app.use('/', checkApi(secretkey));
app.use( '/api', feeds )
app.use( '/api', comment )
app.use( '/api', user )
app.use( '/api', resource )
app.use( '/api', like )
app.use( '/api', profile )
app.use( '/api', feed )
app.use( '/api', follow )
app.use( '/api', notify )
app.use( '/api', topic )
app.use( '/api', article )
app.use( '/api', feedback )
app.use( '/api', banner )


module.exports = app;
