/**
 * Force memory adapter
 */

/**
 * Utils
 */
process.env.NODE_ENV = 'dev';

request = require('supertest');
app = require('../app');
assert = require('assert');

/**
 * Test Data
 */

testData = {
  locations: require('../test-data/locations')
};

function error (err) {
    console.log(err);
}

before(function(done) {
  this.timeout(5000);
  console.error('Importing test data, this may take long time.');
  importer = require('../test-data/import');
  importer.on('error', done);
  importer.on('done', done);
});
