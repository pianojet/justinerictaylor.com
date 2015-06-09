var express = require('express');

express()
.use(express.vhost('led.justinerictaylor.com', require('led/app.js').app))
//.use(express.vhost('sync.mysite.com', require('/path/to/sync').app))
.listen(80)