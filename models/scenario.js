/**
 * Created by jasper on 5/3/14.
 */
var db = require('../data-sources/db');
var config = require('./scenario.json');
var loopback = require('loopback');
var Image = require('./image');

/**
 * order Model
 */

var scenario = module.exports = db.createModel(
    'scenario',
    config.properties,
    config.options
);

scenario.belongsTo(Image, {foreignKey: 'image_id'});

// attach to the db
scenario.attachTo(db);
