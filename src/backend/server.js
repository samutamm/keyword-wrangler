'use strict';

var Percolator = require('percolator').Percolator;
var dbSession = require('../../src/backend/dbSession.js');

var Server = function(port) {
  var server = Percolator({'port': port, 'autoLink': false, 'staticDir': __dirname + '/../frontend'});

  server.route('/api/keywords',
    {
      GET: function(req, res) {
        dbSession.fetchAll(
          'SELECT id, value, categoryID FROM keyword ORDER BY id',
          function(err, rows) {
            sendResponse(res, err, rows);
          });
      }
    });

    server.route('/api/keywords/categories',
      {
        GET: function(req, res) {
          dbSession.fetchAll(
            'SELECT id, name FROM category ORDER BY id',
            function(err, rows) {
              sendResponse(res, err, rows);
            });
        }
      });
  return server;
}

function sendResponse(res ,err, rows) {
  if (err) {
    console.log(err);
    res.status.internalServerError(err);
  } else {
    res.collection(rows).send();
  }
}

module.exports = {'Server': Server};
