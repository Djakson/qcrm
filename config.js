/**
 * We leave `rc` responsible for loading and merging the various configuration
 * sources.
 */
var path = require('path');
var nodeEnv = process.env.NODE_ENV || 'dev';
var config = require('rc')('loopback', {
  name: 'qcrm',
  env: 'dev'
});



if (!config[nodeEnv]) {
  config[nodeEnv] = (nodeEnv == 'test' && config.dev) ? config.dev : {};
}


config['dev']['mysql'] = {
    host: 'localhost',
    port: 3306,
    database: 'qcrm',
    username: 'root',
    password: 'bitnami',
    collation: 'utf8_general_ci'
};
config['upload_path'] = path.join(__dirname, 'public', 'app', 'storage');
config['media_url'] = '/app/storage/';
config['fake_img'] = {
    path: path.join(config['upload_path'], 'images', 'default.jpg')
};

module.exports = config;
