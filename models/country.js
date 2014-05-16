/**
 * Created by jasper on 5/3/14.
 */
var db = require('../data-sources/db');
var config = require('./country.json');
var loopback = require('loopback');

/**
 * City Model
 */
var Country = module.exports = loopback.Model.extend(
    'country',
    config.properties,
    config.options
);

// attach to the db
Country.attachTo(db);