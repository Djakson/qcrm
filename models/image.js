/**
 * Created by jasper on 5/6/14.
 */

var db = require('../data-sources/db');
var loopback = require('loopback');
var easyimg = require('easyimage');
var path = require('path');
var fs = require('fs');
var config = require('./../config');

var Img = module.exports = db.createModel(
    'image',
    {
        path: {
            type: 'String',
            length: 200,
            require: true
        },
        name: {
            type: 'String',
            length: 200,
            require: true
        },
        extension: {
            type: 'String',
            length: 20,
            require: true
        },
        url: {
            type: 'String',
            length: 200,
            require: true
        }
    }
);

/**
 *
 * @param size
 * @param callback (err, stdout, stderr)
 */
Img.prototype.thumbnail = function(size, callback) {
    var createSizeFolder = function (size) {
        if (size.w || size.h) {
            var subfolder = '';
            if (size.w){
                subfolder += size.w.toString();
                if (size.h) {
                    subfolder += 'x' + size.h.toString();
                }else{
                    subfolder += 'x' + size.w.toString();
                }
            }else{
                subfolder += size.h.toString() + 'x' + size.h.toString();
            }

            return subfolder;
        }
        return '0x0';
    };

    if (!fs.existsSync(this.path)) {
        this.path = config.fake_img.path;
    }

    if (size.w || size.h) {
        var image = this;
        var thumb_url = '/app/storage/thumbs/' + createSizeFolder(size) + '/' + image.name + '.' + image.extension;
        if (fs.existsSync(path.join(__dirname, '..', 'public', thumb_url))){
            var stderr = null,
                err = null;
            var stdout = {
                "width": size.w,
                "height": size.h,
                "name": image.name,
                "path": thumb_url
            };
            callback(err, stdout, stderr);
            return
        }
        var options = {
            src: image.path,
            dst: path.join(__dirname, '..', 'public', thumb_url)
        };
        if (!fs.existsSync(path.dirname(options.dst))) {
            fs.mkdirSync(path.dirname(options.dst));
        }
        if (size.w){
            options.width = size.w
        }else{
            options.height = size.h
        }
        easyimg.resize(options, function(err, stdout, stderr){
            if (!err){
                stdout['path'] = thumb_url;
            }
            callback(err, stdout, stderr);
        });
    }else{
        callback({'error': 'invalid size'}, null, null);
    }
}

/**
 *
 * @param size
 * @param fn (err, stdout)
 */
Img.prototype.createThumb = function (size, fn) {
    this.thumbnail(size, function(err, stdout){
        if (err) return fn(err);
        return fn(null, stdout);
    });
};

loopback.remoteMethod(
    Img.prototype.createThumb,
    {
        accepts: [
            {arg: 'size', type: 'object', required: true, http: {source: 'body'}}
        ],
        returns: {
            arg: 'thumb', type: 'object', root: true, description:'small image object'
        },
        http: {verb: 'post', path: '/thumb'}
    }
);


Img.attachTo(db);