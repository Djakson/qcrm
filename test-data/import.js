/**
 * Run `node import.js` to import the test data into the db.
 */

var db = require('../data-sources/db');
var customers = require('./customers.json');
var locations = require('./locations.json');
var sources = require('./sources.json');
var cities = require('./cities.json');
var franchisees = require('./franchisees.json');
var order_types = require('./order_types.json');
var orders = require('./orders.json');
var users = require('./users.json');
var scenarios = require('./scenarios.json');
var countries = require('./countries.json');
var images = require('./images.json');
var games = require('./games.json');
// var loopback = require('loopback');
var Location = require('../models/location');
var Customer = require('../models/customer');
var Source = require('../models/source');
var OrderType = require('../models/order_type');
var Order = require('../models/order');
var Franchisee = require('../models/franchisee');
var City = require('../models/city');
var User = require('../models/user');
var Scenario = require('../models/scenario');
var Country = require('../models/country');
var Image = require('../models/image');
var Game = require('../models/game');

var async = require('async');

var events = require('events');
var emitter = new events.EventEmitter();

module.exports = emitter;

var ids = {
};

function importData(Model, data, cb) {
  // console.log('Importing data for ' + Model.modelName);
  Model.destroyAll(function (err) {
    if(err) {
      cb(err);
      return;
    }
    async.each(data, function (d, callback) {
      if(ids[Model.modelName] === undefined) {
        ids[Model.modelName] = 1;
      }
      d.id = ids[Model.modelName]++;
      Model.create(d, callback);
    }, cb);
  });
}

setTimeout(function(){
    async.series(
        [
            function (cb) {
                db.autoupdate(cb);
            },

            importData.bind(null, Image, images),
            importData.bind(null, User, users),
            importData.bind(null, City, cities),
            importData.bind(null, Country, countries),
            importData.bind(null, Location, locations),
            importData.bind(null, Source, sources),
            importData.bind(null, Customer, customers),
            importData.bind(null, OrderType, order_types),
            importData.bind(null, Order, orders),
            importData.bind(null, Scenario, scenarios),
            importData.bind(null, Game, games),

             function (cb) {
                Franchisee.destroyAll(function (err) {
                    if(err) {
                        cb(err);
                        return;
                    }
                    async.eachSeries(franchisees, function(franchisee, callback){
                        if(ids.franchisee === undefined) {
                            ids.franchisee = 1;
                        }
                        franchisee.id = ids.franchisee++;
                        Franchisee.create(franchisee, function(err, fran){
                            async.each(franchisee.scenarios, function(scen, callb){
                                Scenario.findById(scen.id, function(err, scenario){
                                    fran.scenarios.add(scenario);
                                    callback();
                                });
                            });
                        });
                    }, cb);
                });
             },
        ], function (err, results) {
            if(err) {
                console.error(err);
                emitter.emit('error', err);
            } else {
                emitter.emit('done');
            }
        });
}, 1000);




