/**
 * Module Dependencies
 */

var db = require('../data-sources/db');
var config = require('./location.json');
var loopback = require('loopback');

var city = require('./city');
var country = require('./country');
/**
 * location Model
 */

var Location = module.exports = db.createModel(
  'location',
  config.properties,
  config.options
);

Location.belongsTo(city, {foreignKey: "city_id"});
Location.belongsTo(country, {foreignKey: "country_id"});

Location.attachTo(db);