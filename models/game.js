/**
 * Created by jasper on 5/3/14.
 */
var db = require('../data-sources/db');
var config = require('./game.json');
var loopback = require('loopback');
var scenario = require('./scenario');
var location = require('./location');
var user = require('./user');
/**
 * customer Model
 */

var game = module.exports = db.createModel(
    'game',
    config.properties,
    config.options
);
game.belongsTo(user,     {as: 'lead', foreignKey: "lead_id"});
game.belongsTo(scenario, {foreignKey: "scenario_id"});
game.belongsTo(location, {foreignKey: "location_id"});

// attach to the db
game.attachTo(db);
