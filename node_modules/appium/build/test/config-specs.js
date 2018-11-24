require('source-map-support').install();

'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _libConfig = require('../lib/config');

var _libParser = require('../lib/parser');

var _libParser2 = _interopRequireDefault(_libParser);

var _libLogger = require('../lib/logger');

var _libLogger2 = _interopRequireDefault(_libLogger);

var _appiumSupport = require('appium-support');

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var should = _chai2['default'].should();
_chai2['default'].use(_chaiAsPromised2['default']);

describe('Config', function () {
  describe('getGitRev', function () {
    it('should get a reasonable git revision', function callee$2$0() {
      var rev;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap((0, _libConfig.getGitRev)());

          case 2:
            rev = context$3$0.sent;

            rev.should.be.a('string');
            rev.length.should.be.equal(40);
            rev.match(/[0-9a-f]+/i)[0].should.eql(rev);

          case 6:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });
  });

  describe('Appium config', function () {
    describe('getBuildInfo', function () {
      function verifyBuildInfoUpdate(useLocalGit) {
        var buildInfo;
        return _regeneratorRuntime.async(function verifyBuildInfoUpdate$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap((0, _libConfig.getBuildInfo)());

            case 2:
              buildInfo = context$4$0.sent;

              mockFs.expects('exists').atLeast(1).returns(useLocalGit);
              buildInfo['git-sha'] = undefined;
              buildInfo.built = undefined;
              context$4$0.next = 8;
              return _regeneratorRuntime.awrap((0, _libConfig.updateBuildInfo)());

            case 8:
              buildInfo.should.be.an('object');
              should.exist(buildInfo['git-sha']);
              should.exist(buildInfo.built);
              should.exist(buildInfo.version);

            case 12:
            case 'end':
              return context$4$0.stop();
          }
        }, null, this);
      }

      var mockFs = undefined;
      var getStub = undefined;
      beforeEach(function () {
        mockFs = _sinon2['default'].mock(_appiumSupport.fs);
        getStub = _sinon2['default'].stub(_requestPromise2['default'], 'get');
      });
      afterEach(function () {
        getStub.restore();
        mockFs.restore();
      });

      it('should get a configuration object if the local git metadata is present', function callee$3$0() {
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap(verifyBuildInfoUpdate(true));

            case 2:
            case 'end':
              return context$4$0.stop();
          }
        }, null, this);
      });
      it('should get a configuration object if the local git metadata is not present', function callee$3$0() {
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              getStub.onCall(0).returns([{
                "name": 'v' + _libConfig.APPIUM_VER,
                "zipball_url": "https://api.github.com/repos/appium/appium/zipball/v1.9.0-beta.1",
                "tarball_url": "https://api.github.com/repos/appium/appium/tarball/v1.9.0-beta.1",
                "commit": {
                  "sha": "3c2752f9f9c56000705a4ae15b3ba68a5d2e644c",
                  "url": "https://api.github.com/repos/appium/appium/commits/3c2752f9f9c56000705a4ae15b3ba68a5d2e644c"
                },
                "node_id": "MDM6UmVmNzUzMDU3MDp2MS45LjAtYmV0YS4x"
              }, {
                "name": "v1.8.2-beta",
                "zipball_url": "https://api.github.com/repos/appium/appium/zipball/v1.8.2-beta",
                "tarball_url": "https://api.github.com/repos/appium/appium/tarball/v1.8.2-beta",
                "commit": {
                  "sha": "5b98b9197e75aa85e7507d21d3126c1a63d1ce8f",
                  "url": "https://api.github.com/repos/appium/appium/commits/5b98b9197e75aa85e7507d21d3126c1a63d1ce8f"
                },
                "node_id": "MDM6UmVmNzUzMDU3MDp2MS44LjItYmV0YQ=="
              }]);
              getStub.onCall(1).returns({
                "sha": "3c2752f9f9c56000705a4ae15b3ba68a5d2e644c",
                "node_id": "MDY6Q29tbWl0NzUzMDU3MDozYzI3NTJmOWY5YzU2MDAwNzA1YTRhZTE1YjNiYTY4YTVkMmU2NDRj",
                "commit": {
                  "author": {
                    "name": "Isaac Murchie",
                    "email": "isaac@saucelabs.com",
                    "date": "2018-08-17T19:48:00Z"
                  },
                  "committer": {
                    "name": "Isaac Murchie",
                    "email": "isaac@saucelabs.com",
                    "date": "2018-08-17T19:48:00Z"
                  },
                  "message": "v1.9.0-beta.1",
                  "tree": {
                    "sha": "2c0974727470eba419ea0b9951c52f72f8036b18",
                    "url": "https://api.github.com/repos/appium/appium/git/trees/2c0974727470eba419ea0b9951c52f72f8036b18"
                  },
                  "url": "https://api.github.com/repos/appium/appium/git/commits/3c2752f9f9c56000705a4ae15b3ba68a5d2e644c",
                  "comment_count": 0,
                  "verification": {
                    "verified": false,
                    "reason": "unsigned",
                    "signature": null,
                    "payload": null
                  }
                },
                "url": "https://api.github.com/repos/appium/appium/commits/3c2752f9f9c56000705a4ae15b3ba68a5d2e644c",
                "html_url": "https://github.com/appium/appium/commit/3c2752f9f9c56000705a4ae15b3ba68a5d2e644c",
                "comments_url": "https://api.github.com/repos/appium/appium/commits/3c2752f9f9c56000705a4ae15b3ba68a5d2e644c/comments"
              });
              context$4$0.next = 4;
              return _regeneratorRuntime.awrap(verifyBuildInfoUpdate(false));

            case 4:
            case 'end':
              return context$4$0.stop();
          }
        }, null, this);
      });
    });
    describe('showConfig', function () {
      before(function () {
        _sinon2['default'].spy(console, "log");
      });
      it('should log the config to console', function callee$3$0() {
        var config;
        return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:
              context$4$0.next = 2;
              return _regeneratorRuntime.awrap((0, _libConfig.getBuildInfo)());

            case 2:
              config = context$4$0.sent;
              context$4$0.next = 5;
              return _regeneratorRuntime.awrap((0, _libConfig.showConfig)());

            case 5:
              console.log.calledOnce.should.be['true']; // eslint-disable-line no-console
              console.log.getCall(0).args[0].should.contain(JSON.stringify(config)); // eslint-disable-line no-console

            case 7:
            case 'end':
              return context$4$0.stop();
          }
        }, null, this);
      });
    });
  });

  describe('node.js config', function () {
    var _process = process;
    before(function () {
      // need to be able to write to process.version
      // but also to have access to process methods
      // so copy them over to a writable object
      var tempProcess = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(_lodash2['default'].toPairs(process)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2);

          var prop = _step$value[0];
          var value = _step$value[1];

          tempProcess[prop] = value;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      process = tempProcess;
    });
    after(function () {
      process = _process;
    });
    describe('checkNodeOk', function () {
      it('should fail if node is below 6', function () {
        process.version = 'v4.4.7';
        _libConfig.checkNodeOk.should['throw']();
        process.version = 'v0.9.12';
        _libConfig.checkNodeOk.should['throw']();
        process.version = 'v0.1';
        _libConfig.checkNodeOk.should['throw']();
        process.version = 'v0.10.36';
        _libConfig.checkNodeOk.should['throw']();
        process.version = 'v0.12.14';
        _libConfig.checkNodeOk.should['throw']();
        process.version = 'v5.7.0';
        _libConfig.checkNodeOk.should['throw']();
      });
      it('should succeed if node is 6+', function () {
        process.version = 'v6.3.1';
        _libConfig.checkNodeOk.should.not['throw']();
      });
      it('should succeed if node is 7+', function () {
        process.version = 'v7.1.1';
        _libConfig.checkNodeOk.should.not['throw']();
      });
      it('should succeed if node is 8+', function () {
        process.version = 'v8.1.2';
        _libConfig.checkNodeOk.should.not['throw']();
      });
      it('should succeed if node is 9+', function () {
        process.version = 'v9.1.2';
        _libConfig.checkNodeOk.should.not['throw']();
      });
    });

    describe('warnNodeDeprecations', function () {
      var spy = undefined;
      before(function () {
        spy = _sinon2['default'].spy(_libLogger2['default'], "warn");
      });
      beforeEach(function () {
        spy.resetHistory();
      });
      it('should log a warning if node is below 8', function () {
        process.version = 'v7.10.1';
        (0, _libConfig.warnNodeDeprecations)();
        _libLogger2['default'].warn.callCount.should.equal(1);
      });
      it('should not log a warning if node is 8+', function () {
        process.version = 'v8.0.0';
        (0, _libConfig.warnNodeDeprecations)();
        _libLogger2['default'].warn.callCount.should.equal(0);
      });
      it('should not log a warning if node is 9+', function () {
        process.version = 'v9.0.0';
        (0, _libConfig.warnNodeDeprecations)();
        _libLogger2['default'].warn.callCount.should.equal(0);
      });
    });
  });

  describe('server arguments', function () {
    var parser = (0, _libParser2['default'])();
    parser.debug = true; // throw instead of exit on error; pass as option instead?
    var args = {};
    beforeEach(function () {
      // give all the defaults
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _getIterator(parser.rawArgs), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var rawArg = _step2.value;

          args[rawArg[1].dest] = rawArg[1].defaultValue;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    });
    describe('getNonDefaultArgs', function () {
      it('should show none if we have all the defaults', function () {
        var nonDefaultArgs = (0, _libConfig.getNonDefaultArgs)(parser, args);
        _lodash2['default'].keys(nonDefaultArgs).length.should.equal(0);
      });
      it('should catch a non-default argument', function () {
        args.isolateSimDevice = true;
        var nonDefaultArgs = (0, _libConfig.getNonDefaultArgs)(parser, args);
        _lodash2['default'].keys(nonDefaultArgs).length.should.equal(1);
        should.exist(nonDefaultArgs.isolateSimDevice);
      });
    });

    describe('getDeprecatedArgs', function () {
      it('should show none if we have no deprecated arguments', function () {
        var deprecatedArgs = (0, _libConfig.getDeprecatedArgs)(parser, args);
        _lodash2['default'].keys(deprecatedArgs).length.should.equal(0);
      });
      it('should catch a deprecated argument', function () {
        args.showIOSLog = true;
        var deprecatedArgs = (0, _libConfig.getDeprecatedArgs)(parser, args);
        _lodash2['default'].keys(deprecatedArgs).length.should.equal(1);
        should.exist(deprecatedArgs['--show-ios-log']);
      });
      it('should catch a non-boolean deprecated argument', function () {
        args.calendarFormat = 'orwellian';
        var deprecatedArgs = (0, _libConfig.getDeprecatedArgs)(parser, args);
        _lodash2['default'].keys(deprecatedArgs).length.should.equal(1);
        should.exist(deprecatedArgs['--calendar-format']);
      });
    });
  });

  describe('checkValidPort', function () {
    it('should be false for port too high', function () {
      (0, _libConfig.checkValidPort)(65536).should.be['false'];
    });
    it('should be false for port too low', function () {
      (0, _libConfig.checkValidPort)(0).should.be['false'];
    });
    it('should be true for port 1', function () {
      (0, _libConfig.checkValidPort)(1).should.be['true'];
    });
    it('should be true for port 65535', function () {
      (0, _libConfig.checkValidPort)(65535).should.be['true'];
    });
  });

  describe('validateTmpDir', function () {
    it('should fail to use a tmp dir with incorrect permissions', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            (0, _libConfig.validateTmpDir)('/private/if_you_run_with_sudo_this_wont_fail').should.be.rejectedWith(/could not ensure/);

          case 1:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });
    it('should fail to use an undefined tmp dir', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            (0, _libConfig.validateTmpDir)().should.be.rejectedWith(/could not ensure/);

          case 1:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });
    it('should be able to use a tmp dir with correct permissions', function callee$2$0() {
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            (0, _libConfig.validateTmpDir)('/tmp/test_tmp_dir/with/any/number/of/levels').should.not.be.rejected;

          case 1:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });
  });

  describe('parsing args with empty argv[1]', function () {
    var argv1 = undefined;

    before(function () {
      argv1 = process.argv[1];
    });

    after(function () {
      process.argv[1] = argv1;
    });

    it('should not fail if process.argv[1] is undefined', function () {
      process.argv[1] = undefined;
      var args = (0, _libParser2['default'])();
      args.prog.should.be.equal('Appium');
    });

    it('should set "prog" to process.argv[1]', function () {
      process.argv[1] = 'Hello World';
      var args = (0, _libParser2['default'])();
      args.prog.should.be.equal('Hello World');
    });
  });

  describe('validateServerArgs', function () {
    var parser = (0, _libParser2['default'])();
    parser.debug = true; // throw instead of exit on error; pass as option instead?
    var defaultArgs = {};
    // give all the defaults
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = _getIterator(parser.rawArgs), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var rawArg = _step3.value;

        defaultArgs[rawArg[1].dest] = rawArg[1].defaultValue;
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
          _iterator3['return']();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    var args = {};
    beforeEach(function () {
      args = _lodash2['default'].clone(defaultArgs);
    });
    describe('mutually exclusive server arguments', function () {
      describe('noReset and fullReset', function () {
        it('should not allow both', function () {
          (function () {
            args.noReset = args.fullReset = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should allow noReset', function () {
          (function () {
            args.noReset = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
        it('should allow fullReset', function () {
          (function () {
            args.fullReset = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
      describe('ipa and safari', function () {
        it('should not allow both', function () {
          (function () {
            args.ipa = args.safari = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should allow ipa', function () {
          (function () {
            args.ipa = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
        it('should allow safari', function () {
          (function () {
            args.safari = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
      describe('app and safari', function () {
        it('should not allow both', function () {
          (function () {
            args.app = args.safari = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should allow app', function () {
          (function () {
            args.app = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
      describe('forceIphone and forceIpad', function () {
        it('should not allow both', function () {
          (function () {
            args.forceIphone = args.forceIpad = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should allow forceIphone', function () {
          (function () {
            args.forceIphone = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
        it('should allow forceIpad', function () {
          (function () {
            args.forceIpad = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
      describe('deviceName and defaultDevice', function () {
        it('should not allow both', function () {
          (function () {
            args.deviceName = args.defaultDevice = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should allow deviceName', function () {
          (function () {
            args.deviceName = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
        it('should allow defaultDevice', function () {
          (function () {
            args.defaultDevice = true;
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
    });
    describe('validated arguments', function () {
      // checking ports is already done.
      // the only argument left is `backendRetries`
      describe('backendRetries', function () {
        it('should fail with value less than 0', function () {
          args.backendRetries = -1;
          (function () {
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should['throw']();
        });
        it('should succeed with value of 0', function () {
          args.backendRetries = 0;
          (function () {
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
        it('should succeed with value above 0', function () {
          args.backendRetries = 100;
          (function () {
            (0, _libConfig.validateServerArgs)(parser, args);
          }).should.not['throw']();
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,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QU0sQ0FBQyxHQUFHLFNBQU0sRUFBRSxDQUFDO1NBQ3ZCLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztBQUNILFlBQVEsQ0FBQyxxQkFBcUIsRUFBRSxZQUFZOzs7QUFHMUMsY0FBUSxDQUFDLGdCQUFnQixFQUFFLFlBQVk7QUFDckMsVUFBRSxDQUFDLG9DQUFvQyxFQUFFLFlBQVk7QUFDbkQsY0FBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN6QixXQUFDLFlBQU07QUFBQywrQ0FBbUIsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1dBQUMsQ0FBQSxDQUFFLE1BQU0sU0FBTSxFQUFFLENBQUM7U0FDNUQsQ0FBQyxDQUFDO0FBQ0gsVUFBRSxDQUFDLGdDQUFnQyxFQUFFLFlBQVk7QUFDL0MsY0FBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7QUFDeEIsV0FBQyxZQUFNO0FBQUMsK0NBQW1CLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztXQUFDLENBQUEsQ0FBRSxNQUFNLENBQUMsR0FBRyxTQUFNLEVBQUUsQ0FBQztTQUNoRSxDQUFDLENBQUM7QUFDSCxVQUFFLENBQUMsbUNBQW1DLEVBQUUsWUFBWTtBQUNsRCxjQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztBQUMxQixXQUFDLFlBQU07QUFBQywrQ0FBbUIsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1dBQUMsQ0FBQSxDQUFFLE1BQU0sQ0FBQyxHQUFHLFNBQU0sRUFBRSxDQUFDO1NBQ2hFLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiJ0ZXN0L2NvbmZpZy1zcGVjcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHRyYW5zcGlsZTptb2NoYVxuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGNoYWkgZnJvbSAnY2hhaSc7XG5pbXBvcnQgc2lub24gZnJvbSAnc2lub24nO1xuaW1wb3J0IGNoYWlBc1Byb21pc2VkIGZyb20gJ2NoYWktYXMtcHJvbWlzZWQnO1xuaW1wb3J0IHsgZ2V0R2l0UmV2LCBnZXRCdWlsZEluZm8sIGNoZWNrTm9kZU9rLCB3YXJuTm9kZURlcHJlY2F0aW9ucyxcbiAgICAgICAgIGdldE5vbkRlZmF1bHRBcmdzLCBnZXREZXByZWNhdGVkQXJncywgdmFsaWRhdGVTZXJ2ZXJBcmdzLFxuICAgICAgICAgdmFsaWRhdGVUbXBEaXIsIHNob3dDb25maWcsIGNoZWNrVmFsaWRQb3J0LCB1cGRhdGVCdWlsZEluZm8sXG4gICAgICAgICBBUFBJVU1fVkVSIH0gZnJvbSAnLi4vbGliL2NvbmZpZyc7XG5pbXBvcnQgZ2V0UGFyc2VyIGZyb20gJy4uL2xpYi9wYXJzZXInO1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuLi9saWIvbG9nZ2VyJztcbmltcG9ydCB7IGZzIH0gZnJvbSAnYXBwaXVtLXN1cHBvcnQnO1xuaW1wb3J0IHJlcXVlc3QgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcblxubGV0IHNob3VsZCA9IGNoYWkuc2hvdWxkKCk7XG5jaGFpLnVzZShjaGFpQXNQcm9taXNlZCk7XG5cblxuZGVzY3JpYmUoJ0NvbmZpZycsIGZ1bmN0aW9uICgpIHtcbiAgZGVzY3JpYmUoJ2dldEdpdFJldicsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIGdldCBhIHJlYXNvbmFibGUgZ2l0IHJldmlzaW9uJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IHJldiA9IGF3YWl0IGdldEdpdFJldigpO1xuICAgICAgcmV2LnNob3VsZC5iZS5hKCdzdHJpbmcnKTtcbiAgICAgIHJldi5sZW5ndGguc2hvdWxkLmJlLmVxdWFsKDQwKTtcbiAgICAgIHJldi5tYXRjaCgvWzAtOWEtZl0rL2kpWzBdLnNob3VsZC5lcWwocmV2KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0FwcGl1bSBjb25maWcnLCBmdW5jdGlvbiAoKSB7XG4gICAgZGVzY3JpYmUoJ2dldEJ1aWxkSW5mbycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHZlcmlmeUJ1aWxkSW5mb1VwZGF0ZSAodXNlTG9jYWxHaXQpIHtcbiAgICAgICAgY29uc3QgYnVpbGRJbmZvID0gYXdhaXQgZ2V0QnVpbGRJbmZvKCk7XG4gICAgICAgIG1vY2tGcy5leHBlY3RzKCdleGlzdHMnKS5hdExlYXN0KDEpLnJldHVybnModXNlTG9jYWxHaXQpO1xuICAgICAgICBidWlsZEluZm9bJ2dpdC1zaGEnXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgYnVpbGRJbmZvLmJ1aWx0ID0gdW5kZWZpbmVkO1xuICAgICAgICBhd2FpdCB1cGRhdGVCdWlsZEluZm8oKTtcbiAgICAgICAgYnVpbGRJbmZvLnNob3VsZC5iZS5hbignb2JqZWN0Jyk7XG4gICAgICAgIHNob3VsZC5leGlzdChidWlsZEluZm9bJ2dpdC1zaGEnXSk7XG4gICAgICAgIHNob3VsZC5leGlzdChidWlsZEluZm8uYnVpbHQpO1xuICAgICAgICBzaG91bGQuZXhpc3QoYnVpbGRJbmZvLnZlcnNpb24pO1xuICAgICAgfVxuXG4gICAgICBsZXQgbW9ja0ZzO1xuICAgICAgbGV0IGdldFN0dWI7XG4gICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbW9ja0ZzID0gc2lub24ubW9jayhmcyk7XG4gICAgICAgIGdldFN0dWIgPSBzaW5vbi5zdHViKHJlcXVlc3QsICdnZXQnKTtcbiAgICAgIH0pO1xuICAgICAgYWZ0ZXJFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZ2V0U3R1Yi5yZXN0b3JlKCk7XG4gICAgICAgIG1vY2tGcy5yZXN0b3JlKCk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBnZXQgYSBjb25maWd1cmF0aW9uIG9iamVjdCBpZiB0aGUgbG9jYWwgZ2l0IG1ldGFkYXRhIGlzIHByZXNlbnQnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGF3YWl0IHZlcmlmeUJ1aWxkSW5mb1VwZGF0ZSh0cnVlKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCBnZXQgYSBjb25maWd1cmF0aW9uIG9iamVjdCBpZiB0aGUgbG9jYWwgZ2l0IG1ldGFkYXRhIGlzIG5vdCBwcmVzZW50JywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICBnZXRTdHViLm9uQ2FsbCgwKS5yZXR1cm5zKFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm5hbWVcIjogYHYke0FQUElVTV9WRVJ9YCxcbiAgICAgICAgICAgIFwiemlwYmFsbF91cmxcIjogXCJodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL2FwcGl1bS9hcHBpdW0vemlwYmFsbC92MS45LjAtYmV0YS4xXCIsXG4gICAgICAgICAgICBcInRhcmJhbGxfdXJsXCI6IFwiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9hcHBpdW0vYXBwaXVtL3RhcmJhbGwvdjEuOS4wLWJldGEuMVwiLFxuICAgICAgICAgICAgXCJjb21taXRcIjoge1xuICAgICAgICAgICAgICBcInNoYVwiOiBcIjNjMjc1MmY5ZjljNTYwMDA3MDVhNGFlMTViM2JhNjhhNWQyZTY0NGNcIixcbiAgICAgICAgICAgICAgXCJ1cmxcIjogXCJodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL2FwcGl1bS9hcHBpdW0vY29tbWl0cy8zYzI3NTJmOWY5YzU2MDAwNzA1YTRhZTE1YjNiYTY4YTVkMmU2NDRjXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIm5vZGVfaWRcIjogXCJNRE02VW1WbU56VXpNRFUzTURwMk1TNDVMakF0WW1WMFlTNHhcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwidjEuOC4yLWJldGFcIixcbiAgICAgICAgICAgIFwiemlwYmFsbF91cmxcIjogXCJodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL2FwcGl1bS9hcHBpdW0vemlwYmFsbC92MS44LjItYmV0YVwiLFxuICAgICAgICAgICAgXCJ0YXJiYWxsX3VybFwiOiBcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvYXBwaXVtL2FwcGl1bS90YXJiYWxsL3YxLjguMi1iZXRhXCIsXG4gICAgICAgICAgICBcImNvbW1pdFwiOiB7XG4gICAgICAgICAgICAgIFwic2hhXCI6IFwiNWI5OGI5MTk3ZTc1YWE4NWU3NTA3ZDIxZDMxMjZjMWE2M2QxY2U4ZlwiLFxuICAgICAgICAgICAgICBcInVybFwiOiBcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvYXBwaXVtL2FwcGl1bS9jb21taXRzLzViOThiOTE5N2U3NWFhODVlNzUwN2QyMWQzMTI2YzFhNjNkMWNlOGZcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwibm9kZV9pZFwiOiBcIk1ETTZVbVZtTnpVek1EVTNNRHAyTVM0NExqSXRZbVYwWVE9PVwiXG4gICAgICAgICAgfVxuICAgICAgICBdKTtcbiAgICAgICAgZ2V0U3R1Yi5vbkNhbGwoMSkucmV0dXJucyh7XG4gICAgICAgICAgXCJzaGFcIjogXCIzYzI3NTJmOWY5YzU2MDAwNzA1YTRhZTE1YjNiYTY4YTVkMmU2NDRjXCIsXG4gICAgICAgICAgXCJub2RlX2lkXCI6IFwiTURZNlEyOXRiV2wwTnpVek1EVTNNRG96WXpJM05USm1PV1k1WXpVMk1EQXdOekExWVRSaFpURTFZak5pWVRZNFlUVmtNbVUyTkRSalwiLFxuICAgICAgICAgIFwiY29tbWl0XCI6IHtcbiAgICAgICAgICAgIFwiYXV0aG9yXCI6IHtcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiSXNhYWMgTXVyY2hpZVwiLFxuICAgICAgICAgICAgICBcImVtYWlsXCI6IFwiaXNhYWNAc2F1Y2VsYWJzLmNvbVwiLFxuICAgICAgICAgICAgICBcImRhdGVcIjogXCIyMDE4LTA4LTE3VDE5OjQ4OjAwWlwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJjb21taXR0ZXJcIjoge1xuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJJc2FhYyBNdXJjaGllXCIsXG4gICAgICAgICAgICAgIFwiZW1haWxcIjogXCJpc2FhY0BzYXVjZWxhYnMuY29tXCIsXG4gICAgICAgICAgICAgIFwiZGF0ZVwiOiBcIjIwMTgtMDgtMTdUMTk6NDg6MDBaXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIm1lc3NhZ2VcIjogXCJ2MS45LjAtYmV0YS4xXCIsXG4gICAgICAgICAgICBcInRyZWVcIjoge1xuICAgICAgICAgICAgICBcInNoYVwiOiBcIjJjMDk3NDcyNzQ3MGViYTQxOWVhMGI5OTUxYzUyZjcyZjgwMzZiMThcIixcbiAgICAgICAgICAgICAgXCJ1cmxcIjogXCJodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL2FwcGl1bS9hcHBpdW0vZ2l0L3RyZWVzLzJjMDk3NDcyNzQ3MGViYTQxOWVhMGI5OTUxYzUyZjcyZjgwMzZiMThcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9hcHBpdW0vYXBwaXVtL2dpdC9jb21taXRzLzNjMjc1MmY5ZjljNTYwMDA3MDVhNGFlMTViM2JhNjhhNWQyZTY0NGNcIixcbiAgICAgICAgICAgIFwiY29tbWVudF9jb3VudFwiOiAwLFxuICAgICAgICAgICAgXCJ2ZXJpZmljYXRpb25cIjoge1xuICAgICAgICAgICAgICBcInZlcmlmaWVkXCI6IGZhbHNlLFxuICAgICAgICAgICAgICBcInJlYXNvblwiOiBcInVuc2lnbmVkXCIsXG4gICAgICAgICAgICAgIFwic2lnbmF0dXJlXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwicGF5bG9hZFwiOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVybFwiOiBcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvYXBwaXVtL2FwcGl1bS9jb21taXRzLzNjMjc1MmY5ZjljNTYwMDA3MDVhNGFlMTViM2JhNjhhNWQyZTY0NGNcIixcbiAgICAgICAgICBcImh0bWxfdXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2FwcGl1bS9hcHBpdW0vY29tbWl0LzNjMjc1MmY5ZjljNTYwMDA3MDVhNGFlMTViM2JhNjhhNWQyZTY0NGNcIixcbiAgICAgICAgICBcImNvbW1lbnRzX3VybFwiOiBcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvYXBwaXVtL2FwcGl1bS9jb21taXRzLzNjMjc1MmY5ZjljNTYwMDA3MDVhNGFlMTViM2JhNjhhNWQyZTY0NGMvY29tbWVudHNcIixcbiAgICAgICAgfSk7XG4gICAgICAgIGF3YWl0IHZlcmlmeUJ1aWxkSW5mb1VwZGF0ZShmYWxzZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBkZXNjcmliZSgnc2hvd0NvbmZpZycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGJlZm9yZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNpbm9uLnNweShjb25zb2xlLCBcImxvZ1wiKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCBsb2cgdGhlIGNvbmZpZyB0byBjb25zb2xlJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBjb25maWcgPSBhd2FpdCBnZXRCdWlsZEluZm8oKTtcbiAgICAgICAgYXdhaXQgc2hvd0NvbmZpZygpO1xuICAgICAgICBjb25zb2xlLmxvZy5jYWxsZWRPbmNlLnNob3VsZC5iZS50cnVlOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgIGNvbnNvbGUubG9nLmdldENhbGwoMCkuYXJnc1swXS5zaG91bGQuY29udGFpbihKU09OLnN0cmluZ2lmeShjb25maWcpKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ25vZGUuanMgY29uZmlnJywgZnVuY3Rpb24gKCkge1xuICAgIGxldCBfcHJvY2VzcyA9IHByb2Nlc3M7XG4gICAgYmVmb3JlKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIG5lZWQgdG8gYmUgYWJsZSB0byB3cml0ZSB0byBwcm9jZXNzLnZlcnNpb25cbiAgICAgIC8vIGJ1dCBhbHNvIHRvIGhhdmUgYWNjZXNzIHRvIHByb2Nlc3MgbWV0aG9kc1xuICAgICAgLy8gc28gY29weSB0aGVtIG92ZXIgdG8gYSB3cml0YWJsZSBvYmplY3RcbiAgICAgIGxldCB0ZW1wUHJvY2VzcyA9IHt9O1xuICAgICAgZm9yIChsZXQgW3Byb3AsIHZhbHVlXSBvZiBfLnRvUGFpcnMocHJvY2VzcykpIHtcbiAgICAgICAgdGVtcFByb2Nlc3NbcHJvcF0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIHByb2Nlc3MgPSB0ZW1wUHJvY2VzcztcbiAgICB9KTtcbiAgICBhZnRlcihmdW5jdGlvbiAoKSB7XG4gICAgICBwcm9jZXNzID0gX3Byb2Nlc3M7XG4gICAgfSk7XG4gICAgZGVzY3JpYmUoJ2NoZWNrTm9kZU9rJywgZnVuY3Rpb24gKCkge1xuICAgICAgaXQoJ3Nob3VsZCBmYWlsIGlmIG5vZGUgaXMgYmVsb3cgNicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcHJvY2Vzcy52ZXJzaW9uID0gJ3Y0LjQuNyc7XG4gICAgICAgIGNoZWNrTm9kZU9rLnNob3VsZC50aHJvdygpO1xuICAgICAgICBwcm9jZXNzLnZlcnNpb24gPSAndjAuOS4xMic7XG4gICAgICAgIGNoZWNrTm9kZU9rLnNob3VsZC50aHJvdygpO1xuICAgICAgICBwcm9jZXNzLnZlcnNpb24gPSAndjAuMSc7XG4gICAgICAgIGNoZWNrTm9kZU9rLnNob3VsZC50aHJvdygpO1xuICAgICAgICBwcm9jZXNzLnZlcnNpb24gPSAndjAuMTAuMzYnO1xuICAgICAgICBjaGVja05vZGVPay5zaG91bGQudGhyb3coKTtcbiAgICAgICAgcHJvY2Vzcy52ZXJzaW9uID0gJ3YwLjEyLjE0JztcbiAgICAgICAgY2hlY2tOb2RlT2suc2hvdWxkLnRocm93KCk7XG4gICAgICAgIHByb2Nlc3MudmVyc2lvbiA9ICd2NS43LjAnO1xuICAgICAgICBjaGVja05vZGVPay5zaG91bGQudGhyb3coKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCBzdWNjZWVkIGlmIG5vZGUgaXMgNisnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHByb2Nlc3MudmVyc2lvbiA9ICd2Ni4zLjEnO1xuICAgICAgICBjaGVja05vZGVPay5zaG91bGQubm90LnRocm93KCk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgc3VjY2VlZCBpZiBub2RlIGlzIDcrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBwcm9jZXNzLnZlcnNpb24gPSAndjcuMS4xJztcbiAgICAgICAgY2hlY2tOb2RlT2suc2hvdWxkLm5vdC50aHJvdygpO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIHN1Y2NlZWQgaWYgbm9kZSBpcyA4KycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcHJvY2Vzcy52ZXJzaW9uID0gJ3Y4LjEuMic7XG4gICAgICAgIGNoZWNrTm9kZU9rLnNob3VsZC5ub3QudGhyb3coKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCBzdWNjZWVkIGlmIG5vZGUgaXMgOSsnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHByb2Nlc3MudmVyc2lvbiA9ICd2OS4xLjInO1xuICAgICAgICBjaGVja05vZGVPay5zaG91bGQubm90LnRocm93KCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3YXJuTm9kZURlcHJlY2F0aW9ucycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBzcHk7XG4gICAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICBzcHkgPSBzaW5vbi5zcHkobG9nZ2VyLCBcIndhcm5cIik7XG4gICAgICB9KTtcbiAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBzcHkucmVzZXRIaXN0b3J5KCk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgbG9nIGEgd2FybmluZyBpZiBub2RlIGlzIGJlbG93IDgnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHByb2Nlc3MudmVyc2lvbiA9ICd2Ny4xMC4xJztcbiAgICAgICAgd2Fybk5vZGVEZXByZWNhdGlvbnMoKTtcbiAgICAgICAgbG9nZ2VyLndhcm4uY2FsbENvdW50LnNob3VsZC5lcXVhbCgxKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCBub3QgbG9nIGEgd2FybmluZyBpZiBub2RlIGlzIDgrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBwcm9jZXNzLnZlcnNpb24gPSAndjguMC4wJztcbiAgICAgICAgd2Fybk5vZGVEZXByZWNhdGlvbnMoKTtcbiAgICAgICAgbG9nZ2VyLndhcm4uY2FsbENvdW50LnNob3VsZC5lcXVhbCgwKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCBub3QgbG9nIGEgd2FybmluZyBpZiBub2RlIGlzIDkrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBwcm9jZXNzLnZlcnNpb24gPSAndjkuMC4wJztcbiAgICAgICAgd2Fybk5vZGVEZXByZWNhdGlvbnMoKTtcbiAgICAgICAgbG9nZ2VyLndhcm4uY2FsbENvdW50LnNob3VsZC5lcXVhbCgwKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnc2VydmVyIGFyZ3VtZW50cycsIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgcGFyc2VyID0gZ2V0UGFyc2VyKCk7XG4gICAgcGFyc2VyLmRlYnVnID0gdHJ1ZTsgLy8gdGhyb3cgaW5zdGVhZCBvZiBleGl0IG9uIGVycm9yOyBwYXNzIGFzIG9wdGlvbiBpbnN0ZWFkP1xuICAgIGxldCBhcmdzID0ge307XG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBnaXZlIGFsbCB0aGUgZGVmYXVsdHNcbiAgICAgIGZvciAobGV0IHJhd0FyZyBvZiBwYXJzZXIucmF3QXJncykge1xuICAgICAgICBhcmdzW3Jhd0FyZ1sxXS5kZXN0XSA9IHJhd0FyZ1sxXS5kZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZGVzY3JpYmUoJ2dldE5vbkRlZmF1bHRBcmdzJywgZnVuY3Rpb24gKCkge1xuICAgICAgaXQoJ3Nob3VsZCBzaG93IG5vbmUgaWYgd2UgaGF2ZSBhbGwgdGhlIGRlZmF1bHRzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgbm9uRGVmYXVsdEFyZ3MgPSBnZXROb25EZWZhdWx0QXJncyhwYXJzZXIsIGFyZ3MpO1xuICAgICAgICBfLmtleXMobm9uRGVmYXVsdEFyZ3MpLmxlbmd0aC5zaG91bGQuZXF1YWwoMCk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgY2F0Y2ggYSBub24tZGVmYXVsdCBhcmd1bWVudCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYXJncy5pc29sYXRlU2ltRGV2aWNlID0gdHJ1ZTtcbiAgICAgICAgbGV0IG5vbkRlZmF1bHRBcmdzID0gZ2V0Tm9uRGVmYXVsdEFyZ3MocGFyc2VyLCBhcmdzKTtcbiAgICAgICAgXy5rZXlzKG5vbkRlZmF1bHRBcmdzKS5sZW5ndGguc2hvdWxkLmVxdWFsKDEpO1xuICAgICAgICBzaG91bGQuZXhpc3Qobm9uRGVmYXVsdEFyZ3MuaXNvbGF0ZVNpbURldmljZSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdnZXREZXByZWNhdGVkQXJncycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGl0KCdzaG91bGQgc2hvdyBub25lIGlmIHdlIGhhdmUgbm8gZGVwcmVjYXRlZCBhcmd1bWVudHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBkZXByZWNhdGVkQXJncyA9IGdldERlcHJlY2F0ZWRBcmdzKHBhcnNlciwgYXJncyk7XG4gICAgICAgIF8ua2V5cyhkZXByZWNhdGVkQXJncykubGVuZ3RoLnNob3VsZC5lcXVhbCgwKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCBjYXRjaCBhIGRlcHJlY2F0ZWQgYXJndW1lbnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFyZ3Muc2hvd0lPU0xvZyA9IHRydWU7XG4gICAgICAgIGxldCBkZXByZWNhdGVkQXJncyA9IGdldERlcHJlY2F0ZWRBcmdzKHBhcnNlciwgYXJncyk7XG4gICAgICAgIF8ua2V5cyhkZXByZWNhdGVkQXJncykubGVuZ3RoLnNob3VsZC5lcXVhbCgxKTtcbiAgICAgICAgc2hvdWxkLmV4aXN0KGRlcHJlY2F0ZWRBcmdzWyctLXNob3ctaW9zLWxvZyddKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCBjYXRjaCBhIG5vbi1ib29sZWFuIGRlcHJlY2F0ZWQgYXJndW1lbnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFyZ3MuY2FsZW5kYXJGb3JtYXQgPSAnb3J3ZWxsaWFuJztcbiAgICAgICAgbGV0IGRlcHJlY2F0ZWRBcmdzID0gZ2V0RGVwcmVjYXRlZEFyZ3MocGFyc2VyLCBhcmdzKTtcbiAgICAgICAgXy5rZXlzKGRlcHJlY2F0ZWRBcmdzKS5sZW5ndGguc2hvdWxkLmVxdWFsKDEpO1xuICAgICAgICBzaG91bGQuZXhpc3QoZGVwcmVjYXRlZEFyZ3NbJy0tY2FsZW5kYXItZm9ybWF0J10pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdjaGVja1ZhbGlkUG9ydCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIGJlIGZhbHNlIGZvciBwb3J0IHRvbyBoaWdoJywgZnVuY3Rpb24gKCkge1xuICAgICAgY2hlY2tWYWxpZFBvcnQoNjU1MzYpLnNob3VsZC5iZS5mYWxzZTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIGJlIGZhbHNlIGZvciBwb3J0IHRvbyBsb3cnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjaGVja1ZhbGlkUG9ydCgwKS5zaG91bGQuYmUuZmFsc2U7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBiZSB0cnVlIGZvciBwb3J0IDEnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjaGVja1ZhbGlkUG9ydCgxKS5zaG91bGQuYmUudHJ1ZTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIGJlIHRydWUgZm9yIHBvcnQgNjU1MzUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjaGVja1ZhbGlkUG9ydCg2NTUzNSkuc2hvdWxkLmJlLnRydWU7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd2YWxpZGF0ZVRtcERpcicsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIGZhaWwgdG8gdXNlIGEgdG1wIGRpciB3aXRoIGluY29ycmVjdCBwZXJtaXNzaW9ucycsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhbGlkYXRlVG1wRGlyKCcvcHJpdmF0ZS9pZl95b3VfcnVuX3dpdGhfc3Vkb190aGlzX3dvbnRfZmFpbCcpLnNob3VsZC5iZS5yZWplY3RlZFdpdGgoL2NvdWxkIG5vdCBlbnN1cmUvKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIGZhaWwgdG8gdXNlIGFuIHVuZGVmaW5lZCB0bXAgZGlyJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgdmFsaWRhdGVUbXBEaXIoKS5zaG91bGQuYmUucmVqZWN0ZWRXaXRoKC9jb3VsZCBub3QgZW5zdXJlLyk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBiZSBhYmxlIHRvIHVzZSBhIHRtcCBkaXIgd2l0aCBjb3JyZWN0IHBlcm1pc3Npb25zJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgdmFsaWRhdGVUbXBEaXIoJy90bXAvdGVzdF90bXBfZGlyL3dpdGgvYW55L251bWJlci9vZi9sZXZlbHMnKS5zaG91bGQubm90LmJlLnJlamVjdGVkO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFyc2luZyBhcmdzIHdpdGggZW1wdHkgYXJndlsxXScsIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYXJndjE7XG5cbiAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICAgYXJndjEgPSBwcm9jZXNzLmFyZ3ZbMV07XG4gICAgfSk7XG5cbiAgICBhZnRlcihmdW5jdGlvbiAoKSB7XG4gICAgICBwcm9jZXNzLmFyZ3ZbMV0gPSBhcmd2MTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IGZhaWwgaWYgcHJvY2Vzcy5hcmd2WzFdIGlzIHVuZGVmaW5lZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHByb2Nlc3MuYXJndlsxXSA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCBhcmdzID0gZ2V0UGFyc2VyKCk7XG4gICAgICBhcmdzLnByb2cuc2hvdWxkLmJlLmVxdWFsKCdBcHBpdW0nKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2V0IFwicHJvZ1wiIHRvIHByb2Nlc3MuYXJndlsxXScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHByb2Nlc3MuYXJndlsxXSA9ICdIZWxsbyBXb3JsZCc7XG4gICAgICBsZXQgYXJncyA9IGdldFBhcnNlcigpO1xuICAgICAgYXJncy5wcm9nLnNob3VsZC5iZS5lcXVhbCgnSGVsbG8gV29ybGQnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3ZhbGlkYXRlU2VydmVyQXJncycsIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgcGFyc2VyID0gZ2V0UGFyc2VyKCk7XG4gICAgcGFyc2VyLmRlYnVnID0gdHJ1ZTsgLy8gdGhyb3cgaW5zdGVhZCBvZiBleGl0IG9uIGVycm9yOyBwYXNzIGFzIG9wdGlvbiBpbnN0ZWFkP1xuICAgIGNvbnN0IGRlZmF1bHRBcmdzID0ge307XG4gICAgLy8gZ2l2ZSBhbGwgdGhlIGRlZmF1bHRzXG4gICAgZm9yIChsZXQgcmF3QXJnIG9mIHBhcnNlci5yYXdBcmdzKSB7XG4gICAgICBkZWZhdWx0QXJnc1tyYXdBcmdbMV0uZGVzdF0gPSByYXdBcmdbMV0uZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICBsZXQgYXJncyA9IHt9O1xuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgYXJncyA9IF8uY2xvbmUoZGVmYXVsdEFyZ3MpO1xuICAgIH0pO1xuICAgIGRlc2NyaWJlKCdtdXR1YWxseSBleGNsdXNpdmUgc2VydmVyIGFyZ3VtZW50cycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGRlc2NyaWJlKCdub1Jlc2V0IGFuZCBmdWxsUmVzZXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGl0KCdzaG91bGQgbm90IGFsbG93IGJvdGgnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgKCgpID0+IHtcbiAgICAgICAgICAgIGFyZ3Mubm9SZXNldCA9IGFyZ3MuZnVsbFJlc2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xuICAgICAgICAgIH0pLnNob3VsZC50aHJvdygpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBub1Jlc2V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBhcmdzLm5vUmVzZXQgPSB0cnVlO1xuICAgICAgICAgICAgdmFsaWRhdGVTZXJ2ZXJBcmdzKHBhcnNlciwgYXJncyk7XG4gICAgICAgICAgfSkuc2hvdWxkLm5vdC50aHJvdygpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBmdWxsUmVzZXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgKCgpID0+IHtcbiAgICAgICAgICAgIGFyZ3MuZnVsbFJlc2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xuICAgICAgICAgIH0pLnNob3VsZC5ub3QudGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGRlc2NyaWJlKCdpcGEgYW5kIHNhZmFyaScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgYWxsb3cgYm90aCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAoKCkgPT4ge1xuICAgICAgICAgICAgYXJncy5pcGEgPSBhcmdzLnNhZmFyaSA9IHRydWU7XG4gICAgICAgICAgICB2YWxpZGF0ZVNlcnZlckFyZ3MocGFyc2VyLCBhcmdzKTtcbiAgICAgICAgICB9KS5zaG91bGQudGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgaXBhJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBhcmdzLmlwYSA9IHRydWU7XG4gICAgICAgICAgICB2YWxpZGF0ZVNlcnZlckFyZ3MocGFyc2VyLCBhcmdzKTtcbiAgICAgICAgICB9KS5zaG91bGQubm90LnRocm93KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IHNhZmFyaScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAoKCkgPT4ge1xuICAgICAgICAgICAgYXJncy5zYWZhcmkgPSB0cnVlO1xuICAgICAgICAgICAgdmFsaWRhdGVTZXJ2ZXJBcmdzKHBhcnNlciwgYXJncyk7XG4gICAgICAgICAgfSkuc2hvdWxkLm5vdC50aHJvdygpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZGVzY3JpYmUoJ2FwcCBhbmQgc2FmYXJpJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdCgnc2hvdWxkIG5vdCBhbGxvdyBib3RoJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBhcmdzLmFwcCA9IGFyZ3Muc2FmYXJpID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xuICAgICAgICAgIH0pLnNob3VsZC50aHJvdygpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBhcHAnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgKCgpID0+IHtcbiAgICAgICAgICAgIGFyZ3MuYXBwID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xuICAgICAgICAgIH0pLnNob3VsZC5ub3QudGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGRlc2NyaWJlKCdmb3JjZUlwaG9uZSBhbmQgZm9yY2VJcGFkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdCgnc2hvdWxkIG5vdCBhbGxvdyBib3RoJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBhcmdzLmZvcmNlSXBob25lID0gYXJncy5mb3JjZUlwYWQgPSB0cnVlO1xuICAgICAgICAgICAgdmFsaWRhdGVTZXJ2ZXJBcmdzKHBhcnNlciwgYXJncyk7XG4gICAgICAgICAgfSkuc2hvdWxkLnRocm93KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdCgnc2hvdWxkIGFsbG93IGZvcmNlSXBob25lJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBhcmdzLmZvcmNlSXBob25lID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xuICAgICAgICAgIH0pLnNob3VsZC5ub3QudGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdzaG91bGQgYWxsb3cgZm9yY2VJcGFkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBhcmdzLmZvcmNlSXBhZCA9IHRydWU7XG4gICAgICAgICAgICB2YWxpZGF0ZVNlcnZlckFyZ3MocGFyc2VyLCBhcmdzKTtcbiAgICAgICAgICB9KS5zaG91bGQubm90LnRocm93KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBkZXNjcmliZSgnZGV2aWNlTmFtZSBhbmQgZGVmYXVsdERldmljZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgYWxsb3cgYm90aCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAoKCkgPT4ge1xuICAgICAgICAgICAgYXJncy5kZXZpY2VOYW1lID0gYXJncy5kZWZhdWx0RGV2aWNlID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xuICAgICAgICAgIH0pLnNob3VsZC50aHJvdygpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBkZXZpY2VOYW1lJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBhcmdzLmRldmljZU5hbWUgPSB0cnVlO1xuICAgICAgICAgICAgdmFsaWRhdGVTZXJ2ZXJBcmdzKHBhcnNlciwgYXJncyk7XG4gICAgICAgICAgfSkuc2hvdWxkLm5vdC50aHJvdygpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBkZWZhdWx0RGV2aWNlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICBhcmdzLmRlZmF1bHREZXZpY2UgPSB0cnVlO1xuICAgICAgICAgICAgdmFsaWRhdGVTZXJ2ZXJBcmdzKHBhcnNlciwgYXJncyk7XG4gICAgICAgICAgfSkuc2hvdWxkLm5vdC50aHJvdygpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGRlc2NyaWJlKCd2YWxpZGF0ZWQgYXJndW1lbnRzJywgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gY2hlY2tpbmcgcG9ydHMgaXMgYWxyZWFkeSBkb25lLlxuICAgICAgLy8gdGhlIG9ubHkgYXJndW1lbnQgbGVmdCBpcyBgYmFja2VuZFJldHJpZXNgXG4gICAgICBkZXNjcmliZSgnYmFja2VuZFJldHJpZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGl0KCdzaG91bGQgZmFpbCB3aXRoIHZhbHVlIGxlc3MgdGhhbiAwJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGFyZ3MuYmFja2VuZFJldHJpZXMgPSAtMTtcbiAgICAgICAgICAoKCkgPT4ge3ZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO30pLnNob3VsZC50aHJvdygpO1xuICAgICAgICB9KTtcbiAgICAgICAgaXQoJ3Nob3VsZCBzdWNjZWVkIHdpdGggdmFsdWUgb2YgMCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBhcmdzLmJhY2tlbmRSZXRyaWVzID0gMDtcbiAgICAgICAgICAoKCkgPT4ge3ZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO30pLnNob3VsZC5ub3QudGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KCdzaG91bGQgc3VjY2VlZCB3aXRoIHZhbHVlIGFib3ZlIDAnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgYXJncy5iYWNrZW5kUmV0cmllcyA9IDEwMDtcbiAgICAgICAgICAoKCkgPT4ge3ZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO30pLnNob3VsZC5ub3QudGhyb3coKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiLi4vLi4ifQ==
