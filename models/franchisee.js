/**
 * Created by jasper on 5/3/14.
 */
var db = require('../data-sources/db');
var config = require('./franchisee.json');
var loopback = require('loopback');
var user = require('./user');
var city = require('./city');
var Scenario = require('./scenario');
/**
 * Franchisee Model
 */

var Franchisee = module.exports = db.createModel(
    'franchisee',
    config.properties,
    config.options
);

Franchisee.belongsTo(user, {foreignKey: "user_id"});
Franchisee.belongsTo(city, {foreignKey: "city_id"});
Franchisee.hasAndBelongsToMany("scenarios", { model: Scenario });


Franchisee.prototype.addScenario = function(scenario, callback) {
    var self = this;
    if ('object' == typeof scenario) {
        Scenario.findById(scenario.id, function(err, scenario){
            self.scenarios.add(scenario, function(err, scenario){
                self.scenarios({}, function(err, scenarios){
                    console.log (scenarios);
                    callback(null, scenarios);
                });
            });

        });
    }
};

Franchisee.prototype.removeScenario = function(scenario, callback) {
    var self = this;
    if ('object' == typeof scenario) {
        Scenario.findById(scenario.id, function(err, scenario){
            self.scenarios.remove(scenario, function(err){
                self.scenarios({}, function(err, scenarios){
                    console.log (scenarios);
                    callback(null, scenarios);
                });
            });

        });
    }
};

loopback.remoteMethod(
    Franchisee.prototype.addScenario,
    {
        accepts: [
            {arg: 'scenario', type: 'object', required: true, http: {source: 'body'}}
        ],
        returns: {
            arg: 'scenario_collection', type: 'array', root: true, description:'scenarios collection'
        },
        http: {verb: 'post', path: '/scenarios/add'}
    }
);

loopback.remoteMethod(
    Franchisee.prototype.removeScenario,
    {
        accepts: [
            {arg: 'scenario', type: 'object', required: true, http: {source: 'body'}}
        ],
        returns: {
            arg: 'scenario_collection', type: 'array', root: true, description:'scenarios collection'
        },
        http: {verb: 'post', path: '/scenarios/remove'}
    }
);

// attach to the db
Franchisee.attachTo(db);
