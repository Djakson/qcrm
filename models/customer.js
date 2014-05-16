/**
 * Module Dependencies
 */

var db = require('../data-sources/db');
var config = require('./customer.json');
var loopback = require('loopback');
var source = require('./source');
var user = require('./user');
/**
 * customer Model
 */

var customer = module.exports = db.createModel(
  'customer',
  config.properties,
  config.options
);
customer.belongsTo(source, {foreignKey: "source_id"});
customer.belongsTo(user, {as: 'user', foreignKey: "user_id"});
// attach to the db
customer.attachTo(db);


