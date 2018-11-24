'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _config = require('./config');

var _appiumBaseDriver = require('appium-base-driver');

var _appiumFakeDriver = require('appium-fake-driver');

var _appiumAndroidDriver = require('appium-android-driver');

var _appiumIosDriver = require('appium-ios-driver');

var _appiumUiautomator2Driver = require('appium-uiautomator2-driver');

var _appiumSelendroidDriver = require('appium-selendroid-driver');

var _appiumXcuitestDriver = require('appium-xcuitest-driver');

var _appiumYouiengineDriver = require('appium-youiengine-driver');

var _appiumWindowsDriver = require('appium-windows-driver');

var _appiumMacDriver = require('appium-mac-driver');

var _appiumEspressoDriver = require('appium-espresso-driver');

var _appiumTizenDriver = require('appium-tizen-driver');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _asyncLock = require('async-lock');

var _asyncLock2 = _interopRequireDefault(_asyncLock);

var _utils = require('./utils');

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var AUTOMATION_NAMES = {
  APPIUM: 'Appium',
  SELENDROID: 'Selendroid',
  UIAUTOMATOR2: 'UiAutomator2',
  XCUITEST: 'XCUITest',
  YOUIENGINE: 'YouiEngine',
  ESPRESSO: 'Espresso',
  TIZEN: 'Tizen',
  FAKE: 'Fake'
};
var DRIVER_MAP = {
  SelendroidDriver: {
    driverClass: _appiumSelendroidDriver.SelendroidDriver,
    automationName: AUTOMATION_NAMES.SELENDROID,
    version: (0, _utils.getPackageVersion)('appium-selendroid-driver')
  },
  AndroidUiautomator2Driver: {
    driverClass: _appiumUiautomator2Driver.AndroidUiautomator2Driver,
    automationName: AUTOMATION_NAMES.UIAUTOMATOR2,
    version: (0, _utils.getPackageVersion)('appium-uiautomator2-driver')
  },
  XCUITestDriver: {
    driverClass: _appiumXcuitestDriver.XCUITestDriver,
    automationName: AUTOMATION_NAMES.XCUITEST,
    version: (0, _utils.getPackageVersion)('appium-xcuitest-driver')
  },
  YouiEngineDriver: {
    driverClass: _appiumYouiengineDriver.YouiEngineDriver,
    automationName: AUTOMATION_NAMES.YOUIENGINE,
    version: (0, _utils.getPackageVersion)('appium-youiengine-driver')
  },
  FakeDriver: {
    driverClass: _appiumFakeDriver.FakeDriver,
    version: (0, _utils.getPackageVersion)('appium-fake-driver')
  },
  AndroidDriver: {
    driverClass: _appiumAndroidDriver.AndroidDriver,
    version: (0, _utils.getPackageVersion)('appium-android-driver')
  },
  IosDriver: {
    driverClass: _appiumIosDriver.IosDriver,
    version: (0, _utils.getPackageVersion)('appium-ios-driver')
  },
  WindowsDriver: {
    driverClass: _appiumWindowsDriver.WindowsDriver,
    version: (0, _utils.getPackageVersion)('appium-windows-driver')
  },
  MacDriver: {
    driverClass: _appiumMacDriver.MacDriver,
    version: (0, _utils.getPackageVersion)('appium-mac-driver')
  },
  EspressoDriver: {
    driverClass: _appiumEspressoDriver.EspressoDriver,
    automationName: AUTOMATION_NAMES.ESPRESSO,
    version: (0, _utils.getPackageVersion)('appium-espresso-driver')
  },
  TizenDriver: {
    driverClass: _appiumTizenDriver.TizenDriver,
    automationName: AUTOMATION_NAMES.TIZEN,
    version: (0, _utils.getPackageVersion)('appium-tizen-driver')
  }
};

var PLATFORMS_MAP = {
  fake: function fake() {
    return _appiumFakeDriver.FakeDriver;
  },
  android: function android(caps) {
    var platformVersion = _semver2['default'].valid(_semver2['default'].coerce(caps.platformVersion));
    if (platformVersion && _semver2['default'].satisfies(platformVersion, '>=6.0.0')) {
      _logger2['default'].warn("Consider setting 'automationName' capability to " + ('\'' + AUTOMATION_NAMES.UIAUTOMATOR2 + '\' ') + "on Android >= 6, since UIAutomator framework " + "is not maintained anymore by the OS vendor.");
    }

    return _appiumAndroidDriver.AndroidDriver;
  },
  ios: function ios(caps) {
    var platformVersion = _semver2['default'].valid(_semver2['default'].coerce(caps.platformVersion));
    if (platformVersion && _semver2['default'].satisfies(platformVersion, '>=10.0.0')) {
      _logger2['default'].info("Requested iOS support with version >= 10, " + ('using \'' + AUTOMATION_NAMES.XCUITEST + '\' ') + "driver instead of UIAutomation-based driver, since the " + "latter is unsupported on iOS 10 and up.");
      return _appiumXcuitestDriver.XCUITestDriver;
    }

    return _appiumIosDriver.IosDriver;
  },
  windows: function windows() {
    return _appiumWindowsDriver.WindowsDriver;
  },
  mac: function mac() {
    return _appiumMacDriver.MacDriver;
  },
  tizen: function tizen() {
    return _appiumTizenDriver.TizenDriver;
  }
};

var desiredCapabilityConstraints = {
  automationName: {
    presence: false,
    isString: true,
    inclusionCaseInsensitive: _lodash2['default'].values(AUTOMATION_NAMES)
  },
  platformName: {
    presence: true,
    isString: true,
    inclusionCaseInsensitive: _lodash2['default'].keys(PLATFORMS_MAP)
  }
};

var sessionsListGuard = new _asyncLock2['default']();
var pendingDriversGuard = new _asyncLock2['default']();

