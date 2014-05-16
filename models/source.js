/**
 * Created by jasper on 5/3/14.
 */
var db = require('../data-sources/db');
var config = require('./source.json');
var loopback = require('loopback');

/**
 * customer Model
 */

var source = module.exports = loopback.Model.extend(
    'source',
    config.properties,
    config.options
);

// attach to the db
source.attachTo(db);
