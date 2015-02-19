var Lab = require('lab'),
    Code = require('code'),
    Hapi = require('hapi');

// test shortcuts
var lab = exports.lab = Lab.script(),
    expect = Code.expect,
    before = lab.before,
    it = lab.it,
    describe = lab.describe,
    beforeEach = lab.beforeEach,
    afterEach = lab.afterEach;

describe('hapi-sql', function() {
    var server = null;

    beforeEach(function(done) {
        server = new Hapi.Server();
        done();
    });

    afterEach(function(done) {
        server = null;
        done();
    });

    it('should register the plugin', function(done) {
        var options = {
            modelsPath: '',
            database: 'test',
            user: 'root',
            password: 'vegerano',
            dialect: 'mysql',
            port: 3306,
            host: '192.168.59.103',
            logging: false,
            sync: {
                force: false
            }
        };
        server.register({
            register: require('..'),
            options: options
        }, function(err) {
            expect(err).to.be.undefined();
            done();
        });
    });

    it('should error on bad database sync', function(done) {
        // TODO: need to figure how to mock up a sync error
        var options = {
            modelsPath: '/test/modelsBad',
            database: 'test',
            user: 'root',
            password: 'vegerano',
            dialect: 'mysql',
            port: 3306,
            host: '192.168.59.103',
            logging: false,
            sync: {
                force: true
            }
        };
        server.register({
            register: require('..'),
            options: options
        }, function(err) {
            //expect(1).to.be.a.number();
            done();
        });
    });

    it('should expose models, sequelize, and Sequelize', function(done) {
        var options = {
            modelsPath: '/test/models',
            database: 'test',
            user: 'root',
            password: 'vegerano',
            dialect: 'mysql',
            port: 3306,
            host: '192.168.59.103',
            logging: false,
            sync: {
                force: false
            }
        };
        server.register({
            register: require('..'),
            options: options
        }, function(err) {
            expect(err).to.be.undefined();
            expect(server.plugins['hapi-sql'].database.sequelize).to.be.an.object();
            expect(server.plugins['hapi-sql'].database.Sequelize).to.be.a.function();
            expect(server.plugins['hapi-sql'].database.models).to.be.an.object();
            done();
        });
    });
});
