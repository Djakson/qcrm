/**
 * Created by jasper on 5/3/14.
 */
var db = require('../data-sources/db');
var config = require('./city.json');
var loopback = require('loopback');

/**
 * City Model
 */
var City = module.exports = loopback.Model.extend(
    'city',
    config.properties,
    config.options
);

// attach to the db
City.attachTo(db);