var AppiumDriver = (function (_BaseDriver) {
  _inherits(AppiumDriver, _BaseDriver);

  function AppiumDriver(args) {
    _classCallCheck(this, AppiumDriver);

    _get(Object.getPrototypeOf(AppiumDriver.prototype), 'constructor', this).call(this);

    this.desiredCapConstraints = desiredCapabilityConstraints;

    // the main Appium Driver has no new command timeout
    this.newCommandTimeoutMs = 0;

    this.args = _Object$assign({}, args);

    // Access to sessions list must be guarded with a Semaphore, because
    // it might be changed by other async calls at any time
    // It is not recommended to access this property directly from the outside
    this.sessions = {};

    // Access to pending drivers list must be guarded with a Semaphore, because
    // it might be changed by other async calls at any time
    // It is not recommended to access this property directly from the outside
    this.pendingDrivers = {};

    (0, _config.updateBuildInfo)();
  }

  // help decide which commands should be proxied to sub-drivers and which
  // should be handled by this, our umbrella driver

  /**
   * Cancel commands queueing for the umbrella Appium driver
   */

  _createClass(AppiumDriver, [{
    key: 'sessionExists',
    value: function sessionExists(sessionId) {
      var dstSession = this.sessions[sessionId];
      return dstSession && dstSession.sessionId !== null;
    }
  }, {
    key: 'driverForSession',
    value: function driverForSession(sessionId) {
      return this.sessions[sessionId];
    }
  }, {
    key: 'getDriverForCaps',
    value: function getDriverForCaps(caps) {
      if (!_lodash2['default'].isString(caps.platformName)) {
        throw new Error("You must include a platformName capability");
      }

      // we don't necessarily have an `automationName` capability,
      if (_lodash2['default'].isString(caps.automationName)) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _getIterator(_lodash2['default'].values(DRIVER_MAP)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _step.value;
            var automationName = _step$value.automationName;
            var driverClass = _step$value.driverClass;

            if (_lodash2['default'].toLower(automationName) === caps.automationName.toLowerCase()) {
              return driverClass;
            }
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
      }

      var driverSelector = PLATFORMS_MAP[caps.platformName.toLowerCase()];
      if (driverSelector) {
        return driverSelector(caps);
      }

      var msg = _lodash2['default'].isString(caps.automationName) ? 'Could not find a driver for automationName \'' + caps.automationName + '\' and platformName ' + ('\'' + caps.platformName + '\'.') : 'Could not find a driver for platformName \'' + caps.platformName + '\'.';
      throw new Error(msg + ' Please check your desired capabilities.');
    }
  }, {
    key: 'getDriverVersion',
    value: function getDriverVersion(driver) {
      var _ref = DRIVER_MAP[driver.name] || {};

      var version = _ref.version;

      if (version) {
        return version;
      }
      _logger2['default'].warn('Unable to get version of driver \'' + driver.name + '\'');
    }
  }, {
    key: 'getStatus',
    value: function getStatus() {
      return _regeneratorRuntime.async(function getStatus$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.t0 = _lodash2['default'];
            context$2$0.next = 3;
            return _regeneratorRuntime.awrap((0, _config.getBuildInfo)());

          case 3:
            context$2$0.t1 = context$2$0.sent;
            context$2$0.t2 = context$2$0.t0.clone.call(context$2$0.t0, context$2$0.t1);
            return context$2$0.abrupt('return', {
              build: context$2$0.t2
            });

          case 6:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'getSessions',
    value: function getSessions() {
      var sessions;
      return _regeneratorRuntime.async(function getSessions$(context$2$0) {
        var _this = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(sessionsListGuard.acquire(AppiumDriver.name, function () {
              return _this.sessions;
            }));

          case 2:
            sessions = context$2$0.sent;
            return context$2$0.abrupt('return', _lodash2['default'].toPairs(sessions).map(function (_ref2) {
              var _ref22 = _slicedToArray(_ref2, 2);

              var id = _ref22[0];
              var driver = _ref22[1];

              return { id: id, capabilities: driver.caps };
            }));

          case 4:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'printNewSessionAnnouncement',
    value: function printNewSessionAnnouncement(driver, caps) {
      var driverVersion = this.getDriverVersion(driver);
      var introString = driverVersion ? 'Creating new ' + driver.name + ' (v' + driverVersion + ') session' : 'Creating new ' + driver.name + ' session';
      _logger2['default'].info(introString);
      _logger2['default'].info('Capabilities:');
      (0, _utils.inspectObject)(caps);
    }

    /**
     * Create a new session
     * @param {Object} jsonwpCaps JSONWP formatted desired capabilities
     * @param {Object} reqCaps Required capabilities (JSONWP standard)
     * @param {Object} w3cCapabilities W3C capabilities
     * @return {Array} Unique session ID and capabilities
     */
  }, {
    key: 'createSession',
    value: function createSession(jsonwpCaps, reqCaps, w3cCapabilities) {
      var defaultCapabilities, protocol, innerSessionId, dCaps;
      return _regeneratorRuntime.async(function createSession$(context$2$0) {
        var _this3 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            defaultCapabilities = this.args.defaultCapabilities;
            protocol = undefined;
            innerSessionId = undefined, dCaps = undefined;
            context$2$0.prev = 3;
            context$2$0.next = 6;
            return _regeneratorRuntime.awrap((function callee$2$0() {
              var parsedCaps, desiredCaps, processedJsonwpCapabilities, processedW3CCapabilities, error, InnerDriver, sessionIdsToDelete, runningDriversData, otherPendingDriversData, d, _ref3, _ref32;

              return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                var _this2 = this;

                while (1) switch (context$3$0.prev = context$3$0.next) {
                  case 0:
                    parsedCaps = (0, _utils.parseCapsForInnerDriver)(jsonwpCaps, w3cCapabilities, this.desiredCapConstraints, defaultCapabilities);
                    desiredCaps = parsedCaps.desiredCaps;
                    processedJsonwpCapabilities = parsedCaps.processedJsonwpCapabilities;
                    processedW3CCapabilities = parsedCaps.processedW3CCapabilities;
                    error = parsedCaps.error;

                    protocol = parsedCaps.protocol;

                    // If the parsing of the caps produced an error, throw it in here

                    if (!error) {
                      context$3$0.next = 8;
                      break;
                    }

                    throw error;

                  case 8:
                    InnerDriver = this.getDriverForCaps(desiredCaps);

                    this.printNewSessionAnnouncement(InnerDriver, desiredCaps);

                    if (!this.args.sessionOverride) {
                      context$3$0.next = 23;
                      break;
                    }

                    context$3$0.next = 13;
                    return _regeneratorRuntime.awrap(sessionsListGuard.acquire(AppiumDriver.name, function () {
                      return _lodash2['default'].keys(_this2.sessions);
                    }));

                  case 13:
                    sessionIdsToDelete = context$3$0.sent;

                    if (!sessionIdsToDelete.length) {
                      context$3$0.next = 23;
                      break;
                    }

                    _logger2['default'].info('Session override is on. Deleting other ' + sessionIdsToDelete.length + ' active session' + (sessionIdsToDelete.length ? '' : 's') + '.');
                    context$3$0.prev = 16;
                    context$3$0.next = 19;
                    return _regeneratorRuntime.awrap(_bluebird2['default'].map(sessionIdsToDelete, function (id) {
                      return _this2.deleteSession(id);
                    }));

                  case 19:
                    context$3$0.next = 23;
                    break;

                  case 21:
                    context$3$0.prev = 21;
                    context$3$0.t0 = context$3$0['catch'](16);

                  case 23:
                    runningDriversData = undefined, otherPendingDriversData = undefined;
                    d = new InnerDriver(this.args);

                    if (this.args.relaxedSecurityEnabled) {
                      _logger2['default'].info('Applying relaxed security to \'' + InnerDriver.name + '\' as per server command line argument');
                      d.relaxedSecurityEnabled = true;
                    }
                    // This assignment is required for correct web sockets functionality inside the driver
                    d.server = this.server;
                    context$3$0.prev = 27;
                    context$3$0.next = 30;
                    return _regeneratorRuntime.awrap(this.curSessionDataForDriver(InnerDriver));

                  case 30:
                    runningDriversData = context$3$0.sent;
                    context$3$0.next = 36;
                    break;

                  case 33:
                    context$3$0.prev = 33;
                    context$3$0.t1 = context$3$0['catch'](27);
                    throw new _appiumBaseDriver.errors.SessionNotCreatedError(context$3$0.t1.message);

                  case 36:
                    context$3$0.next = 38;
                    return _regeneratorRuntime.awrap(pendingDriversGuard.acquire(AppiumDriver.name, function () {
                      _this2.pendingDrivers[InnerDriver.name] = _this2.pendingDrivers[InnerDriver.name] || [];
                      otherPendingDriversData = _this2.pendingDrivers[InnerDriver.name].map(function (drv) {
                        return drv.driverData;
                      });
                      _this2.pendingDrivers[InnerDriver.name].push(d);
                    }));

                  case 38:
                    context$3$0.prev = 38;
                    context$3$0.next = 41;
                    return _regeneratorRuntime.awrap(d.createSession(processedJsonwpCapabilities, reqCaps, processedW3CCapabilities, [].concat(_toConsumableArray(runningDriversData), _toConsumableArray(otherPendingDriversData))));

                  case 41:
                    _ref3 = context$3$0.sent;
                    _ref32 = _slicedToArray(_ref3, 2);
                    innerSessionId = _ref32[0];
                    dCaps = _ref32[1];

                    protocol = d.protocol;
                    context$3$0.next = 48;
                    return _regeneratorRuntime.awrap(sessionsListGuard.acquire(AppiumDriver.name, function () {
                      _this2.sessions[innerSessionId] = d;
                    }));

                  case 48:
                    context$3$0.prev = 48;
                    context$3$0.next = 51;
                    return _regeneratorRuntime.awrap(pendingDriversGuard.acquire(AppiumDriver.name, function () {
                      _lodash2['default'].pull(_this2.pendingDrivers[InnerDriver.name], d);
                    }));

                  case 51:
                    return context$3$0.finish(48);

                  case 52:

                    // this is an async function but we don't await it because it handles
                    // an out-of-band promise which is fulfilled if the inner driver
                    // unexpectedly shuts down
                    this.attachUnexpectedShutdownHandler(d, innerSessionId);

                    _logger2['default'].info('New ' + InnerDriver.name + ' session created successfully, session ' + (innerSessionId + ' added to master session list'));

                    // set the New Command Timeout for the inner driver
                    d.startNewCommandTimeout();

                  case 55:
                  case 'end':
                    return context$3$0.stop();
                }
              }, null, _this3, [[16, 21], [27, 33], [38,, 48, 52]]);
            })());

          case 6:
            context$2$0.next = 11;
            break;

          case 8:
            context$2$0.prev = 8;
            context$2$0.t0 = context$2$0['catch'](3);
            return context$2$0.abrupt('return', {
              protocol: protocol,
              error: context$2$0.t0
            });

          case 11:
            return context$2$0.abrupt('return', {
              protocol: protocol,
              value: [innerSessionId, dCaps, protocol]
            });

          case 12:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[3, 8]]);
    }
  }, {
    key: 'attachUnexpectedShutdownHandler',
    value: function attachUnexpectedShutdownHandler(driver, innerSessionId) {
      return _regeneratorRuntime.async(function attachUnexpectedShutdownHandler$(context$2$0) {
        var _this4 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.prev = 0;
            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(driver.onUnexpectedShutdown);

          case 3:
            throw new Error('Unexpected shutdown');

          case 6:
            context$2$0.prev = 6;
            context$2$0.t0 = context$2$0['catch'](0);

            if (!(context$2$0.t0 instanceof _bluebird2['default'].CancellationError)) {
              context$2$0.next = 10;
              break;
            }

            return context$2$0.abrupt('return');

          case 10:
            _logger2['default'].warn('Closing session, cause was \'' + context$2$0.t0.message + '\'');
            _logger2['default'].info('Removing session ' + innerSessionId + ' from our master session list');
            context$2$0.next = 14;
            return _regeneratorRuntime.awrap(sessionsListGuard.acquire(AppiumDriver.name, function () {
              delete _this4.sessions[innerSessionId];
            }));

          case 14:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[0, 6]]);
    }
  }, {
    key: 'curSessionDataForDriver',
    value: function curSessionDataForDriver(InnerDriver) {
      var sessions, data, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, datum;

      return _regeneratorRuntime.async(function curSessionDataForDriver$(context$2$0) {
        var _this5 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(sessionsListGuard.acquire(AppiumDriver.name, function () {
              return _this5.sessions;
            }));

          case 2:
            sessions = context$2$0.sent;
            data = _lodash2['default'].values(sessions).filter(function (s) {
              return s.constructor.name === InnerDriver.name;
            }).map(function (s) {
              return s.driverData;
            });
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            context$2$0.prev = 7;
            _iterator2 = _getIterator(data);

          case 9:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              context$2$0.next = 16;
              break;
            }

            datum = _step2.value;

            if (datum) {
              context$2$0.next = 13;
              break;
            }

            throw new Error('Problem getting session data for driver type ' + (InnerDriver.name + '; does it implement \'get ') + 'driverData\'?');

          case 13:
            _iteratorNormalCompletion2 = true;
            context$2$0.next = 9;
            break;

          case 16:
            context$2$0.next = 22;
            break;

          case 18:
            context$2$0.prev = 18;
            context$2$0.t0 = context$2$0['catch'](7);
            _didIteratorError2 = true;
            _iteratorError2 = context$2$0.t0;

          case 22:
            context$2$0.prev = 22;
            context$2$0.prev = 23;

            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
              _iterator2['return']();
            }

          case 25:
            context$2$0.prev = 25;

            if (!_didIteratorError2) {
              context$2$0.next = 28;
              break;
            }

            throw _iteratorError2;

          case 28:
            return context$2$0.finish(25);

          case 29:
            return context$2$0.finish(22);

          case 30:
            return context$2$0.abrupt('return', data);

          case 31:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[7, 18, 22, 30], [23,, 25, 29]]);
    }
  }, {
    key: 'deleteSession',
    value: function deleteSession(sessionId) {
      var protocol, _ret2;

      return _regeneratorRuntime.async(function deleteSession$(context$2$0) {
        var _this7 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            protocol = undefined;
            context$2$0.prev = 1;
            context$2$0.next = 4;
            return _regeneratorRuntime.awrap((function callee$2$0() {
              var otherSessionsData, dstSession;
              return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                var _this6 = this;

                while (1) switch (context$3$0.prev = context$3$0.next) {
                  case 0:
                    otherSessionsData = null;
                    dstSession = null;
                    context$3$0.next = 4;
                    return _regeneratorRuntime.awrap(sessionsListGuard.acquire(AppiumDriver.name, function () {
                      if (!_this6.sessions[sessionId]) {
                        return;
                      }
                      var curConstructorName = _this6.sessions[sessionId].constructor.name;
                      otherSessionsData = _lodash2['default'].toPairs(_this6.sessions).filter(function (_ref4) {
                        var _ref42 = _slicedToArray(_ref4, 2);

                        var key = _ref42[0];
                        var value = _ref42[1];
                        return value.constructor.name === curConstructorName && key !== sessionId;
                      }).map(function (_ref5) {
                        var _ref52 = _slicedToArray(_ref5, 2);

                        var value = _ref52[1];
                        return value.driverData;
                      });
                      dstSession = _this6.sessions[sessionId];
                      protocol = dstSession.protocol;
                      _logger2['default'].info('Removing session ' + sessionId + ' from our master session list');
                      // regardless of whether the deleteSession completes successfully or not
                      // make the session unavailable, because who knows what state it might
                      // be in otherwise
                      delete _this6.sessions[sessionId];
                    }));

                  case 4:
                    context$3$0.t0 = protocol;
                    context$3$0.next = 7;
                    return _regeneratorRuntime.awrap(dstSession.deleteSession(sessionId, otherSessionsData));

                  case 7:
                    context$3$0.t1 = context$3$0.sent;
                    context$3$0.t2 = {
                      protocol: context$3$0.t0,
                      value: context$3$0.t1
                    };
                    return context$3$0.abrupt('return', {
                      v: context$3$0.t2
                    });

                  case 10:
                  case 'end':
                    return context$3$0.stop();
                }
              }, null, _this7);
            })());

          case 4:
            _ret2 = context$2$0.sent;

            if (!(typeof _ret2 === 'object')) {
              context$2$0.next = 7;
              break;
            }

            return context$2$0.abrupt('return', _ret2.v);

          case 7:
            context$2$0.next = 13;
            break;

          case 9:
            context$2$0.prev = 9;
            context$2$0.t0 = context$2$0['catch'](1);

            _logger2['default'].error('Had trouble ending session ' + sessionId + ': ' + context$2$0.t0.message);
            return context$2$0.abrupt('return', {
              protocol: protocol,
              error: context$2$0.t0
            });

          case 13:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[1, 9]]);
    }
  }, {
    key: 'executeCommand',
    value: function executeCommand(cmd) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var _get2, sessionId, dstSession, res;

      return _regeneratorRuntime.async(function executeCommand$(context$2$0) {
        var _this8 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!(cmd === 'getStatus')) {
              context$2$0.next = 4;
              break;
            }

            context$2$0.next = 3;
            return _regeneratorRuntime.awrap(this.getStatus());

          case 3:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 4:
            if (!isAppiumDriverCommand(cmd)) {
              context$2$0.next = 8;
              break;
            }

            context$2$0.next = 7;
            return _regeneratorRuntime.awrap((_get2 = _get(Object.getPrototypeOf(AppiumDriver.prototype), 'executeCommand', this)).call.apply(_get2, [this, cmd].concat(args)));

          case 7:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 8:
            sessionId = _lodash2['default'].last(args);
            context$2$0.next = 11;
            return _regeneratorRuntime.awrap(sessionsListGuard.acquire(AppiumDriver.name, function () {
              return _this8.sessions[sessionId];
            }));

          case 11:
            dstSession = context$2$0.sent;

            if (dstSession) {
              context$2$0.next = 14;
              break;
            }

            throw new Error('The session with id \'' + sessionId + '\' does not exist');

          case 14:
            res = {
              protocol: dstSession.protocol
            };
            context$2$0.prev = 15;
            context$2$0.next = 18;
            return _regeneratorRuntime.awrap(dstSession.executeCommand.apply(dstSession, [cmd].concat(args)));

          case 18:
            res.value = context$2$0.sent;
            context$2$0.next = 24;
            break;

          case 21:
            context$2$0.prev = 21;
            context$2$0.t0 = context$2$0['catch'](15);

            res.error = context$2$0.t0;

          case 24:
            return context$2$0.abrupt('return', res);

          case 25:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[15, 21]]);
    }
  }, {
    key: 'proxyActive',
    value: function proxyActive(sessionId) {
      var dstSession = this.sessions[sessionId];
      return dstSession && _lodash2['default'].isFunction(dstSession.proxyActive) && dstSession.proxyActive(sessionId);
    }
  }, {
    key: 'getProxyAvoidList',
    value: function getProxyAvoidList(sessionId) {
      var dstSession = this.sessions[sessionId];
      return dstSession ? dstSession.getProxyAvoidList() : [];
    }
  }, {
    key: 'canProxy',
    value: function canProxy(sessionId) {
      var dstSession = this.sessions[sessionId];
      return dstSession && dstSession.canProxy(sessionId);
    }
  }, {
    key: 'isCommandsQueueEnabled',
    get: function get() {
      return false;
    }
  }]);

  return AppiumDriver;
})(_appiumBaseDriver.BaseDriver);

