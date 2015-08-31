'use strict';

/* eslint no-var:0 */
var express = require('express');
var morgan = require('morgan');
var http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(morgan('combined'));
app.use(express.static(__dirname));

http
  .createServer(app)
  .listen(app.get('port'), function() {
    console.log('Debug/local server listening on port ' + app.get('port'));
  });
