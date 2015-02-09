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
            syncOptions: {
                force: false
            }
        };
        server.register({
            register: require('..'),
            options: options
        }, function(err) {
            //console.log(err);
            expect(err).to.be.undefined();
            //expect(err).to.be.null;
            done();
        });
    });

    it('should error on bad database authentication', function(done) {
        var options = {
            modelsPath: '',
            database: 'badTableName',
            user: 'root',
            password: 'vegerano',
            dialect: 'mysql',
            port: 3306,
            host: '192.168.59.103',
            logging: false,
            syncOptions: {
                force: false
            }
        };
        server.register({
            register: require('..'),
            options: options
        }, function(err) {
            //console.log(err);
            expect(err).to.be.undefined();
            //expect(err).to.be.null;
            done();
        });
    });
});
