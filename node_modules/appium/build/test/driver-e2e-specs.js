require('source-map-support').install();

'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _wd = require('wd');

var _wd2 = _interopRequireDefault(_wd);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _libMain = require('../lib/main');

var _helpers = require('./helpers');

var _appiumBaseDriver = require('appium-base-driver');

var _appiumFakeDriver = require('appium-fake-driver');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

_chai2['default'].use(_chaiAsPromised2['default']);

var should = _chai2['default'].should();
var shouldStartServer = process.env.USE_RUNNING_SERVER !== "0";
var caps = { platformName: "Fake", deviceName: "Fake", app: _helpers.TEST_FAKE_APP };

describe('FakeDriver - via HTTP', function () {
  var server = null;
  var baseUrl = 'http://' + _helpers.TEST_HOST + ':' + _helpers.TEST_PORT + '/wd/hub/session';
  before(function callee$1$0() {
    var args;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (!shouldStartServer) {
            context$2$0.next = 5;
            break;
          }

          args = { port: _helpers.TEST_PORT, host: _helpers.TEST_HOST };
          context$2$0.next = 4;
          return _regeneratorRuntime.awrap((0, _libMain.main)(args));

        case 4:
          server = context$2$0.sent;

        case 5:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  });
  after(function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          if (!server) {
            context$2$0.next = 3;
            break;
          }

          context$2$0.next = 3;
          return _regeneratorRuntime.awrap(server.close());

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  });

  describe('session handling', function () {
    it('should start and stop a session', function callee$2$0() {
      var driver, _ref, _ref2, sessionId;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(driver.init(caps));

          case 3:
            _ref = context$3$0.sent;
            _ref2 = _slicedToArray(_ref, 1);
            sessionId = _ref2[0];

            should.exist(sessionId);
            sessionId.should.be.a('string');
            context$3$0.next = 10;
            return _regeneratorRuntime.awrap(driver.quit());

          case 10:
            context$3$0.next = 12;
            return _regeneratorRuntime.awrap(driver.title().should.eventually.be.rejectedWith(/terminated/));

          case 12:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    it('should be able to run two FakeDriver sessions simultaneously', function callee$2$0() {
      var driver1, _ref3, _ref32, sessionId1, driver2, _ref4, _ref42, sessionId2;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver1 = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(driver1.init(caps));

          case 3:
            _ref3 = context$3$0.sent;
            _ref32 = _slicedToArray(_ref3, 1);
            sessionId1 = _ref32[0];

            should.exist(sessionId1);
            sessionId1.should.be.a('string');
            driver2 = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);
            context$3$0.next = 11;
            return _regeneratorRuntime.awrap(driver2.init(caps));

          case 11:
            _ref4 = context$3$0.sent;
            _ref42 = _slicedToArray(_ref4, 1);
            sessionId2 = _ref42[0];

            should.exist(sessionId2);
            sessionId2.should.be.a('string');
            sessionId1.should.not.equal(sessionId2);
            context$3$0.next = 19;
            return _regeneratorRuntime.awrap(driver1.quit());

          case 19:
            context$3$0.next = 21;
            return _regeneratorRuntime.awrap(driver2.quit());

          case 21:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    it('should not be able to run two FakeDriver sessions simultaneously when one is unique', function callee$2$0() {
      var uniqueCaps, driver1, _ref5, _ref52, sessionId1, driver2;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            uniqueCaps = _lodash2['default'].clone(caps);

            uniqueCaps.uniqueApp = true;
            driver1 = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);
            context$3$0.next = 5;
            return _regeneratorRuntime.awrap(driver1.init(uniqueCaps));

          case 5:
            _ref5 = context$3$0.sent;
            _ref52 = _slicedToArray(_ref5, 1);
            sessionId1 = _ref52[0];

            should.exist(sessionId1);
            sessionId1.should.be.a('string');
            driver2 = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);
            context$3$0.next = 13;
            return _regeneratorRuntime.awrap(driver2.init(caps).should.eventually.be.rejected);

          case 13:
            context$3$0.next = 15;
            return _regeneratorRuntime.awrap(driver1.quit());

          case 15:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    it('should use the newCommandTimeout of the inner Driver on session creation', function callee$2$0() {
      var driver, localCaps, _ref6, _ref62, sessionId;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            driver = _wd2['default'].promiseChainRemote(_helpers.TEST_HOST, _helpers.TEST_PORT);
            localCaps = _Object$assign({
              newCommandTimeout: 0.25
            }, caps);
            context$3$0.next = 4;
            return _regeneratorRuntime.awrap(driver.init(localCaps));

          case 4:
            _ref6 = context$3$0.sent;
            _ref62 = _slicedToArray(_ref6, 1);
            sessionId = _ref62[0];

            should.exist(sessionId);

            context$3$0.next = 10;
            return _regeneratorRuntime.awrap(_bluebird2['default'].delay(250));

          case 10:
            context$3$0.next = 12;
            return _regeneratorRuntime.awrap(driver.source().should.eventually.be.rejectedWith(/terminated/));

          case 12:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    it('should accept valid W3C capabilities and start a W3C session', function callee$2$0() {
      var w3cCaps, _ref7,

      // Create the session
      status, value, sessionId, _ref8, screenshotStatus, screenshotValue, _ref9,

      // Now use that sessionID to call an arbitrary W3C-only endpoint that isn't implemented to see if it responds with correct error
      statusCode, error, _error$value, errorMessage, message, stacktrace;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            w3cCaps = {
              capabilities: {
                alwaysMatch: { platformName: 'Fake' },
                firstMatch: [{ 'appium:deviceName': 'Fake', 'appium:app': _helpers.TEST_FAKE_APP }]
              }
            };
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(_requestPromise2['default'].post({ url: baseUrl, json: w3cCaps }));

          case 3:
            _ref7 = context$3$0.sent;
            status = _ref7.status;
            value = _ref7.value;
            sessionId = _ref7.sessionId;

            should.not.exist(status); // Test that it's a W3C session by checking that 'status' is not in the response
            should.not.exist(sessionId);
            value.sessionId.should.be.a.string;
            value.should.exist;
            value.capabilities.should.deep.equal({
              platformName: 'Fake',
              deviceName: 'Fake',
              app: _helpers.TEST_FAKE_APP
            });

            // Now use that sessionId to call /screenshot
            context$3$0.next = 14;
            return _regeneratorRuntime.awrap((0, _requestPromise2['default'])({ url: baseUrl + '/' + value.sessionId + '/screenshot', json: true }));

          case 14:
            _ref8 = context$3$0.sent;
            screenshotStatus = _ref8.status;
            screenshotValue = _ref8.value;

            should.not.exist(screenshotStatus);
            screenshotValue.should.equal('hahahanotreallyascreenshot');context$3$0.next = 21;
            return _regeneratorRuntime.awrap(_requestPromise2['default'].post({ url: baseUrl + '/' + value.sessionId + '/execute/async', json: { script: '', args: ['a'] } }).should.eventually.be.rejected);

          case 21:
            _ref9 = context$3$0.sent;
            statusCode = _ref9.statusCode;
            error = _ref9.error;

            statusCode.should.equal(404);
            _error$value = error.value;
            errorMessage = _error$value.error;
            message = _error$value.message;
            stacktrace = _error$value.stacktrace;

            errorMessage.should.match(/unknown method/);
            message.should.match(/Method has not yet been implemented/);
            stacktrace.should.match(/FakeDriver.executeCommand/);

            // End session
            context$3$0.next = 34;
            return _regeneratorRuntime.awrap(_requestPromise2['default']['delete']({ url: baseUrl + '/' + value.sessionId }));

          case 34:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    it('should reject invalid W3C capabilities and respond with a 400 Bad Parameters error', function callee$2$0() {
      var badW3Ccaps, _ref10, statusCode, error;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            badW3Ccaps = {
              capabilities: {
                alwaysMatch: {},
                firstMatch: [{ 'appium:deviceName': 'Fake', 'appium:app': _helpers.TEST_FAKE_APP }]
              }
            };
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(_requestPromise2['default'].post({ url: baseUrl, json: badW3Ccaps }).should.eventually.be.rejected);

          case 3:
            _ref10 = context$3$0.sent;
            statusCode = _ref10.statusCode;
            error = _ref10.error;

            statusCode.should.equal(400);
            error.value.message.should.match(/can't be blank/);

          case 8:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    it('should accept a combo of W3C and JSONWP capabilities but default to W3C', function callee$2$0() {
      var combinedCaps, _ref11, status, value, sessionId;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            combinedCaps = {
              "desiredCapabilities": _extends({}, caps),
              "capabilities": {
                "alwaysMatch": _extends({}, caps),
                "firstMatch": [{
                  w3cParam: 'w3cParam'
                }]
              }
            };
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(_requestPromise2['default'].post({ url: baseUrl, json: combinedCaps }));

          case 3:
            _ref11 = context$3$0.sent;
            status = _ref11.status;
            value = _ref11.value;
            sessionId = _ref11.sessionId;

            should.not.exist(status); // If it's a W3C session, should not respond with 'status'
            should.not.exist(sessionId);
            value.sessionId.should.exist;
            value.capabilities.should.deep.equal(_extends({}, caps, {
              w3cParam: 'w3cParam'
            }));

            // End session
            context$3$0.next = 13;
            return _regeneratorRuntime.awrap(_requestPromise2['default']['delete']({ url: baseUrl + '/' + value.sessionId }));

          case 13:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    it('should accept a combo of W3C and JSONWP and if JSONWP has extraneous keys, they should be merged into W3C capabilities', function callee$2$0() {
      var combinedCaps, _ref12, sessionId, status, value;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            combinedCaps = {
              "desiredCapabilities": _extends({}, caps, {
                automationName: 'Fake',
                anotherParam: 'Hello'
              }),
              "capabilities": {
                "alwaysMatch": _extends({}, caps),
                "firstMatch": [{
                  w3cParam: 'w3cParam'
                }]
              }
            };
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(_requestPromise2['default'].post({ url: baseUrl, json: combinedCaps }));

          case 3:
            _ref12 = context$3$0.sent;
            sessionId = _ref12.sessionId;
            status = _ref12.status;
            value = _ref12.value;

            should.not.exist(sessionId);
            should.not.exist(status);
            value.sessionId.should.exist;
            value.capabilities.should.deep.equal(_extends({}, caps, {
              automationName: 'Fake',
              anotherParam: 'Hello',
              w3cParam: 'w3cParam'
            }));

            // End session
            context$3$0.next = 13;
            return _regeneratorRuntime.awrap(_requestPromise2['default']['delete']({ url: baseUrl + '/' + value.sessionId }));

          case 13:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    it('should reject bad W3C capabilities with a BadParametersError (400)', function callee$2$0() {
      var w3cCaps, _ref13, error, statusCode, response, message;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            w3cCaps = {
              capabilities: {
                alwaysMatch: _extends({}, caps, {
                  automationName: "BadAutomationName"
                })
              }
            };
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(_requestPromise2['default'].post({ url: baseUrl, json: w3cCaps }).should.eventually.be.rejected);

          case 3:
            _ref13 = context$3$0.sent;
            error = _ref13.error;
            statusCode = _ref13.statusCode;
            response = _ref13.response;

            response.headers['content-type'].should.match(/application\/json/);

            message = error.value.message;

            message.should.match(/BadAutomationName not part of/);
            statusCode.should.equal(400);

          case 11:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    it('should accept capabilities that are provided in the firstMatch array', function callee$2$0() {
      var w3cCaps, _ref14, value, sessionId, status;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            w3cCaps = {
              capabilities: {
                alwaysMatch: {},
                firstMatch: [{}, _extends({}, caps)]
              }
            };
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(_requestPromise2['default'].post({ url: baseUrl, json: w3cCaps }));

          case 3:
            _ref14 = context$3$0.sent;
            value = _ref14.value;
            sessionId = _ref14.sessionId;
            status = _ref14.status;

            should.not.exist(status);
            should.not.exist(sessionId);
            value.capabilities.should.deep.equal(caps);

            // End session
            context$3$0.next = 12;
            return _regeneratorRuntime.awrap(_requestPromise2['default']['delete']({ url: baseUrl + '/' + value.sessionId }));

          case 12:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    it('should fall back to MJSONWP if w3c caps are invalid', function callee$2$0() {
      var combinedCaps, _ref15, value, sessionId, status;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            combinedCaps = {
              desiredCapabilities: _extends({}, caps),
              capabilities: {
                alwaysMatch: {},
                firstMatch: [{}, _extends({}, caps, {
                  deviceName: null
                })]
              }
            };
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(_requestPromise2['default'].post({ url: baseUrl, json: combinedCaps }));

          case 3:
            _ref15 = context$3$0.sent;
            value = _ref15.value;
            sessionId = _ref15.sessionId;
            status = _ref15.status;

            status.should.exist;
            sessionId.should.exist;
            value.should.deep.equal(caps);

            // End session
            context$3$0.next = 12;
            return _regeneratorRuntime.awrap(_requestPromise2['default']['delete']({ url: baseUrl + '/' + sessionId }));

          case 12:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    it('should fall back to MJSONWP if Inner Driver is not ready for W3C', function callee$2$0() {
      var combinedCaps, createSessionStub, _ref16, value, sessionId, status;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            combinedCaps = {
              desiredCapabilities: _extends({}, caps),
              capabilities: {
                alwaysMatch: _extends({}, caps, {
                  deviceName: null
                })
              }
            };
            createSessionStub = _sinon2['default'].stub(_appiumFakeDriver.FakeDriver.prototype, 'createSession').callsFake(function callee$3$0(jsonwpCaps) {
              var res;
              return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                while (1) switch (context$4$0.prev = context$4$0.next) {
                  case 0:
                    context$4$0.next = 2;
                    return _regeneratorRuntime.awrap(_appiumBaseDriver.BaseDriver.prototype.createSession.call(this, jsonwpCaps));

                  case 2:
                    res = context$4$0.sent;

                    this.protocol.should.equal('MJSONWP');
                    return context$4$0.abrupt('return', res);

                  case 5:
                  case 'end':
                    return context$4$0.stop();
                }
              }, null, this);
            });
            context$3$0.next = 4;
            return _regeneratorRuntime.awrap(_requestPromise2['default'].post({ url: baseUrl, json: combinedCaps }));

          case 4:
            _ref16 = context$3$0.sent;
            value = _ref16.value;
            sessionId = _ref16.sessionId;
            status = _ref16.status;

            status.should.exist;
            sessionId.should.exist;
            value.should.deep.equal(caps);

            createSessionStub.restore();

          case 12:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    it('should handle concurrent MJSONWP and W3C sessions', function callee$2$0() {
      var combinedCaps, _ref17, mjsonwpSessId, mjsonwpValue, status, _ref18, value, w3cSessId, mjsonwpPayload, w3cPayload;

      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            combinedCaps = {
              desiredCapabilities: _extends({}, caps),
              capabilities: {
                alwaysMatch: _extends({}, caps),
                firstMatch: []
              }
            };
            context$3$0.next = 3;
            return _regeneratorRuntime.awrap(_requestPromise2['default'].post({ url: baseUrl, json: _lodash2['default'].omit(combinedCaps, 'capabilities') }));

          case 3:
            _ref17 = context$3$0.sent;
            mjsonwpSessId = _ref17.sessionId;
            mjsonwpValue = _ref17.value;
            status = _ref17.status;

            status.should.exist;
            mjsonwpValue.should.eql(caps);
            mjsonwpSessId.should.exist;

            context$3$0.next = 12;
            return _regeneratorRuntime.awrap(_requestPromise2['default'].post({ url: baseUrl, json: _lodash2['default'].omit(combinedCaps, 'desiredCapabilities') }));

          case 12:
            _ref18 = context$3$0.sent;
            value = _ref18.value;
            w3cSessId = value.sessionId;

            w3cSessId.should.exist;
            value.capabilities.should.eql(caps);

            // Test that both return the proper payload based on their protocol
            context$3$0.next = 19;
            return _regeneratorRuntime.awrap((0, _requestPromise2['default'])(baseUrl + '/' + mjsonwpSessId, { json: true }));

          case 19:
            mjsonwpPayload = context$3$0.sent;

            mjsonwpPayload.sessionId.should.exist;
            mjsonwpPayload.status.should.exist;
            mjsonwpPayload.value.should.eql(caps);

            context$3$0.next = 25;
            return _regeneratorRuntime.awrap((0, _requestPromise2['default'])(baseUrl + '/' + w3cSessId, { json: true }));

          case 25:
            w3cPayload = context$3$0.sent;

            should.not.exist(w3cPayload.sessionId);
            should.not.exist(w3cPayload.status);
            w3cPayload.value.should.eql(caps);

            // End sessions
            context$3$0.next = 31;
            return _regeneratorRuntime.awrap(_requestPromise2['default']['delete']({ url: baseUrl + '/' + mjsonwpSessId }));

          case 31:
            context$3$0.next = 33;
            return _regeneratorRuntime.awrap(_requestPromise2['default']['delete']({ url: baseUrl + '/' + w3cSessId }));

          case 33:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });
  });
});

describe('Logsink', function () {
  var server = null;
  var logs = [];
  var logHandler = function logHandler(level, message) {
    logs.push([level, message]);
  };
  var args = {
    port: _helpers.TEST_PORT,
    host: _helpers.TEST_HOST,
    logHandler: logHandler
  };

  before(function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap((0, _libMain.main)(args));

        case 2:
          server = context$2$0.sent;

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  });

  after(function callee$1$0() {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(server.close());

        case 2:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  });

  it('should send logs to a logHandler passed in by a parent package', function callee$1$0() {
    var welcomeIndex;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          logs.length.should.be.above(1);
          welcomeIndex = logs[0][1].includes('versions of node') ? 1 : 0;

          logs[welcomeIndex].length.should.equal(2);
          logs[welcomeIndex][1].should.include('Welcome to Appium');

        case 4:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  });
});

// Try with valid capabilities and check that it returns a session ID

// Have an MJSONWP and W3C session running concurrently
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvZHJpdmVyLWUyZS1zcGVjcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O3dCQUNSLFVBQVU7Ozs7b0JBQ1AsTUFBTTs7Ozs4QkFDSSxrQkFBa0I7Ozs7a0JBQzlCLElBQUk7Ozs7OEJBQ0MsaUJBQWlCOzs7O3VCQUNBLGFBQWE7O3VCQUNFLFdBQVc7O2dDQUNwQyxvQkFBb0I7O2dDQUNwQixvQkFBb0I7O3FCQUM3QixPQUFPOzs7O0FBRXpCLGtCQUFLLEdBQUcsNkJBQWdCLENBQUM7O0FBRXpCLElBQU0sTUFBTSxHQUFHLGtCQUFLLE1BQU0sRUFBRSxDQUFDO0FBQzdCLElBQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsS0FBSyxHQUFHLENBQUM7QUFDakUsSUFBTSxJQUFJLEdBQUcsRUFBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsR0FBRyx3QkFBZSxFQUFDLENBQUM7O0FBRTVFLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxZQUFZO0FBQzVDLE1BQUksTUFBTSxHQUFHLElBQUksQ0FBQztBQUNsQixNQUFNLE9BQU8sZ0ZBQW9ELENBQUM7QUFDbEUsUUFBTSxDQUFDO1FBRUMsSUFBSTs7OztlQUROLGlCQUFpQjs7Ozs7QUFDZixjQUFJLEdBQUcsRUFBQyxJQUFJLG9CQUFXLEVBQUUsSUFBSSxvQkFBVyxFQUFDOzsyQ0FDOUIsbUJBQWEsSUFBSSxDQUFDOzs7QUFBakMsZ0JBQU07Ozs7Ozs7R0FFVCxDQUFDLENBQUM7QUFDSCxPQUFLLENBQUM7Ozs7ZUFDQSxNQUFNOzs7Ozs7MkNBQ0YsTUFBTSxDQUFDLEtBQUssRUFBRTs7Ozs7OztHQUV2QixDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLGtCQUFrQixFQUFFLFlBQVk7QUFDdkMsTUFBRSxDQUFDLGlDQUFpQyxFQUFFO1VBQ2hDLE1BQU0sZUFDTCxTQUFTOzs7OztBQURWLGtCQUFNLEdB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QUFXO0FBQ2YsY0FBVSxFQUFWLFVBQVU7R0FDWCxDQUFDOztBQUVGLFFBQU0sQ0FBQzs7Ozs7MkNBQ1UsbUJBQWEsSUFBSSxDQUFDOzs7QUFBakMsZ0JBQU07Ozs7Ozs7R0FDUCxDQUFDLENBQUM7O0FBRUgsT0FBSyxDQUFDOzs7OzsyQ0FDRSxNQUFNLENBQUMsS0FBSyxFQUFFOzs7Ozs7O0dBQ3JCLENBQUMsQ0FBQzs7QUFFSCxJQUFFLENBQUMsZ0VBQWdFLEVBQUU7UUFFL0QsWUFBWTs7OztBQURoQixjQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNCLHNCQUFZLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDOztBQUNsRSxjQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsY0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7Ozs7OztHQUMzRCxDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoidGVzdC9kcml2ZXItZTJlLXNwZWNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdHJhbnNwaWxlOm1vY2hhXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgQiBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgY2hhaSBmcm9tICdjaGFpJztcbmltcG9ydCBjaGFpQXNQcm9taXNlZCBmcm9tICdjaGFpLWFzLXByb21pc2VkJztcbmltcG9ydCB3ZCBmcm9tICd3ZCc7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0LXByb21pc2UnO1xuaW1wb3J0IHsgbWFpbiBhcyBhcHBpdW1TZXJ2ZXIgfSBmcm9tICcuLi9saWIvbWFpbic7XG5pbXBvcnQgeyBURVNUX0ZBS0VfQVBQLCBURVNUX0hPU1QsIFRFU1RfUE9SVCB9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgeyBCYXNlRHJpdmVyIH0gZnJvbSAnYXBwaXVtLWJhc2UtZHJpdmVyJztcbmltcG9ydCB7IEZha2VEcml2ZXIgfSBmcm9tICdhcHBpdW0tZmFrZS1kcml2ZXInO1xuaW1wb3J0IHNpbm9uIGZyb20gJ3Npbm9uJztcblxuY2hhaS51c2UoY2hhaUFzUHJvbWlzZWQpO1xuXG5jb25zdCBzaG91bGQgPSBjaGFpLnNob3VsZCgpO1xuY29uc3Qgc2hvdWxkU3RhcnRTZXJ2ZXIgPSBwcm9jZXNzLmVudi5VU0VfUlVOTklOR19TRVJWRVIgIT09IFwiMFwiO1xuY29uc3QgY2FwcyA9IHtwbGF0Zm9ybU5hbWU6IFwiRmFrZVwiLCBkZXZpY2VOYW1lOiBcIkZha2VcIiwgYXBwOiBURVNUX0ZBS0VfQVBQfTtcblxuZGVzY3JpYmUoJ0Zha2VEcml2ZXIgLSB2aWEgSFRUUCcsIGZ1bmN0aW9uICgpIHtcbiAgbGV0IHNlcnZlciA9IG51bGw7XG4gIGNvbnN0IGJhc2VVcmwgPSBgaHR0cDovLyR7VEVTVF9IT1NUfToke1RFU1RfUE9SVH0vd2QvaHViL3Nlc3Npb25gO1xuICBiZWZvcmUoYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIGlmIChzaG91bGRTdGFydFNlcnZlcikge1xuICAgICAgbGV0IGFyZ3MgPSB7cG9ydDogVEVTVF9QT1JULCBob3N0OiBURVNUX0hPU1R9O1xuICAgICAgc2VydmVyID0gYXdhaXQgYXBwaXVtU2VydmVyKGFyZ3MpO1xuICAgIH1cbiAgfSk7XG4gIGFmdGVyKGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc2VydmVyKSB7XG4gICAgICBhd2FpdCBzZXJ2ZXIuY2xvc2UoKTtcbiAgICB9XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzZXNzaW9uIGhhbmRsaW5nJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KCdzaG91bGQgc3RhcnQgYW5kIHN0b3AgYSBzZXNzaW9uJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGRyaXZlciA9IHdkLnByb21pc2VDaGFpblJlbW90ZShURVNUX0hPU1QsIFRFU1RfUE9SVCk7XG4gICAgICBsZXQgW3Nlc3Npb25JZF0gPSBhd2FpdCBkcml2ZXIuaW5pdChjYXBzKTtcbiAgICAgIHNob3VsZC5leGlzdChzZXNzaW9uSWQpO1xuICAgICAgc2Vzc2lvbklkLnNob3VsZC5iZS5hKCdzdHJpbmcnKTtcbiAgICAgIGF3YWl0IGRyaXZlci5xdWl0KCk7XG4gICAgICBhd2FpdCBkcml2ZXIudGl0bGUoKS5zaG91bGQuZXZlbnR1YWxseS5iZS5yZWplY3RlZFdpdGgoL3Rlcm1pbmF0ZWQvKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgYWJsZSB0byBydW4gdHdvIEZha2VEcml2ZXIgc2Vzc2lvbnMgc2ltdWx0YW5lb3VzbHknLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgZHJpdmVyMSA9IHdkLnByb21pc2VDaGFpblJlbW90ZShURVNUX0hPU1QsIFRFU1RfUE9SVCk7XG4gICAgICBsZXQgW3Nlc3Npb25JZDFdID0gYXdhaXQgZHJpdmVyMS5pbml0KGNhcHMpO1xuICAgICAgc2hvdWxkLmV4aXN0KHNlc3Npb25JZDEpO1xuICAgICAgc2Vzc2lvbklkMS5zaG91bGQuYmUuYSgnc3RyaW5nJyk7XG4gICAgICBsZXQgZHJpdmVyMiA9IHdkLnByb21pc2VDaGFpblJlbW90ZShURVNUX0hPU1QsIFRFU1RfUE9SVCk7XG4gICAgICBsZXQgW3Nlc3Npb25JZDJdID0gYXdhaXQgZHJpdmVyMi5pbml0KGNhcHMpO1xuICAgICAgc2hvdWxkLmV4aXN0KHNlc3Npb25JZDIpO1xuICAgICAgc2Vzc2lvbklkMi5zaG91bGQuYmUuYSgnc3RyaW5nJyk7XG4gICAgICBzZXNzaW9uSWQxLnNob3VsZC5ub3QuZXF1YWwoc2Vzc2lvbklkMik7XG4gICAgICBhd2FpdCBkcml2ZXIxLnF1aXQoKTtcbiAgICAgIGF3YWl0IGRyaXZlcjIucXVpdCgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgYmUgYWJsZSB0byBydW4gdHdvIEZha2VEcml2ZXIgc2Vzc2lvbnMgc2ltdWx0YW5lb3VzbHkgd2hlbiBvbmUgaXMgdW5pcXVlJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IHVuaXF1ZUNhcHMgPSBfLmNsb25lKGNhcHMpO1xuICAgICAgdW5pcXVlQ2Fwcy51bmlxdWVBcHAgPSB0cnVlO1xuICAgICAgbGV0IGRyaXZlcjEgPSB3ZC5wcm9taXNlQ2hhaW5SZW1vdGUoVEVTVF9IT1NULCBURVNUX1BPUlQpO1xuICAgICAgbGV0IFtzZXNzaW9uSWQxXSA9IGF3YWl0IGRyaXZlcjEuaW5pdCh1bmlxdWVDYXBzKTtcbiAgICAgIHNob3VsZC5leGlzdChzZXNzaW9uSWQxKTtcbiAgICAgIHNlc3Npb25JZDEuc2hvdWxkLmJlLmEoJ3N0cmluZycpO1xuICAgICAgbGV0IGRyaXZlcjIgPSB3ZC5wcm9taXNlQ2hhaW5SZW1vdGUoVEVTVF9IT1NULCBURVNUX1BPUlQpO1xuICAgICAgYXdhaXQgZHJpdmVyMi5pbml0KGNhcHMpLnNob3VsZC5ldmVudHVhbGx5LmJlLnJlamVjdGVkO1xuICAgICAgYXdhaXQgZHJpdmVyMS5xdWl0KCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSB0aGUgbmV3Q29tbWFuZFRpbWVvdXQgb2YgdGhlIGlubmVyIERyaXZlciBvbiBzZXNzaW9uIGNyZWF0aW9uJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGRyaXZlciA9IHdkLnByb21pc2VDaGFpblJlbW90ZShURVNUX0hPU1QsIFRFU1RfUE9SVCk7XG5cbiAgICAgIGxldCBsb2NhbENhcHMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgbmV3Q29tbWFuZFRpbWVvdXQ6IDAuMjUsXG4gICAgICB9LCBjYXBzKTtcblxuICAgICAgbGV0IFtzZXNzaW9uSWRdID0gYXdhaXQgZHJpdmVyLmluaXQobG9jYWxDYXBzKTtcbiAgICAgIHNob3VsZC5leGlzdChzZXNzaW9uSWQpO1xuXG4gICAgICBhd2FpdCBCLmRlbGF5KDI1MCk7XG4gICAgICBhd2FpdCBkcml2ZXIuc291cmNlKCkuc2hvdWxkLmV2ZW50dWFsbHkuYmUucmVqZWN0ZWRXaXRoKC90ZXJtaW5hdGVkLyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFjY2VwdCB2YWxpZCBXM0MgY2FwYWJpbGl0aWVzIGFuZCBzdGFydCBhIFczQyBzZXNzaW9uJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gVHJ5IHdpdGggdmFsaWQgY2FwYWJpbGl0aWVzIGFuZCBjaGVjayB0aGF0IGl0IHJldHVybnMgYSBzZXNzaW9uIElEXG4gICAgICBjb25zdCB3M2NDYXBzID0ge1xuICAgICAgICBjYXBhYmlsaXRpZXM6IHtcbiAgICAgICAgICBhbHdheXNNYXRjaDoge3BsYXRmb3JtTmFtZTogJ0Zha2UnfSxcbiAgICAgICAgICBmaXJzdE1hdGNoOiBbeydhcHBpdW06ZGV2aWNlTmFtZSc6ICdGYWtlJywgJ2FwcGl1bTphcHAnOiBURVNUX0ZBS0VfQVBQfV0sXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIC8vIENyZWF0ZSB0aGUgc2Vzc2lvblxuICAgICAgY29uc3Qge3N0YXR1cywgdmFsdWUsIHNlc3Npb25JZH0gPSBhd2FpdCByZXF1ZXN0LnBvc3Qoe3VybDogYmFzZVVybCwganNvbjogdzNjQ2Fwc30pO1xuICAgICAgc2hvdWxkLm5vdC5leGlzdChzdGF0dXMpOyAvLyBUZXN0IHRoYXQgaXQncyBhIFczQyBzZXNzaW9uIGJ5IGNoZWNraW5nIHRoYXQgJ3N0YXR1cycgaXMgbm90IGluIHRoZSByZXNwb25zZVxuICAgICAgc2hvdWxkLm5vdC5leGlzdChzZXNzaW9uSWQpO1xuICAgICAgdmFsdWUuc2Vzc2lvbklkLnNob3VsZC5iZS5hLnN0cmluZztcbiAgICAgIHZhbHVlLnNob3VsZC5leGlzdDtcbiAgICAgIHZhbHVlLmNhcGFiaWxpdGllcy5zaG91bGQuZGVlcC5lcXVhbCh7XG4gICAgICAgIHBsYXRmb3JtTmFtZTogJ0Zha2UnLFxuICAgICAgICBkZXZpY2VOYW1lOiAnRmFrZScsXG4gICAgICAgIGFwcDogVEVTVF9GQUtFX0FQUCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBOb3cgdXNlIHRoYXQgc2Vzc2lvbklkIHRvIGNhbGwgL3NjcmVlbnNob3RcbiAgICAgIGNvbnN0IHtzdGF0dXM6c2NyZWVuc2hvdFN0YXR1cywgdmFsdWU6c2NyZWVuc2hvdFZhbHVlfSA9IGF3YWl0IHJlcXVlc3Qoe3VybDogYCR7YmFzZVVybH0vJHt2YWx1ZS5zZXNzaW9uSWR9L3NjcmVlbnNob3RgLCBqc29uOiB0cnVlfSk7XG4gICAgICBzaG91bGQubm90LmV4aXN0KHNjcmVlbnNob3RTdGF0dXMpO1xuICAgICAgc2NyZWVuc2hvdFZhbHVlLnNob3VsZC5lcXVhbCgnaGFoYWhhbm90cmVhbGx5YXNjcmVlbnNob3QnKTtcblxuICAgICAgLy8gTm93IHVzZSB0aGF0IHNlc3Npb25JRCB0byBjYWxsIGFuIGFyYml0cmFyeSBXM0Mtb25seSBlbmRwb2ludCB0aGF0IGlzbid0IGltcGxlbWVudGVkIHRvIHNlZSBpZiBpdCByZXNwb25kcyB3aXRoIGNvcnJlY3QgZXJyb3JcbiAgICAgIGNvbnN0IHtzdGF0dXNDb2RlLCBlcnJvcn0gPSBhd2FpdCByZXF1ZXN0LnBvc3Qoe3VybDogYCR7YmFzZVVybH0vJHt2YWx1ZS5zZXNzaW9uSWR9L2V4ZWN1dGUvYXN5bmNgLCBqc29uOiB7c2NyaXB0OiAnJywgYXJnczogWydhJ119fSkuc2hvdWxkLmV2ZW50dWFsbHkuYmUucmVqZWN0ZWQ7XG4gICAgICBzdGF0dXNDb2RlLnNob3VsZC5lcXVhbCg0MDQpO1xuICAgICAgY29uc3Qge2Vycm9yOmVycm9yTWVzc2FnZSwgbWVzc2FnZSwgc3RhY2t0cmFjZX0gPSBlcnJvci52YWx1ZTtcbiAgICAgIGVycm9yTWVzc2FnZS5zaG91bGQubWF0Y2goL3Vua25vd24gbWV0aG9kLyk7XG4gICAgICBtZXNzYWdlLnNob3VsZC5tYXRjaCgvTWV0aG9kIGhhcyBub3QgeWV0IGJlZW4gaW1wbGVtZW50ZWQvKTtcbiAgICAgIHN0YWNrdHJhY2Uuc2hvdWxkLm1hdGNoKC9GYWtlRHJpdmVyLmV4ZWN1dGVDb21tYW5kLyk7XG5cbiAgICAgIC8vIEVuZCBzZXNzaW9uXG4gICAgICBhd2FpdCByZXF1ZXN0LmRlbGV0ZSh7dXJsOiBgJHtiYXNlVXJsfS8ke3ZhbHVlLnNlc3Npb25JZH1gfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlamVjdCBpbnZhbGlkIFczQyBjYXBhYmlsaXRpZXMgYW5kIHJlc3BvbmQgd2l0aCBhIDQwMCBCYWQgUGFyYW1ldGVycyBlcnJvcicsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IGJhZFczQ2NhcHMgPSB7XG4gICAgICAgIGNhcGFiaWxpdGllczoge1xuICAgICAgICAgIGFsd2F5c01hdGNoOiB7fSxcbiAgICAgICAgICBmaXJzdE1hdGNoOiBbeydhcHBpdW06ZGV2aWNlTmFtZSc6ICdGYWtlJywgJ2FwcGl1bTphcHAnOiBURVNUX0ZBS0VfQVBQfV0sXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHtzdGF0dXNDb2RlLCBlcnJvcn0gPSBhd2FpdCByZXF1ZXN0LnBvc3Qoe3VybDogYmFzZVVybCwganNvbjogYmFkVzNDY2Fwc30pLnNob3VsZC5ldmVudHVhbGx5LmJlLnJlamVjdGVkO1xuICAgICAgc3RhdHVzQ29kZS5zaG91bGQuZXF1YWwoNDAwKTtcbiAgICAgIGVycm9yLnZhbHVlLm1lc3NhZ2Uuc2hvdWxkLm1hdGNoKC9jYW4ndCBiZSBibGFuay8pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhY2NlcHQgYSBjb21ibyBvZiBXM0MgYW5kIEpTT05XUCBjYXBhYmlsaXRpZXMgYnV0IGRlZmF1bHQgdG8gVzNDJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgY29tYmluZWRDYXBzID0ge1xuICAgICAgICBcImRlc2lyZWRDYXBhYmlsaXRpZXNcIjoge1xuICAgICAgICAgIC4uLmNhcHMsXG4gICAgICAgIH0sXG4gICAgICAgIFwiY2FwYWJpbGl0aWVzXCI6IHtcbiAgICAgICAgICBcImFsd2F5c01hdGNoXCI6IHsuLi5jYXBzfSxcbiAgICAgICAgICBcImZpcnN0TWF0Y2hcIjogW3tcbiAgICAgICAgICAgIHczY1BhcmFtOiAndzNjUGFyYW0nLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBjb25zdCB7c3RhdHVzLCB2YWx1ZSwgc2Vzc2lvbklkfSA9IGF3YWl0IHJlcXVlc3QucG9zdCh7dXJsOiBiYXNlVXJsLCBqc29uOiBjb21iaW5lZENhcHN9KTtcbiAgICAgIHNob3VsZC5ub3QuZXhpc3Qoc3RhdHVzKTsgLy8gSWYgaXQncyBhIFczQyBzZXNzaW9uLCBzaG91bGQgbm90IHJlc3BvbmQgd2l0aCAnc3RhdHVzJ1xuICAgICAgc2hvdWxkLm5vdC5leGlzdChzZXNzaW9uSWQpO1xuICAgICAgdmFsdWUuc2Vzc2lvbklkLnNob3VsZC5leGlzdDtcbiAgICAgIHZhbHVlLmNhcGFiaWxpdGllcy5zaG91bGQuZGVlcC5lcXVhbCh7XG4gICAgICAgIC4uLmNhcHMsXG4gICAgICAgIHczY1BhcmFtOiAndzNjUGFyYW0nLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIEVuZCBzZXNzaW9uXG4gICAgICBhd2FpdCByZXF1ZXN0LmRlbGV0ZSh7IHVybDogYCR7YmFzZVVybH0vJHt2YWx1ZS5zZXNzaW9uSWR9YCB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWNjZXB0IGEgY29tYm8gb2YgVzNDIGFuZCBKU09OV1AgYW5kIGlmIEpTT05XUCBoYXMgZXh0cmFuZW91cyBrZXlzLCB0aGV5IHNob3VsZCBiZSBtZXJnZWQgaW50byBXM0MgY2FwYWJpbGl0aWVzJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgY29tYmluZWRDYXBzID0ge1xuICAgICAgICBcImRlc2lyZWRDYXBhYmlsaXRpZXNcIjoge1xuICAgICAgICAgIC4uLmNhcHMsXG4gICAgICAgICAgYXV0b21hdGlvbk5hbWU6ICdGYWtlJyxcbiAgICAgICAgICBhbm90aGVyUGFyYW06ICdIZWxsbycsXG4gICAgICAgIH0sXG4gICAgICAgIFwiY2FwYWJpbGl0aWVzXCI6IHtcbiAgICAgICAgICBcImFsd2F5c01hdGNoXCI6IHsuLi5jYXBzfSxcbiAgICAgICAgICBcImZpcnN0TWF0Y2hcIjogW3tcbiAgICAgICAgICAgIHczY1BhcmFtOiAndzNjUGFyYW0nLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBjb25zdCB7c2Vzc2lvbklkLCBzdGF0dXMsIHZhbHVlfSA9IGF3YWl0IHJlcXVlc3QucG9zdCh7dXJsOiBiYXNlVXJsLCBqc29uOiBjb21iaW5lZENhcHN9KTtcbiAgICAgIHNob3VsZC5ub3QuZXhpc3Qoc2Vzc2lvbklkKTtcbiAgICAgIHNob3VsZC5ub3QuZXhpc3Qoc3RhdHVzKTtcbiAgICAgIHZhbHVlLnNlc3Npb25JZC5zaG91bGQuZXhpc3Q7XG4gICAgICB2YWx1ZS5jYXBhYmlsaXRpZXMuc2hvdWxkLmRlZXAuZXF1YWwoe1xuICAgICAgICAuLi5jYXBzLFxuICAgICAgICBhdXRvbWF0aW9uTmFtZTogJ0Zha2UnLFxuICAgICAgICBhbm90aGVyUGFyYW06ICdIZWxsbycsXG4gICAgICAgIHczY1BhcmFtOiAndzNjUGFyYW0nLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIEVuZCBzZXNzaW9uXG4gICAgICBhd2FpdCByZXF1ZXN0LmRlbGV0ZSh7IHVybDogYCR7YmFzZVVybH0vJHt2YWx1ZS5zZXNzaW9uSWR9YCB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmVqZWN0IGJhZCBXM0MgY2FwYWJpbGl0aWVzIHdpdGggYSBCYWRQYXJhbWV0ZXJzRXJyb3IgKDQwMCknLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCB3M2NDYXBzID0ge1xuICAgICAgICBjYXBhYmlsaXRpZXM6IHtcbiAgICAgICAgICBhbHdheXNNYXRjaDoge1xuICAgICAgICAgICAgLi4uY2FwcyxcbiAgICAgICAgICAgIGF1dG9tYXRpb25OYW1lOiBcIkJhZEF1dG9tYXRpb25OYW1lXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICBjb25zdCB7ZXJyb3IsIHN0YXR1c0NvZGUsIHJlc3BvbnNlfSA9IGF3YWl0IHJlcXVlc3QucG9zdCh7dXJsOiBiYXNlVXJsLCBqc29uOiB3M2NDYXBzfSkuc2hvdWxkLmV2ZW50dWFsbHkuYmUucmVqZWN0ZWQ7XG4gICAgICByZXNwb25zZS5oZWFkZXJzWydjb250ZW50LXR5cGUnXS5zaG91bGQubWF0Y2goL2FwcGxpY2F0aW9uXFwvanNvbi8pO1xuXG4gICAgICBjb25zdCB7bWVzc2FnZX0gPSBlcnJvci52YWx1ZTtcbiAgICAgIG1lc3NhZ2Uuc2hvdWxkLm1hdGNoKC9CYWRBdXRvbWF0aW9uTmFtZSBub3QgcGFydCBvZi8pO1xuICAgICAgc3RhdHVzQ29kZS5zaG91bGQuZXF1YWwoNDAwKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWNjZXB0IGNhcGFiaWxpdGllcyB0aGF0IGFyZSBwcm92aWRlZCBpbiB0aGUgZmlyc3RNYXRjaCBhcnJheScsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHczY0NhcHMgPSB7XG4gICAgICAgIGNhcGFiaWxpdGllczoge1xuICAgICAgICAgIGFsd2F5c01hdGNoOiB7fSxcbiAgICAgICAgICBmaXJzdE1hdGNoOiBbe30sIHtcbiAgICAgICAgICAgIC4uLmNhcHNcbiAgICAgICAgICB9XSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICBjb25zdCB7dmFsdWUsIHNlc3Npb25JZCwgc3RhdHVzfSA9IGF3YWl0IHJlcXVlc3QucG9zdCh7dXJsOiBiYXNlVXJsLCBqc29uOiB3M2NDYXBzfSk7XG4gICAgICBzaG91bGQubm90LmV4aXN0KHN0YXR1cyk7XG4gICAgICBzaG91bGQubm90LmV4aXN0KHNlc3Npb25JZCk7XG4gICAgICB2YWx1ZS5jYXBhYmlsaXRpZXMuc2hvdWxkLmRlZXAuZXF1YWwoY2Fwcyk7XG5cbiAgICAgIC8vIEVuZCBzZXNzaW9uXG4gICAgICBhd2FpdCByZXF1ZXN0LmRlbGV0ZSh7IHVybDogYCR7YmFzZVVybH0vJHt2YWx1ZS5zZXNzaW9uSWR9YCB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZmFsbCBiYWNrIHRvIE1KU09OV1AgaWYgdzNjIGNhcHMgYXJlIGludmFsaWQnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBjb21iaW5lZENhcHMgPSB7XG4gICAgICAgIGRlc2lyZWRDYXBhYmlsaXRpZXM6IHtcbiAgICAgICAgICAuLi5jYXBzLFxuICAgICAgICB9LFxuICAgICAgICBjYXBhYmlsaXRpZXM6IHtcbiAgICAgICAgICBhbHdheXNNYXRjaDoge30sXG4gICAgICAgICAgZmlyc3RNYXRjaDogW3t9LCB7XG4gICAgICAgICAgICAuLi5jYXBzLFxuICAgICAgICAgICAgZGV2aWNlTmFtZTogbnVsbCxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICBjb25zdCB7dmFsdWUsIHNlc3Npb25JZCwgc3RhdHVzfSA9IGF3YWl0IHJlcXVlc3QucG9zdCh7dXJsOiBiYXNlVXJsLCBqc29uOiBjb21iaW5lZENhcHN9KTtcbiAgICAgIHN0YXR1cy5zaG91bGQuZXhpc3Q7XG4gICAgICBzZXNzaW9uSWQuc2hvdWxkLmV4aXN0O1xuICAgICAgdmFsdWUuc2hvdWxkLmRlZXAuZXF1YWwoY2Fwcyk7XG5cbiAgICAgIC8vIEVuZCBzZXNzaW9uXG4gICAgICBhd2FpdCByZXF1ZXN0LmRlbGV0ZSh7IHVybDogYCR7YmFzZVVybH0vJHtzZXNzaW9uSWR9YCB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZmFsbCBiYWNrIHRvIE1KU09OV1AgaWYgSW5uZXIgRHJpdmVyIGlzIG5vdCByZWFkeSBmb3IgVzNDJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgY29tYmluZWRDYXBzID0ge1xuICAgICAgICBkZXNpcmVkQ2FwYWJpbGl0aWVzOiB7XG4gICAgICAgICAgLi4uY2FwcyxcbiAgICAgICAgfSxcbiAgICAgICAgY2FwYWJpbGl0aWVzOiB7XG4gICAgICAgICAgYWx3YXlzTWF0Y2g6IHtcbiAgICAgICAgICAgIC4uLmNhcHMsXG4gICAgICAgICAgICBkZXZpY2VOYW1lOiBudWxsLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgY29uc3QgY3JlYXRlU2Vzc2lvblN0dWIgPSBzaW5vbi5zdHViKEZha2VEcml2ZXIucHJvdG90eXBlLCAnY3JlYXRlU2Vzc2lvbicpLmNhbGxzRmFrZShhc3luYyBmdW5jdGlvbiAoanNvbndwQ2Fwcykge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBCYXNlRHJpdmVyLnByb3RvdHlwZS5jcmVhdGVTZXNzaW9uLmNhbGwodGhpcywganNvbndwQ2Fwcyk7XG4gICAgICAgIHRoaXMucHJvdG9jb2wuc2hvdWxkLmVxdWFsKCdNSlNPTldQJyk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qge3ZhbHVlLCBzZXNzaW9uSWQsIHN0YXR1c30gPSBhd2FpdCByZXF1ZXN0LnBvc3Qoe3VybDogYmFzZVVybCwganNvbjogY29tYmluZWRDYXBzfSk7XG4gICAgICBzdGF0dXMuc2hvdWxkLmV4aXN0O1xuICAgICAgc2Vzc2lvbklkLnNob3VsZC5leGlzdDtcbiAgICAgIHZhbHVlLnNob3VsZC5kZWVwLmVxdWFsKGNhcHMpO1xuXG4gICAgICBjcmVhdGVTZXNzaW9uU3R1Yi5yZXN0b3JlKCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjb25jdXJyZW50IE1KU09OV1AgYW5kIFczQyBzZXNzaW9ucycsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IGNvbWJpbmVkQ2FwcyA9IHtcbiAgICAgICAgZGVzaXJlZENhcGFiaWxpdGllczoge1xuICAgICAgICAgIC4uLmNhcHMsXG4gICAgICAgIH0sXG4gICAgICAgIGNhcGFiaWxpdGllczoge1xuICAgICAgICAgIGFsd2F5c01hdGNoOiB7XG4gICAgICAgICAgICAuLi5jYXBzLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmlyc3RNYXRjaDogW10sXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICAvLyBIYXZlIGFuIE1KU09OV1AgYW5kIFczQyBzZXNzaW9uIHJ1bm5pbmcgY29uY3VycmVudGx5XG4gICAgICBjb25zdCB7c2Vzc2lvbklkOm1qc29ud3BTZXNzSWQsIHZhbHVlOm1qc29ud3BWYWx1ZSwgc3RhdHVzfSA9IGF3YWl0IHJlcXVlc3QucG9zdCh7dXJsOiBiYXNlVXJsLCBqc29uOiBfLm9taXQoY29tYmluZWRDYXBzLCAnY2FwYWJpbGl0aWVzJyl9KTtcbiAgICAgIHN0YXR1cy5zaG91bGQuZXhpc3Q7XG4gICAgICBtanNvbndwVmFsdWUuc2hvdWxkLmVxbChjYXBzKTtcbiAgICAgIG1qc29ud3BTZXNzSWQuc2hvdWxkLmV4aXN0O1xuXG4gICAgICBjb25zdCB7dmFsdWV9ID0gYXdhaXQgcmVxdWVzdC5wb3N0KHt1cmw6IGJhc2VVcmwsIGpzb246IF8ub21pdChjb21iaW5lZENhcHMsICdkZXNpcmVkQ2FwYWJpbGl0aWVzJyl9KTtcbiAgICAgIGNvbnN0IHczY1Nlc3NJZCA9IHZhbHVlLnNlc3Npb25JZDtcbiAgICAgIHczY1Nlc3NJZC5zaG91bGQuZXhpc3Q7XG4gICAgICB2YWx1ZS5jYXBhYmlsaXRpZXMuc2hvdWxkLmVxbChjYXBzKTtcblxuICAgICAgLy8gVGVzdCB0aGF0IGJvdGggcmV0dXJuIHRoZSBwcm9wZXIgcGF5bG9hZCBiYXNlZCBvbiB0aGVpciBwcm90b2NvbFxuICAgICAgY29uc3QgbWpzb253cFBheWxvYWQgPSBhd2FpdCByZXF1ZXN0KGAke2Jhc2VVcmx9LyR7bWpzb253cFNlc3NJZH1gLCB7anNvbjogdHJ1ZX0pO1xuICAgICAgbWpzb253cFBheWxvYWQuc2Vzc2lvbklkLnNob3VsZC5leGlzdDtcbiAgICAgIG1qc29ud3BQYXlsb2FkLnN0YXR1cy5zaG91bGQuZXhpc3Q7XG4gICAgICBtanNvbndwUGF5bG9hZC52YWx1ZS5zaG91bGQuZXFsKGNhcHMpO1xuXG4gICAgICBjb25zdCB3M2NQYXlsb2FkID0gYXdhaXQgcmVxdWVzdChgJHtiYXNlVXJsfS8ke3czY1Nlc3NJZH1gLCB7anNvbjogdHJ1ZX0pO1xuICAgICAgc2hvdWxkLm5vdC5leGlzdCh3M2NQYXlsb2FkLnNlc3Npb25JZCk7XG4gICAgICBzaG91bGQubm90LmV4aXN0KHczY1BheWxvYWQuc3RhdHVzKTtcbiAgICAgIHczY1BheWxvYWQudmFsdWUuc2hvdWxkLmVxbChjYXBzKTtcblxuICAgICAgLy8gRW5kIHNlc3Npb25zXG4gICAgICBhd2FpdCByZXF1ZXN0LmRlbGV0ZSh7dXJsOiBgJHtiYXNlVXJsfS8ke21qc29ud3BTZXNzSWR9YH0pO1xuICAgICAgYXdhaXQgcmVxdWVzdC5kZWxldGUoe3VybDogYCR7YmFzZVVybH0vJHt3M2NTZXNzSWR9YH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnTG9nc2luaycsIGZ1bmN0aW9uICgpIHtcbiAgbGV0IHNlcnZlciA9IG51bGw7XG4gIGxldCBsb2dzID0gW107XG4gIGxldCBsb2dIYW5kbGVyID0gZnVuY3Rpb24gKGxldmVsLCBtZXNzYWdlKSB7XG4gICAgbG9ncy5wdXNoKFtsZXZlbCwgbWVzc2FnZV0pO1xuICB9O1xuICBsZXQgYXJncyA9IHtcbiAgICBwb3J0OiBURVNUX1BPUlQsXG4gICAgaG9zdDogVEVTVF9IT1NULFxuICAgIGxvZ0hhbmRsZXIsXG4gIH07XG5cbiAgYmVmb3JlKGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICBzZXJ2ZXIgPSBhd2FpdCBhcHBpdW1TZXJ2ZXIoYXJncyk7XG4gIH0pO1xuXG4gIGFmdGVyKGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICBhd2FpdCBzZXJ2ZXIuY2xvc2UoKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBzZW5kIGxvZ3MgdG8gYSBsb2dIYW5kbGVyIHBhc3NlZCBpbiBieSBhIHBhcmVudCBwYWNrYWdlJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIGxvZ3MubGVuZ3RoLnNob3VsZC5iZS5hYm92ZSgxKTtcbiAgICBsZXQgd2VsY29tZUluZGV4ID0gbG9nc1swXVsxXS5pbmNsdWRlcygndmVyc2lvbnMgb2Ygbm9kZScpID8gMSA6IDA7XG4gICAgbG9nc1t3ZWxjb21lSW5kZXhdLmxlbmd0aC5zaG91bGQuZXF1YWwoMik7XG4gICAgbG9nc1t3ZWxjb21lSW5kZXhdWzFdLnNob3VsZC5pbmNsdWRlKCdXZWxjb21lIHRvIEFwcGl1bScpO1xuICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLiJ9
