// deprecated!
var express = require('express');
var subdomain = require('express-subdomain');
var app1 = require('./led/app.js');
var app2 = require('./bb8/app.js');

express()
.use(subdomain('led', app1))
.use(subdomain('bb8', app2))
.listen(11342, 'localhost');
