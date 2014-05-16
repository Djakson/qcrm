/**
 * Created by jasper on 5/5/14.
 */
var loopback = require('loopback');
var config = require('../config');
var path = require('path');

var ds = loopback.createDataSource({
    connector: require('loopback-storage-service'),
    provider: 'filesystem',
    root: path.join(__dirname, '..', 'public', 'app', 'storage')
});

try {
    module.exports = ds;
} catch (e) {
    console.error('Error while initializing the data source:');
    console.error(e.stack);
    console.error('\nPlease check your configuration settings and try again.');
    process.exit(1);
}