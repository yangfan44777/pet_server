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
var app = express();

var dbName = 'petDB'

var connectionString = 'mongodb://localhost/' + dbName

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
});

mongoose.connect( connectionString )

app.use( bodyParser.json() )
app.use( bodyParser.urlencoded() )
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

app.use( express.static(__dirname+ '/public')  )

module.exports = app;