function isAppiumDriverCommand(cmd) {
  return !(0, _appiumBaseDriver.isSessionCommand)(cmd) || cmd === "deleteSession";
}

exports.AppiumDriver = AppiumDriver;

// Parse the caps into a format that the InnerDriver will accept

// Remove the session on unexpected shutdown, so that we are in a position
// to open another session later on.
// TODO: this should be removed and replaced by a onShutdown callback.
// this is a cancellable promise
// if we get here, we've had an unexpected shutdown, so error

// if we cancelled the unexpected shutdown promise, that means we
// no longer care about it, and can safely ignore it

// getStatus command should not be put into queue. If we do it as part of super.executeCommand, it will be added to queue.
// There will be lot of status commands in queue during createSession command, as createSession can take up to or more than a minute.
//# sourceMappingURL=data:application/json;charset=utf8;base64,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RSxVQUFVLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDaEc7OztXQUVpQiwyQkFBQyxTQUFTLEVBQUU7QUFDNUIsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1QyxhQUFPLFVBQVUsR0FBRyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLENBQUM7S0FDekQ7OztXQUVRLGtCQUFDLFNBQVMsRUFBRTtBQUNuQixVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzVDLGFBQU8sVUFBVSxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDckQ7OztTQTlSMEIsZUFBRztBQUM1QixhQUFPLEtBQUssQ0FBQztLQUNkOzs7U0E3QkcsWUFBWTs7O0FBOFRsQixTQUFTLHFCQUFxQixDQUFFLEdBQUcsRUFBRTtBQUNuQyxTQUFPLENBQUMsd0NBQWlCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxlQUFlLENBQUM7Q0FDMUQ7O1FBRVEsWUFBWSxHQUFaLFlBQVkiLCJmaWxlIjoibGliL2FwcGl1bS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgbG9nIGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7IGdldEJ1aWxkSW5mbywgdXBkYXRlQnVpbGRJbmZvIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgQmFzZURyaXZlciwgZXJyb3JzLCBpc1Nlc3Npb25Db21tYW5kIH0gZnJvbSAnYXBwaXVtLWJhc2UtZHJpdmVyJztcbmltcG9ydCB7IEZha2VEcml2ZXIgfSBmcm9tICdhcHBpdW0tZmFrZS1kcml2ZXInO1xuaW1wb3J0IHsgQW5kcm9pZERyaXZlciB9IGZyb20gJ2FwcGl1bS1hbmRyb2lkLWRyaXZlcic7XG5pbXBvcnQgeyBJb3NEcml2ZXIgfSBmcm9tICdhcHBpdW0taW9zLWRyaXZlcic7XG5pbXBvcnQgeyBBbmRyb2lkVWlhdXRvbWF0b3IyRHJpdmVyIH0gZnJvbSAnYXBwaXVtLXVpYXV0b21hdG9yMi1kcml2ZXInO1xuaW1wb3J0IHsgU2VsZW5kcm9pZERyaXZlciB9IGZyb20gJ2FwcGl1bS1zZWxlbmRyb2lkLWRyaXZlcic7XG5pbXBvcnQgeyBYQ1VJVGVzdERyaXZlciB9IGZyb20gJ2FwcGl1bS14Y3VpdGVzdC1kcml2ZXInO1xuaW1wb3J0IHsgWW91aUVuZ2luZURyaXZlciB9IGZyb20gJ2FwcGl1bS15b3VpZW5naW5lLWRyaXZlcic7XG5pbXBvcnQgeyBXaW5kb3dzRHJpdmVyIH0gZnJvbSAnYXBwaXVtLXdpbmRvd3MtZHJpdmVyJztcbmltcG9ydCB7IE1hY0RyaXZlciB9IGZyb20gJ2FwcGl1bS1tYWMtZHJpdmVyJztcbmltcG9ydCB7IEVzcHJlc3NvRHJpdmVyIH0gZnJvbSAnYXBwaXVtLWVzcHJlc3NvLWRyaXZlcic7XG5pbXBvcnQgeyBUaXplbkRyaXZlciB9IGZyb20gJ2FwcGl1bS10aXplbi1kcml2ZXInO1xuaW1wb3J0IEIgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IEFzeW5jTG9jayBmcm9tICdhc3luYy1sb2NrJztcbmltcG9ydCB7IGluc3BlY3RPYmplY3QsIHBhcnNlQ2Fwc0ZvcklubmVyRHJpdmVyLCBnZXRQYWNrYWdlVmVyc2lvbiB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHNlbXZlciBmcm9tICdzZW12ZXInO1xuXG5cbmNvbnN0IEFVVE9NQVRJT05fTkFNRVMgPSB7XG4gIEFQUElVTTogJ0FwcGl1bScsXG4gIFNFTEVORFJPSUQ6ICdTZWxlbmRyb2lkJyxcbiAgVUlBVVRPTUFUT1IyOiAnVWlBdXRvbWF0b3IyJyxcbiAgWENVSVRFU1Q6ICdYQ1VJVGVzdCcsXG4gIFlPVUlFTkdJTkU6ICdZb3VpRW5naW5lJyxcbiAgRVNQUkVTU086ICdFc3ByZXNzbycsXG4gIFRJWkVOOiAnVGl6ZW4nLFxuICBGQUtFOiAnRmFrZScsXG59O1xuY29uc3QgRFJJVkVSX01BUCA9IHtcbiAgU2VsZW5kcm9pZERyaXZlcjoge1xuICAgIGRyaXZlckNsYXNzOiBTZWxlbmRyb2lkRHJpdmVyLFxuICAgIGF1dG9tYXRpb25OYW1lOiBBVVRPTUFUSU9OX05BTUVTLlNFTEVORFJPSUQsXG4gICAgdmVyc2lvbjogZ2V0UGFja2FnZVZlcnNpb24oJ2FwcGl1bS1zZWxlbmRyb2lkLWRyaXZlcicpLFxuICB9LFxuICBBbmRyb2lkVWlhdXRvbWF0b3IyRHJpdmVyOiB7XG4gICAgZHJpdmVyQ2xhc3M6IEFuZHJvaWRVaWF1dG9tYXRvcjJEcml2ZXIsXG4gICAgYXV0b21hdGlvbk5hbWU6IEFVVE9NQVRJT05fTkFNRVMuVUlBVVRPTUFUT1IyLFxuICAgIHZlcnNpb246IGdldFBhY2thZ2VWZXJzaW9uKCdhcHBpdW0tdWlhdXRvbWF0b3IyLWRyaXZlcicpLFxuICB9LFxuICBYQ1VJVGVzdERyaXZlcjoge1xuICAgIGRyaXZlckNsYXNzOiBYQ1VJVGVzdERyaXZlcixcbiAgICBhdXRvbWF0aW9uTmFtZTogQVVUT01BVElPTl9OQU1FUy5YQ1VJVEVTVCxcbiAgICB2ZXJzaW9uOiBnZXRQYWNrYWdlVmVyc2lvbignYXBwaXVtLXhjdWl0ZXN0LWRyaXZlcicpLFxuICB9LFxuICBZb3VpRW5naW5lRHJpdmVyOiB7XG4gICAgZHJpdmVyQ2xhc3M6IFlvdWlFbmdpbmVEcml2ZXIsXG4gICAgYXV0b21hdGlvbk5hbWU6IEFVVE9NQVRJT05fTkFNRVMuWU9VSUVOR0lORSxcbiAgICB2ZXJzaW9uOiBnZXRQYWNrYWdlVmVyc2lvbignYXBwaXVtLXlvdWllbmdpbmUtZHJpdmVyJyksXG4gIH0sXG4gIEZha2VEcml2ZXI6IHtcbiAgICBkcml2ZXJDbGFzczogRmFrZURyaXZlcixcbiAgICB2ZXJzaW9uOiBnZXRQYWNrYWdlVmVyc2lvbignYXBwaXVtLWZha2UtZHJpdmVyJyksXG4gIH0sXG4gIEFuZHJvaWREcml2ZXI6IHtcbiAgICBkcml2ZXJDbGFzczogQW5kcm9pZERyaXZlcixcbiAgICB2ZXJzaW9uOiBnZXRQYWNrYWdlVmVyc2lvbignYXBwaXVtLWFuZHJvaWQtZHJpdmVyJyksXG4gIH0sXG4gIElvc0RyaXZlcjoge1xuICAgIGRyaXZlckNsYXNzOiBJb3NEcml2ZXIsXG4gICAgdmVyc2lvbjogZ2V0UGFja2FnZVZlcnNpb24oJ2FwcGl1bS1pb3MtZHJpdmVyJyksXG4gIH0sXG4gIFdpbmRvd3NEcml2ZXI6IHtcbiAgICBkcml2ZXJDbGFzczogV2luZG93c0RyaXZlcixcbiAgICB2ZXJzaW9uOiBnZXRQYWNrYWdlVmVyc2lvbignYXBwaXVtLXdpbmRvd3MtZHJpdmVyJyksXG4gIH0sXG4gIE1hY0RyaXZlcjoge1xuICAgIGRyaXZlckNsYXNzOiBNYWNEcml2ZXIsXG4gICAgdmVyc2lvbjogZ2V0UGFja2FnZVZlcnNpb24oJ2FwcGl1bS1tYWMtZHJpdmVyJyksXG4gIH0sXG4gIEVzcHJlc3NvRHJpdmVyOiB7XG4gICAgZHJpdmVyQ2xhc3M6IEVzcHJlc3NvRHJpdmVyLFxuICAgIGF1dG9tYXRpb25OYW1lOiBBVVRPTUFUSU9OX05BTUVTLkVTUFJFU1NPLFxuICAgIHZlcnNpb246IGdldFBhY2thZ2VWZXJzaW9uKCdhcHBpdW0tZXNwcmVzc28tZHJpdmVyJyksXG4gIH0sXG4gIFRpemVuRHJpdmVyOiB7XG4gICAgZHJpdmVyQ2xhc3M6IFRpemVuRHJpdmVyLFxuICAgIGF1dG9tYXRpb25OYW1lOiBBVVRPTUFUSU9OX05BTUVTLlRJWkVOLFxuICAgIHZlcnNpb246IGdldFBhY2thZ2VWZXJzaW9uKCdhcHBpdW0tdGl6ZW4tZHJpdmVyJyksXG4gIH0sXG59O1xuXG5jb25zdCBQTEFURk9STVNfTUFQID0ge1xuICBmYWtlOiAoKSA9PiBGYWtlRHJpdmVyLFxuICBhbmRyb2lkOiAoY2FwcykgPT4ge1xuICAgIGNvbnN0IHBsYXRmb3JtVmVyc2lvbiA9IHNlbXZlci52YWxpZChzZW12ZXIuY29lcmNlKGNhcHMucGxhdGZvcm1WZXJzaW9uKSk7XG4gICAgaWYgKHBsYXRmb3JtVmVyc2lvbiAmJiBzZW12ZXIuc2F0aXNmaWVzKHBsYXRmb3JtVmVyc2lvbiwgJz49Ni4wLjAnKSkge1xuICAgICAgbG9nLndhcm4oXCJDb25zaWRlciBzZXR0aW5nICdhdXRvbWF0aW9uTmFtZScgY2FwYWJpbGl0eSB0byBcIiArXG4gICAgICAgIGAnJHtBVVRPTUFUSU9OX05BTUVTLlVJQVVUT01BVE9SMn0nIGAgK1xuICAgICAgICBcIm9uIEFuZHJvaWQgPj0gNiwgc2luY2UgVUlBdXRvbWF0b3IgZnJhbWV3b3JrIFwiICtcbiAgICAgICAgXCJpcyBub3QgbWFpbnRhaW5lZCBhbnltb3JlIGJ5IHRoZSBPUyB2ZW5kb3IuXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBBbmRyb2lkRHJpdmVyO1xuICB9LFxuICBpb3M6IChjYXBzKSA9PiB7XG4gICAgY29uc3QgcGxhdGZvcm1WZXJzaW9uID0gc2VtdmVyLnZhbGlkKHNlbXZlci5jb2VyY2UoY2Fwcy5wbGF0Zm9ybVZlcnNpb24pKTtcbiAgICBpZiAocGxhdGZvcm1WZXJzaW9uICYmIHNlbXZlci5zYXRpc2ZpZXMocGxhdGZvcm1WZXJzaW9uLCAnPj0xMC4wLjAnKSkge1xuICAgICAgbG9nLmluZm8oXCJSZXF1ZXN0ZWQgaU9TIHN1cHBvcnQgd2l0aCB2ZXJzaW9uID49IDEwLCBcIiArXG4gICAgICAgIGB1c2luZyAnJHtBVVRPTUFUSU9OX05BTUVTLlhDVUlURVNUfScgYCArXG4gICAgICAgIFwiZHJpdmVyIGluc3RlYWQgb2YgVUlBdXRvbWF0aW9uLWJhc2VkIGRyaXZlciwgc2luY2UgdGhlIFwiICtcbiAgICAgICAgXCJsYXR0ZXIgaXMgdW5zdXBwb3J0ZWQgb24gaU9TIDEwIGFuZCB1cC5cIik7XG4gICAgICByZXR1cm4gWENVSVRlc3REcml2ZXI7XG4gICAgfVxuXG4gICAgcmV0dXJuIElvc0RyaXZlcjtcbiAgfSxcbiAgd2luZG93czogKCkgPT4gV2luZG93c0RyaXZlcixcbiAgbWFjOiAoKSA9PiBNYWNEcml2ZXIsXG4gIHRpemVuOiAoKSA9PiBUaXplbkRyaXZlcixcbn07XG5cbmNvbnN0IGRlc2lyZWRDYXBhYmlsaXR5Q29uc3RyYWludHMgPSB7XG4gIGF1dG9tYXRpb25OYW1lOiB7XG4gICAgcHJlc2VuY2U6IGZhbHNlLFxuICAgIGlzU3RyaW5nOiB0cnVlLFxuICAgIGluY2x1c2lvbkNhc2VJbnNlbnNpdGl2ZTogXy52YWx1ZXMoQVVUT01BVElPTl9OQU1FUyksXG4gIH0sXG4gIHBsYXRmb3JtTmFtZToge1xuICAgIHByZXNlbmNlOiB0cnVlLFxuICAgIGlzU3RyaW5nOiB0cnVlLFxuICAgIGluY2x1c2lvbkNhc2VJbnNlbnNpdGl2ZTogXy5rZXlzKFBMQVRGT1JNU19NQVApLFxuICB9LFxufTtcblxuY29uc3Qgc2Vzc2lvbnNMaXN0R3VhcmQgPSBuZXcgQXN5bmNMb2NrKCk7XG5jb25zdCBwZW5kaW5nRHJpdmVyc0d1YXJkID0gbmV3IEFzeW5jTG9jaygpO1xuXG5jbGFzcyBBcHBpdW1Ecml2ZXIgZXh0ZW5kcyBCYXNlRHJpdmVyIHtcbiAgY29uc3RydWN0b3IgKGFyZ3MpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5kZXNpcmVkQ2FwQ29uc3RyYWludHMgPSBkZXNpcmVkQ2FwYWJpbGl0eUNvbnN0cmFpbnRzO1xuXG4gICAgLy8gdGhlIG1haW4gQXBwaXVtIERyaXZlciBoYXMgbm8gbmV3IGNvbW1hbmQgdGltZW91dFxuICAgIHRoaXMubmV3Q29tbWFuZFRpbWVvdXRNcyA9IDA7XG5cbiAgICB0aGlzLmFyZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBhcmdzKTtcblxuICAgIC8vIEFjY2VzcyB0byBzZXNzaW9ucyBsaXN0IG11c3QgYmUgZ3VhcmRlZCB3aXRoIGEgU2VtYXBob3JlLCBiZWNhdXNlXG4gICAgLy8gaXQgbWlnaHQgYmUgY2hhbmdlZCBieSBvdGhlciBhc3luYyBjYWxscyBhdCBhbnkgdGltZVxuICAgIC8vIEl0IGlzIG5vdCByZWNvbW1lbmRlZCB0byBhY2Nlc3MgdGhpcyBwcm9wZXJ0eSBkaXJlY3RseSBmcm9tIHRoZSBvdXRzaWRlXG4gICAgdGhpcy5zZXNzaW9ucyA9IHt9O1xuXG4gICAgLy8gQWNjZXNzIHRvIHBlbmRpbmcgZHJpdmVycyBsaXN0IG11c3QgYmUgZ3VhcmRlZCB3aXRoIGEgU2VtYXBob3JlLCBiZWNhdXNlXG4gICAgLy8gaXQgbWlnaHQgYmUgY2hhbmdlZCBieSBvdGhlciBhc3luYyBjYWxscyBhdCBhbnkgdGltZVxuICAgIC8vIEl0IGlzIG5vdCByZWNvbW1lbmRlZCB0byBhY2Nlc3MgdGhpcyBwcm9wZXJ0eSBkaXJlY3RseSBmcm9tIHRoZSBvdXRzaWRlXG4gICAgdGhpcy5wZW5kaW5nRHJpdmVycyA9IHt9O1xuXG4gICAgdXBkYXRlQnVpbGRJbmZvKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VsIGNvbW1hbmRzIHF1ZXVlaW5nIGZvciB0aGUgdW1icmVsbGEgQXBwaXVtIGRyaXZlclxuICAgKi9cbiAgZ2V0IGlzQ29tbWFuZHNRdWV1ZUVuYWJsZWQgKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNlc3Npb25FeGlzdHMgKHNlc3Npb25JZCkge1xuICAgIGNvbnN0IGRzdFNlc3Npb24gPSB0aGlzLnNlc3Npb25zW3Nlc3Npb25JZF07XG4gICAgcmV0dXJuIGRzdFNlc3Npb24gJiYgZHN0U2Vzc2lvbi5zZXNzaW9uSWQgIT09IG51bGw7XG4gIH1cblxuICBkcml2ZXJGb3JTZXNzaW9uIChzZXNzaW9uSWQpIHtcbiAgICByZXR1cm4gdGhpcy5zZXNzaW9uc1tzZXNzaW9uSWRdO1xuICB9XG5cbiAgZ2V0RHJpdmVyRm9yQ2FwcyAoY2Fwcykge1xuICAgIGlmICghXy5pc1N0cmluZyhjYXBzLnBsYXRmb3JtTmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdSBtdXN0IGluY2x1ZGUgYSBwbGF0Zm9ybU5hbWUgY2FwYWJpbGl0eVwiKTtcbiAgICB9XG5cbiAgICAvLyB3ZSBkb24ndCBuZWNlc3NhcmlseSBoYXZlIGFuIGBhdXRvbWF0aW9uTmFtZWAgY2FwYWJpbGl0eSxcbiAgICBpZiAoXy5pc1N0cmluZyhjYXBzLmF1dG9tYXRpb25OYW1lKSkge1xuICAgICAgZm9yIChjb25zdCB7YXV0b21hdGlvbk5hbWUsIGRyaXZlckNsYXNzfSBvZiBfLnZhbHVlcyhEUklWRVJfTUFQKSkge1xuICAgICAgICBpZiAoXy50b0xvd2VyKGF1dG9tYXRpb25OYW1lKSA9PT0gY2Fwcy5hdXRvbWF0aW9uTmFtZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgcmV0dXJuIGRyaXZlckNsYXNzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZHJpdmVyU2VsZWN0b3IgPSBQTEFURk9STVNfTUFQW2NhcHMucGxhdGZvcm1OYW1lLnRvTG93ZXJDYXNlKCldO1xuICAgIGlmIChkcml2ZXJTZWxlY3Rvcikge1xuICAgICAgcmV0dXJuIGRyaXZlclNlbGVjdG9yKGNhcHMpO1xuICAgIH1cblxuICAgIGNvbnN0IG1zZyA9IF8uaXNTdHJpbmcoY2Fwcy5hdXRvbWF0aW9uTmFtZSlcbiAgICAgID8gYENvdWxkIG5vdCBmaW5kIGEgZHJpdmVyIGZvciBhdXRvbWF0aW9uTmFtZSAnJHtjYXBzLmF1dG9tYXRpb25OYW1lfScgYW5kIHBsYXRmb3JtTmFtZSBgICtcbiAgICAgICAgICAgIGAnJHtjYXBzLnBsYXRmb3JtTmFtZX0nLmBcbiAgICAgIDogYENvdWxkIG5vdCBmaW5kIGEgZHJpdmVyIGZvciBwbGF0Zm9ybU5hbWUgJyR7Y2Fwcy5wbGF0Zm9ybU5hbWV9Jy5gO1xuICAgIHRocm93IG5ldyBFcnJvcihgJHttc2d9IFBsZWFzZSBjaGVjayB5b3VyIGRlc2lyZWQgY2FwYWJpbGl0aWVzLmApO1xuICB9XG5cbiAgZ2V0RHJpdmVyVmVyc2lvbiAoZHJpdmVyKSB7XG4gICAgY29uc3Qge3ZlcnNpb259ID0gRFJJVkVSX01BUFtkcml2ZXIubmFtZV0gfHwge307XG4gICAgaWYgKHZlcnNpb24pIHtcbiAgICAgIHJldHVybiB2ZXJzaW9uO1xuICAgIH1cbiAgICBsb2cud2FybihgVW5hYmxlIHRvIGdldCB2ZXJzaW9uIG9mIGRyaXZlciAnJHtkcml2ZXIubmFtZX0nYCk7XG4gIH1cblxuICBhc3luYyBnZXRTdGF0dXMgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBidWlsZDogXy5jbG9uZShhd2FpdCBnZXRCdWlsZEluZm8oKSksXG4gICAgfTtcbiAgfVxuXG4gIGFzeW5jIGdldFNlc3Npb25zICgpIHtcbiAgICBjb25zdCBzZXNzaW9ucyA9IGF3YWl0IHNlc3Npb25zTGlzdEd1YXJkLmFjcXVpcmUoQXBwaXVtRHJpdmVyLm5hbWUsICgpID0+IHRoaXMuc2Vzc2lvbnMpO1xuICAgIHJldHVybiBfLnRvUGFpcnMoc2Vzc2lvbnMpXG4gICAgICAgIC5tYXAoKFtpZCwgZHJpdmVyXSkgPT4ge1xuICAgICAgICAgIHJldHVybiB7aWQsIGNhcGFiaWxpdGllczogZHJpdmVyLmNhcHN9O1xuICAgICAgICB9KTtcbiAgfVxuXG4gIHByaW50TmV3U2Vzc2lvbkFubm91bmNlbWVudCAoZHJpdmVyLCBjYXBzKSB7XG4gICAgY29uc3QgZHJpdmVyVmVyc2lvbiA9IHRoaXMuZ2V0RHJpdmVyVmVyc2lvbihkcml2ZXIpO1xuICAgIGNvbnN0IGludHJvU3RyaW5nID0gZHJpdmVyVmVyc2lvblxuICAgICAgPyBgQ3JlYXRpbmcgbmV3ICR7ZHJpdmVyLm5hbWV9ICh2JHtkcml2ZXJWZXJzaW9ufSkgc2Vzc2lvbmBcbiAgICAgIDogYENyZWF0aW5nIG5ldyAke2RyaXZlci5uYW1lfSBzZXNzaW9uYDtcbiAgICBsb2cuaW5mbyhpbnRyb1N0cmluZyk7XG4gICAgbG9nLmluZm8oJ0NhcGFiaWxpdGllczonKTtcbiAgICBpbnNwZWN0T2JqZWN0KGNhcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBzZXNzaW9uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBqc29ud3BDYXBzIEpTT05XUCBmb3JtYXR0ZWQgZGVzaXJlZCBjYXBhYmlsaXRpZXNcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlcUNhcHMgUmVxdWlyZWQgY2FwYWJpbGl0aWVzIChKU09OV1Agc3RhbmRhcmQpXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB3M2NDYXBhYmlsaXRpZXMgVzNDIGNhcGFiaWxpdGllc1xuICAgKiBAcmV0dXJuIHtBcnJheX0gVW5pcXVlIHNlc3Npb24gSUQgYW5kIGNhcGFiaWxpdGllc1xuICAgKi9cbiAgYXN5bmMgY3JlYXRlU2Vzc2lvbiAoanNvbndwQ2FwcywgcmVxQ2FwcywgdzNjQ2FwYWJpbGl0aWVzKSB7XG4gICAgY29uc3Qge2RlZmF1bHRDYXBhYmlsaXRpZXN9ID0gdGhpcy5hcmdzO1xuICAgIGxldCBwcm90b2NvbDtcbiAgICBsZXQgaW5uZXJTZXNzaW9uSWQsIGRDYXBzO1xuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFBhcnNlIHRoZSBjYXBzIGludG8gYSBmb3JtYXQgdGhhdCB0aGUgSW5uZXJEcml2ZXIgd2lsbCBhY2NlcHRcbiAgICAgIGNvbnN0IHBhcnNlZENhcHMgPSBwYXJzZUNhcHNGb3JJbm5lckRyaXZlcihcbiAgICAgICAganNvbndwQ2FwcyxcbiAgICAgICAgdzNjQ2FwYWJpbGl0aWVzLFxuICAgICAgICB0aGlzLmRlc2lyZWRDYXBDb25zdHJhaW50cyxcbiAgICAgICAgZGVmYXVsdENhcGFiaWxpdGllc1xuICAgICAgKTtcblxuICAgICAgbGV0IHtkZXNpcmVkQ2FwcywgcHJvY2Vzc2VkSnNvbndwQ2FwYWJpbGl0aWVzLCBwcm9jZXNzZWRXM0NDYXBhYmlsaXRpZXMsIGVycm9yfSA9IHBhcnNlZENhcHM7XG4gICAgICBwcm90b2NvbCA9IHBhcnNlZENhcHMucHJvdG9jb2w7XG5cbiAgICAgIC8vIElmIHRoZSBwYXJzaW5nIG9mIHRoZSBjYXBzIHByb2R1Y2VkIGFuIGVycm9yLCB0aHJvdyBpdCBpbiBoZXJlXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IElubmVyRHJpdmVyID0gdGhpcy5nZXREcml2ZXJGb3JDYXBzKGRlc2lyZWRDYXBzKTtcbiAgICAgIHRoaXMucHJpbnROZXdTZXNzaW9uQW5ub3VuY2VtZW50KElubmVyRHJpdmVyLCBkZXNpcmVkQ2Fwcyk7XG5cbiAgICAgIGlmICh0aGlzLmFyZ3Muc2Vzc2lvbk92ZXJyaWRlKSB7XG4gICAgICAgIGNvbnN0IHNlc3Npb25JZHNUb0RlbGV0ZSA9IGF3YWl0IHNlc3Npb25zTGlzdEd1YXJkLmFjcXVpcmUoQXBwaXVtRHJpdmVyLm5hbWUsICgpID0+IF8ua2V5cyh0aGlzLnNlc3Npb25zKSk7XG4gICAgICAgIGlmIChzZXNzaW9uSWRzVG9EZWxldGUubGVuZ3RoKSB7XG4gICAgICAgICAgbG9nLmluZm8oYFNlc3Npb24gb3ZlcnJpZGUgaXMgb24uIERlbGV0aW5nIG90aGVyICR7c2Vzc2lvbklkc1RvRGVsZXRlLmxlbmd0aH0gYWN0aXZlIHNlc3Npb24ke3Nlc3Npb25JZHNUb0RlbGV0ZS5sZW5ndGggPyAnJyA6ICdzJ30uYCk7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IEIubWFwKHNlc3Npb25JZHNUb0RlbGV0ZSwgKGlkKSA9PiB0aGlzLmRlbGV0ZVNlc3Npb24oaWQpKTtcbiAgICAgICAgICB9IGNhdGNoIChpZ24pIHt9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IHJ1bm5pbmdEcml2ZXJzRGF0YSwgb3RoZXJQZW5kaW5nRHJpdmVyc0RhdGE7XG4gICAgICBjb25zdCBkID0gbmV3IElubmVyRHJpdmVyKHRoaXMuYXJncyk7XG4gICAgICBpZiAodGhpcy5hcmdzLnJlbGF4ZWRTZWN1cml0eUVuYWJsZWQpIHtcbiAgICAgICAgbG9nLmluZm8oYEFwcGx5aW5nIHJlbGF4ZWQgc2VjdXJpdHkgdG8gJyR7SW5uZXJEcml2ZXIubmFtZX0nIGFzIHBlciBzZXJ2ZXIgY29tbWFuZCBsaW5lIGFyZ3VtZW50YCk7XG4gICAgICAgIGQucmVsYXhlZFNlY3VyaXR5RW5hYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICAvLyBUaGlzIGFzc2lnbm1lbnQgaXMgcmVxdWlyZWQgZm9yIGNvcnJlY3Qgd2ViIHNvY2tldHMgZnVuY3Rpb25hbGl0eSBpbnNpZGUgdGhlIGRyaXZlclxuICAgICAgZC5zZXJ2ZXIgPSB0aGlzLnNlcnZlcjtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJ1bm5pbmdEcml2ZXJzRGF0YSA9IGF3YWl0IHRoaXMuY3VyU2Vzc2lvbkRhdGFGb3JEcml2ZXIoSW5uZXJEcml2ZXIpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aHJvdyBuZXcgZXJyb3JzLlNlc3Npb25Ob3RDcmVhdGVkRXJyb3IoZS5tZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHBlbmRpbmdEcml2ZXJzR3VhcmQuYWNxdWlyZShBcHBpdW1Ecml2ZXIubmFtZSwgKCkgPT4ge1xuICAgICAgICB0aGlzLnBlbmRpbmdEcml2ZXJzW0lubmVyRHJpdmVyLm5hbWVdID0gdGhpcy5wZW5kaW5nRHJpdmVyc1tJbm5lckRyaXZlci5uYW1lXSB8fCBbXTtcbiAgICAgICAgb3RoZXJQZW5kaW5nRHJpdmVyc0RhdGEgPSB0aGlzLnBlbmRpbmdEcml2ZXJzW0lubmVyRHJpdmVyLm5hbWVdLm1hcCgoZHJ2KSA9PiBkcnYuZHJpdmVyRGF0YSk7XG4gICAgICAgIHRoaXMucGVuZGluZ0RyaXZlcnNbSW5uZXJEcml2ZXIubmFtZV0ucHVzaChkKTtcbiAgICAgIH0pO1xuXG4gICAgICB0cnkge1xuICAgICAgICBbaW5uZXJTZXNzaW9uSWQsIGRDYXBzXSA9IGF3YWl0IGQuY3JlYXRlU2Vzc2lvbihcbiAgICAgICAgICBwcm9jZXNzZWRKc29ud3BDYXBhYmlsaXRpZXMsXG4gICAgICAgICAgcmVxQ2FwcyxcbiAgICAgICAgICBwcm9jZXNzZWRXM0NDYXBhYmlsaXRpZXMsXG4gICAgICAgICAgWy4uLnJ1bm5pbmdEcml2ZXJzRGF0YSwgLi4ub3RoZXJQZW5kaW5nRHJpdmVyc0RhdGFdXG4gICAgICAgICk7XG4gICAgICAgIHByb3RvY29sID0gZC5wcm90b2NvbDtcbiAgICAgICAgYXdhaXQgc2Vzc2lvbnNMaXN0R3VhcmQuYWNxdWlyZShBcHBpdW1Ecml2ZXIubmFtZSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2Vzc2lvbnNbaW5uZXJTZXNzaW9uSWRdID0gZDtcbiAgICAgICAgfSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBhd2FpdCBwZW5kaW5nRHJpdmVyc0d1YXJkLmFjcXVpcmUoQXBwaXVtRHJpdmVyLm5hbWUsICgpID0+IHtcbiAgICAgICAgICBfLnB1bGwodGhpcy5wZW5kaW5nRHJpdmVyc1tJbm5lckRyaXZlci5uYW1lXSwgZCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyB0aGlzIGlzIGFuIGFzeW5jIGZ1bmN0aW9uIGJ1dCB3ZSBkb24ndCBhd2FpdCBpdCBiZWNhdXNlIGl0IGhhbmRsZXNcbiAgICAgIC8vIGFuIG91dC1vZi1iYW5kIHByb21pc2Ugd2hpY2ggaXMgZnVsZmlsbGVkIGlmIHRoZSBpbm5lciBkcml2ZXJcbiAgICAgIC8vIHVuZXhwZWN0ZWRseSBzaHV0cyBkb3duXG4gICAgICB0aGlzLmF0dGFjaFVuZXhwZWN0ZWRTaHV0ZG93bkhhbmRsZXIoZCwgaW5uZXJTZXNzaW9uSWQpO1xuXG5cbiAgICAgIGxvZy5pbmZvKGBOZXcgJHtJbm5lckRyaXZlci5uYW1lfSBzZXNzaW9uIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5LCBzZXNzaW9uIGAgK1xuICAgICAgICAgICAgICBgJHtpbm5lclNlc3Npb25JZH0gYWRkZWQgdG8gbWFzdGVyIHNlc3Npb24gbGlzdGApO1xuXG4gICAgICAvLyBzZXQgdGhlIE5ldyBDb21tYW5kIFRpbWVvdXQgZm9yIHRoZSBpbm5lciBkcml2ZXJcbiAgICAgIGQuc3RhcnROZXdDb21tYW5kVGltZW91dCgpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwcm90b2NvbCxcbiAgICAgICAgZXJyb3IsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBwcm90b2NvbCxcbiAgICAgIHZhbHVlOiBbaW5uZXJTZXNzaW9uSWQsIGRDYXBzLCBwcm90b2NvbF1cbiAgICB9O1xuICB9XG5cbiAgYXN5bmMgYXR0YWNoVW5leHBlY3RlZFNodXRkb3duSGFuZGxlciAoZHJpdmVyLCBpbm5lclNlc3Npb25JZCkge1xuICAgIC8vIFJlbW92ZSB0aGUgc2Vzc2lvbiBvbiB1bmV4cGVjdGVkIHNodXRkb3duLCBzbyB0aGF0IHdlIGFyZSBpbiBhIHBvc2l0aW9uXG4gICAgLy8gdG8gb3BlbiBhbm90aGVyIHNlc3Npb24gbGF0ZXIgb24uXG4gICAgLy8gVE9ETzogdGhpcyBzaG91bGQgYmUgcmVtb3ZlZCBhbmQgcmVwbGFjZWQgYnkgYSBvblNodXRkb3duIGNhbGxiYWNrLlxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBkcml2ZXIub25VbmV4cGVjdGVkU2h1dGRvd247IC8vIHRoaXMgaXMgYSBjYW5jZWxsYWJsZSBwcm9taXNlXG4gICAgICAvLyBpZiB3ZSBnZXQgaGVyZSwgd2UndmUgaGFkIGFuIHVuZXhwZWN0ZWQgc2h1dGRvd24sIHNvIGVycm9yXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQgc2h1dGRvd24nKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIEIuQ2FuY2VsbGF0aW9uRXJyb3IpIHtcbiAgICAgICAgLy8gaWYgd2UgY2FuY2VsbGVkIHRoZSB1bmV4cGVjdGVkIHNodXRkb3duIHByb21pc2UsIHRoYXQgbWVhbnMgd2VcbiAgICAgICAgLy8gbm8gbG9uZ2VyIGNhcmUgYWJvdXQgaXQsIGFuZCBjYW4gc2FmZWx5IGlnbm9yZSBpdFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsb2cud2FybihgQ2xvc2luZyBzZXNzaW9uLCBjYXVzZSB3YXMgJyR7ZS5tZXNzYWdlfSdgKTtcbiAgICAgIGxvZy5pbmZvKGBSZW1vdmluZyBzZXNzaW9uICR7aW5uZXJTZXNzaW9uSWR9IGZyb20gb3VyIG1hc3RlciBzZXNzaW9uIGxpc3RgKTtcbiAgICAgIGF3YWl0IHNlc3Npb25zTGlzdEd1YXJkLmFjcXVpcmUoQXBwaXVtRHJpdmVyLm5hbWUsICgpID0+IHtcbiAgICAgICAgZGVsZXRlIHRoaXMuc2Vzc2lvbnNbaW5uZXJTZXNzaW9uSWRdO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgY3VyU2Vzc2lvbkRhdGFGb3JEcml2ZXIgKElubmVyRHJpdmVyKSB7XG4gICAgY29uc3Qgc2Vzc2lvbnMgPSBhd2FpdCBzZXNzaW9uc0xpc3RHdWFyZC5hY3F1aXJlKEFwcGl1bURyaXZlci5uYW1lLCAoKSA9PiB0aGlzLnNlc3Npb25zKTtcbiAgICBjb25zdCBkYXRhID0gXy52YWx1ZXMoc2Vzc2lvbnMpXG4gICAgICAgICAgICAgICAgICAgLmZpbHRlcigocykgPT4gcy5jb25zdHJ1Y3Rvci5uYW1lID09PSBJbm5lckRyaXZlci5uYW1lKVxuICAgICAgICAgICAgICAgICAgIC5tYXAoKHMpID0+IHMuZHJpdmVyRGF0YSk7XG4gICAgZm9yIChsZXQgZGF0dW0gb2YgZGF0YSkge1xuICAgICAgaWYgKCFkYXR1bSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFByb2JsZW0gZ2V0dGluZyBzZXNzaW9uIGRhdGEgZm9yIGRyaXZlciB0eXBlIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYCR7SW5uZXJEcml2ZXIubmFtZX07IGRvZXMgaXQgaW1wbGVtZW50ICdnZXQgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICBgZHJpdmVyRGF0YSc/YCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgYXN5bmMgZGVsZXRlU2Vzc2lvbiAoc2Vzc2lvbklkKSB7XG4gICAgbGV0IHByb3RvY29sO1xuICAgIHRyeSB7XG4gICAgICBsZXQgb3RoZXJTZXNzaW9uc0RhdGEgPSBudWxsO1xuICAgICAgbGV0IGRzdFNlc3Npb24gPSBudWxsO1xuICAgICAgYXdhaXQgc2Vzc2lvbnNMaXN0R3VhcmQuYWNxdWlyZShBcHBpdW1Ecml2ZXIubmFtZSwgKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuc2Vzc2lvbnNbc2Vzc2lvbklkXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjdXJDb25zdHJ1Y3Rvck5hbWUgPSB0aGlzLnNlc3Npb25zW3Nlc3Npb25JZF0uY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgb3RoZXJTZXNzaW9uc0RhdGEgPSBfLnRvUGFpcnModGhpcy5zZXNzaW9ucylcbiAgICAgICAgICAgICAgLmZpbHRlcigoW2tleSwgdmFsdWVdKSA9PiB2YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lID09PSBjdXJDb25zdHJ1Y3Rvck5hbWUgJiYga2V5ICE9PSBzZXNzaW9uSWQpXG4gICAgICAgICAgICAgIC5tYXAoKFssIHZhbHVlXSkgPT4gdmFsdWUuZHJpdmVyRGF0YSk7XG4gICAgICAgIGRzdFNlc3Npb24gPSB0aGlzLnNlc3Npb25zW3Nlc3Npb25JZF07XG4gICAgICAgIHByb3RvY29sID0gZHN0U2Vzc2lvbi5wcm90b2NvbDtcbiAgICAgICAgbG9nLmluZm8oYFJlbW92aW5nIHNlc3Npb24gJHtzZXNzaW9uSWR9IGZyb20gb3VyIG1hc3RlciBzZXNzaW9uIGxpc3RgKTtcbiAgICAgICAgLy8gcmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoZSBkZWxldGVTZXNzaW9uIGNvbXBsZXRlcyBzdWNjZXNzZnVsbHkgb3Igbm90XG4gICAgICAgIC8vIG1ha2UgdGhlIHNlc3Npb24gdW5hdmFpbGFibGUsIGJlY2F1c2Ugd2hvIGtub3dzIHdoYXQgc3RhdGUgaXQgbWlnaHRcbiAgICAgICAgLy8gYmUgaW4gb3RoZXJ3aXNlXG4gICAgICAgIGRlbGV0ZSB0aGlzLnNlc3Npb25zW3Nlc3Npb25JZF07XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHByb3RvY29sLFxuICAgICAgICB2YWx1ZTogYXdhaXQgZHN0U2Vzc2lvbi5kZWxldGVTZXNzaW9uKHNlc3Npb25JZCwgb3RoZXJTZXNzaW9uc0RhdGEpLFxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsb2cuZXJyb3IoYEhhZCB0cm91YmxlIGVuZGluZyBzZXNzaW9uICR7c2Vzc2lvbklkfTogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwcm90b2NvbCxcbiAgICAgICAgZXJyb3I6IGUsXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGV4ZWN1dGVDb21tYW5kIChjbWQsIC4uLmFyZ3MpIHtcbiAgICAvLyBnZXRTdGF0dXMgY29tbWFuZCBzaG91bGQgbm90IGJlIHB1dCBpbnRvIHF1ZXVlLiBJZiB3ZSBkbyBpdCBhcyBwYXJ0IG9mIHN1cGVyLmV4ZWN1dGVDb21tYW5kLCBpdCB3aWxsIGJlIGFkZGVkIHRvIHF1ZXVlLlxuICAgIC8vIFRoZXJlIHdpbGwgYmUgbG90IG9mIHN0YXR1cyBjb21tYW5kcyBpbiBxdWV1ZSBkdXJpbmcgY3JlYXRlU2Vzc2lvbiBjb21tYW5kLCBhcyBjcmVhdGVTZXNzaW9uIGNhbiB0YWtlIHVwIHRvIG9yIG1vcmUgdGhhbiBhIG1pbnV0ZS5cbiAgICBpZiAoY21kID09PSAnZ2V0U3RhdHVzJykge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0U3RhdHVzKCk7XG4gICAgfVxuXG4gICAgaWYgKGlzQXBwaXVtRHJpdmVyQ29tbWFuZChjbWQpKSB7XG4gICAgICByZXR1cm4gYXdhaXQgc3VwZXIuZXhlY3V0ZUNvbW1hbmQoY21kLCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICBjb25zdCBzZXNzaW9uSWQgPSBfLmxhc3QoYXJncyk7XG4gICAgY29uc3QgZHN0U2Vzc2lvbiA9IGF3YWl0IHNlc3Npb25zTGlzdEd1YXJkLmFjcXVpcmUoQXBwaXVtRHJpdmVyLm5hbWUsICgpID0+IHRoaXMuc2Vzc2lvbnNbc2Vzc2lvbklkXSk7XG4gICAgaWYgKCFkc3RTZXNzaW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBzZXNzaW9uIHdpdGggaWQgJyR7c2Vzc2lvbklkfScgZG9lcyBub3QgZXhpc3RgKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzID0ge1xuICAgICAgcHJvdG9jb2w6IGRzdFNlc3Npb24ucHJvdG9jb2xcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIHJlcy52YWx1ZSA9IGF3YWl0IGRzdFNlc3Npb24uZXhlY3V0ZUNvbW1hbmQoY21kLCAuLi5hcmdzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXMuZXJyb3IgPSBlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgcHJveHlBY3RpdmUgKHNlc3Npb25JZCkge1xuICAgIGNvbnN0IGRzdFNlc3Npb24gPSB0aGlzLnNlc3Npb25zW3Nlc3Npb25JZF07XG4gICAgcmV0dXJuIGRzdFNlc3Npb24gJiYgXy5pc0Z1bmN0aW9uKGRzdFNlc3Npb24ucHJveHlBY3RpdmUpICYmIGRzdFNlc3Npb24ucHJveHlBY3RpdmUoc2Vzc2lvbklkKTtcbiAgfVxuXG4gIGdldFByb3h5QXZvaWRMaXN0IChzZXNzaW9uSWQpIHtcbiAgICBjb25zdCBkc3RTZXNzaW9uID0gdGhpcy5zZXNzaW9uc1tzZXNzaW9uSWRdO1xuICAgIHJldHVybiBkc3RTZXNzaW9uID8gZHN0U2Vzc2lvbi5nZXRQcm94eUF2b2lkTGlzdCgpIDogW107XG4gIH1cblxuICBjYW5Qcm94eSAoc2Vzc2lvbklkKSB7XG4gICAgY29uc3QgZHN0U2Vzc2lvbiA9IHRoaXMuc2Vzc2lvbnNbc2Vzc2lvbklkXTtcbiAgICByZXR1cm4gZHN0U2Vzc2lvbiAmJiBkc3RTZXNzaW9uLmNhblByb3h5KHNlc3Npb25JZCk7XG4gIH1cbn1cblxuLy8gaGVscCBkZWNpZGUgd2hpY2ggY29tbWFuZHMgc2hvdWxkIGJlIHByb3hpZWQgdG8gc3ViLWRyaXZlcnMgYW5kIHdoaWNoXG4vLyBzaG91bGQgYmUgaGFuZGxlZCBieSB0aGlzLCBvdXIgdW1icmVsbGEgZHJpdmVyXG5mdW5jdGlvbiBpc0FwcGl1bURyaXZlckNvbW1hbmQgKGNtZCkge1xuICByZXR1cm4gIWlzU2Vzc2lvbkNvbW1hbmQoY21kKSB8fCBjbWQgPT09IFwiZGVsZXRlU2Vzc2lvblwiO1xufVxuXG5leHBvcnQgeyBBcHBpdW1Ecml2ZXIgfTtcbiJdLCJzb3VyY2VSb290IjoiLi4vLi4ifQ==
