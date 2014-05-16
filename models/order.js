/**
 * Created by jasper on 5/3/14.
 */
var db = require('../data-sources/db');
var config = require('./order.json');
var loopback = require('loopback');
var order_type = require('./order_type');
var user = require('./user');
var game = require('./game');
/**
 * order Model
 */

var order = module.exports = db.createModel(
    'order',
    config.properties,
    config.options
);

order.belongsTo(order_type, {as: 'type', foreignKey: "order_type_id"});
order.belongsTo(user, {as: 'customer', foreignKey: "order_type_id"});
order.belongsTo(game, {as: 'scheduled_game', foreignKey: "scheduled_game_id"});

// attach to the db
order.attachTo(db);
