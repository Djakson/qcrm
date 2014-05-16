/**
 * REST API Tests
 */

function json(verb, url) {
    return request(app)[verb](url)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
}

describe('REST', function () {
    /**
     * Expected Input Tests
     */

    describe('Expected Usage', function () {

        describe('GET /api/locations', function () {

            var location = {
                "name": "Enterprise Rent-A-Car",
                "street": "8360 SW Barbur Blvd",
                "city": "Portland",
                "state": "OR",
                "country": "US",
                "phone": "(503) 977-7700"
            };

            it('should return a list of locations', function (done) {
                json('get', '/api/locations')
                    .expect(200, function (err, res) {
                        var locations = res.body;
                        assert(Array.isArray(locations));
                        assert.equal(locations.length, testData.locations.length);
                        done();
                    });
            });

            it('should create new location on POST', function (done) {

                json('post', '/api/locations').
                    send(location).
                    expect(200, function (err, res) {
                        if (err) return done(err);
                        assert.equal(location.city, res.body.city);
                        done();
                    });

            });
        });

        describe('/api/customers', function () {
            var credentials = { email: 'a-@example.com', password: 'a-password' };
            var customer;
            var token;
            it('should create new customer on POST', function (done) {
                json('post', '/api/customers')
                    .send(credentials)
                    .expect(200, function (err, res) {
                        if (err) return done(err);
                        customer = res.body;
                        assert.equal(customer.email, credentials.email);
                        done();
                    });
            });

            it('should login existing customer on POST /api/customers/login', function (done) {
                json('post', '/api/customers/login')
                    .send(credentials)
                    .expect(200, function (err, res) {
                        if (err) return done(err);
                        token = res.body;
                        assert.equal(token.userId, customer.id);
                        done();
                    });
            });

            it('should allow GET /api/customers/{my-id}', function (done) {
                json('get', '/api/customers/' + customer.id)
                    .set('Authorization', token.id)
                    .expect(200, function (err, res) {
                        if (err) return done(err);
                        assert.equal(customer.email, res.body.email);
                        done();
                    });
            });

            it('should not allow GET /api/customers/{another-id}', function (done) {
                json('get', '/api/customers/' + (customer.id + 1000))
                    .set('Authorization', token.id)
                    .expect(401, function (err) {
                        done(err);
                    });
            });

            it('should logout existing customer on POST /api/customers/logout', function (done) {
                json('post', '/api/customers/logout')
                    .set('Authorization', token.id)
                    .send({})
                    .expect(204, done);
            });
        });


        describe('/api/franchisees', function(){
            var franchisee =   {
                "contact_email": "contact@fr1.com",
                "order_email": "order@fr1.com",
                "short_currency_name": "руб."
            };

            it('should create new franchisee on POST', function (done) {
                json('post', '/api/franchisees')
                    .send(franchisee)
                    .expect(200, function (err, res) {
                        if (err) return done(err);
                        assert.equal(franchisee.contact_email, res.body.contact_email);
                        done();
                    });
            });

//            it('should has relation to city on GET /api/customers/login', function (done) {
//                json('get', '/api/franchisees')
//                    .send(credentials)
//                    .expect(200, function (err, res) {
//                        if (err) return done(err);
//                        token = res.body;
//                        assert.equal(token.userId, customer.id);
//                        done();
//                    });
//            });
//
//            it('should allow GET /api/customers/{my-id}', function (done) {
//                json('get', '/api/customers/' + customer.id)
//                    .set('Authorization', token.id)
//                    .expect(200, function (err, res) {
//                        if (err) return done(err);
//                        assert.equal(customer.email, res.body.email);
//                        done();
//                    });
//            });
//
//            it('should not allow GET /api/customers/{another-id}', function (done) {
//                json('get', '/api/customers/' + (customer.id + 1000))
//                    .set('Authorization', token.id)
//                    .expect(401, function (err) {
//                        done(err);
//                    });
//            });
//
//            it('should logout existing customer on POST /api/customers/logout', function (done) {
//                json('post', '/api/customers/logout')
//                    .set('Authorization', token.id)
//                    .send({})
//                    .expect(204, done);
//            });
        })
    });

    describe('Unexpected Usage', function () {
        describe('POST /api/franchisees/:id', function () {
            it('should not crash the server when posting a bad id', function (done) {
                json('post', '/api/franchisees/foobar').send({}).expect(404, done);
            });
        });
    });

});
