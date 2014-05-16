/**
 * Created by jasper on 5/6/14.
 */
var ds = require('../data-sources/ds');
var loopback = require('loopback');
var fs = require('fs');
var path = require('path');
var util = require('util');
var Image = require('./image');
var config = require('./../config');
/**
 * Storage Model
 */
var Storage = module.exports = ds.createModel('storage');

//var log = fs.createWriteStream('/Users/jasper/Sites/q_crm/qcrm/public/app/storage/log.log', {flags : 'w'});

Storage.afterRemote('**', function(ctx, storage, next) {
    var image_data = storage.result.files.file[0];

    var extract_ext = function(name_with_ext) {
        var expr = /([^\.]+)\.(\w+)$/.exec(name_with_ext);
        if (expr){
            return {name: expr[1], ext: expr[2]};
        }
        return {name: '', ext: ''};

    };

    Image.create(
        {
            name: extract_ext(image_data.name).name,
            path: path.join(config['upload_path'], 'images', image_data.name),
            url: config['media_url'] + 'images/' + image_data.name,
            extension: extract_ext(image_data.name).ext
        },
        function(image){
            next(image);
        }
    );
});

// attach to the ds
Storage.attachTo(ds);