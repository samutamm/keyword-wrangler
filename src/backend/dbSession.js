'use strict';

var DBWrapper = require('node-dbi').DBWrapper;

var dbWrapper = new DBWrapper('sqlite3', {'path': '/var/tmp/keyword-wrangler.tes\
t.sqlite'});
dbWrapper.connect();

module.exports = dbWrapper;
