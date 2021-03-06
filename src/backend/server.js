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
          }
        );
    },
    POST: function(req, res) {
      req.onJson(function(err, newKeyword) {
        if (err) {
          console.log(err);
          res.status.internalServerError(err);
        } else {
          console.log('Coming JSON: ' + newKeyword);
          dbSession.query('INSERT INTO keyword (value, categoryID) VALUES (?, ?);',
          [newKeyword.value, newKeyword.categoryID],
          function (err, result) {
            if (err) {
              console.log(err);
              res.status.internalServerError(err);
            } else {
              var id = dbSession.getLastInsertId();
              console.log(id);
              res.object({'status': 'ok', 'id': id}).send();
            }
          }
          );
        }

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
    }
  );

  server.route('/api/keywords/:id',
  {
  POST: function(req, res) {
    var keywordId = req.uri.child();
    req.onJson(function(err, keyword) {
    if (err) {
      console.log(err);
      res.status.internalServerError(err);
    } else {
    dbSession.query('UPDATE keyword SET value = ?, categoryID = ? WHERE keyword.id = ?;',
    [keyword.value, keyword.categoryID, keywordId],
    function (err, result) {
      if (err) {
      console.log(err);
      res.status.internalServerError(err);
      } else {
      res.object({'status': 'ok'}).send();
      }
    });
    }
    });
  },

    DELETE: function(req, res) {
      var keywordId = req.uri.child();
      dbSession.query('DELETE FROM keyword WHERE keyword.id = ?;', [keywordId],
      function(err, result) {
        if (err) {
          console.log(err);
          res.status.internalServerError(err);
        } else {
          res.object({'status': 'ok'}).send();
        }
      });
    }
  }
  );

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
