/**
 * Created by jasper on 5/3/14.
 */
var db = require('../data-sources/db');
var config = require('./order_type.json');
var loopback = require('loopback');

/**
 * order Model
 */

var order_type = module.exports = loopback.Model.extend(
    'order_type',
    config.properties,
    config.options
);

// attach to the db
order_type.attachTo(db);