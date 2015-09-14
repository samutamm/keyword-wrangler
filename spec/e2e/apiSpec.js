'use strict';

var request = require('request');
var dbSession = require('../../src/backend/dbSession.js');
var resetDatabase = require('../resetDatabase.js');
var async = require('async');

describe('The API', function() {

  it('should respond to a GET request at /api/keywords/', function(done) {
    var expected = {
      "_items": [
        {'id': 1, 'value': 'Aubergine', 'categoryID': 1},
        {'id': 2, 'value': 'Onion', 'categoryID': 1},
        {'id': 3, 'value': 'Knife', 'categoryID': 2}
      ]
    };

    var keywordToAdd = function(index) {
      return {'value': expected["_items"][index].value, 'categoryID': expected["_items"][index].categoryID};
    }

    async.series(
      [
        function(callback) {
          resetDatabase(dbSession, callback);
        },

        function(callback) {
          dbSession.insert(
            'keyword',
            keywordToAdd(0),
            function(err) { callback(err)}
          );
        },

        function(callback) {
          dbSession.insert(
            'keyword',
            keywordToAdd(1),
            function(err) { callback(err)}
          );
        },

        function(callback) {
          dbSession.insert(
            'keyword',
            keywordToAdd(2),
            function(err) { callback(err)}
          );
        }
      ],
      function(err, results) {
        request.get(
          {
            'url': 'http://localhost:8080/api/keywords/',
            'json': true
          },
          function(err, res, body) {
            expect(res.statusCode).toBe(200);
            expect(body).toEqual(expected);
            done();
          }
        );
      }
    );
  });
});
