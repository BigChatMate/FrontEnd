#!/usr/bin/env node

require('source-map-support').install();

'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _logsink = require('./logsink');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

// logger needs to remain first of imports

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _appiumBaseDriver = require('appium-base-driver');

var _asyncbox = require('asyncbox');

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _config = require('./config');

var _appium = require('./appium');

var _gridRegister = require('./grid-register');

var _gridRegister2 = _interopRequireDefault(_gridRegister);

var _utils = require('./utils');

function preflightChecks(parser, args) {
  var throwInsteadOfExit = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
  return _regeneratorRuntime.async(function preflightChecks$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;

        (0, _config.checkNodeOk)();
        if (args.longStacktrace) {
          require('longjohn').async_trace_limit = -1;
        }

        if (!args.showConfig) {
          context$1$0.next = 7;
          break;
        }

        context$1$0.next = 6;
        return _regeneratorRuntime.awrap((0, _config.showConfig)());

      case 6:
        process.exit(0);

      case 7:
        (0, _config.warnNodeDeprecations)();
        (0, _config.validateServerArgs)(parser, args);

        if (!args.tmpDir) {
          context$1$0.next = 12;
          break;
        }

        context$1$0.next = 12;
        return _regeneratorRuntime.awrap((0, _config.validateTmpDir)(args.tmpDir));

      case 12:
        context$1$0.next = 20;
        break;

      case 14:
        context$1$0.prev = 14;
        context$1$0.t0 = context$1$0['catch'](0);

        _logger2['default'].error(context$1$0.t0.message.red);

        if (!throwInsteadOfExit) {
          context$1$0.next = 19;
          break;
        }

        throw context$1$0.t0;

      case 19:

        process.exit(1);

      case 20:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 14]]);
}

function logDeprecationWarning(deprecatedArgs) {
  _logger2['default'].warn('Deprecated server args:');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(_lodash2['default'].toPairs(deprecatedArgs)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var arg = _step$value[0];
      var realArg = _step$value[1];

      _logger2['default'].warn('  ' + arg.red + ' => ' + realArg);
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

function logNonDefaultArgsWarning(args) {
  _logger2['default'].info('Non-default server args:');
  (0, _utils.inspectObject)(args);
}

function logDefaultCapabilitiesWarning(caps) {
  _logger2['default'].info('Default capabilities, which will be added to each request ' + 'unless overridden by desired capabilities:');
  (0, _utils.inspectObject)(caps);
}

function logStartupInfo(parser, args) {
  var welcome, appiumRev, showArgs, deprecatedArgs;
  return _regeneratorRuntime.async(function logStartupInfo$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        welcome = 'Welcome to Appium v' + _config.APPIUM_VER;
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap((0, _config.getGitRev)());

      case 3:
        appiumRev = context$1$0.sent;

        if (appiumRev) {
          welcome += ' (REV ' + appiumRev + ')';
        }
        _logger2['default'].info(welcome);

        showArgs = (0, _config.getNonDefaultArgs)(parser, args);

        if (_lodash2['default'].size(showArgs)) {
          logNonDefaultArgsWarning(showArgs);
        }
        deprecatedArgs = (0, _config.getDeprecatedArgs)(parser, args);

        if (_lodash2['default'].size(deprecatedArgs)) {
          logDeprecationWarning(deprecatedArgs);
        }
        if (!_lodash2['default'].isEmpty(args.defaultCapabilities)) {
          logDefaultCapabilitiesWarning(args.defaultCapabilities);
        }
        // TODO: bring back loglevel reporting below once logger is flushed out
        //logger.info('Console LogLevel: ' + logger.transports.console.level);
        //if (logger.transports.file) {
        //logger.info('File LogLevel: ' + logger.transports.file.level);
        //}

      case 11:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function logServerPort(address, port) {
  var logMessage = 'Appium REST http interface listener started on ' + (address + ':' + port);
  _logger2['default'].info(logMessage);
}

function initHeapdump(args) {
  if (args.heapdumpEnabled) {
    require('heapdump');
  }
}

function main() {
  var args = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
  var parser, throwInsteadOfExit, appiumDriver, router, server;
  return _regeneratorRuntime.async(function main$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        parser = (0, _parser2['default'])();
        throwInsteadOfExit = false;

        if (args) {
          // a containing package passed in their own args, let's fill them out
          // with defaults
          args = _Object$assign({}, (0, _parser.getDefaultArgs)(), args);

          // if we have a containing package instead of running as a CLI process,
          // that package might not appreciate us calling 'process.exit' willy-
          // nilly, so give it the option to have us throw instead of exit
          if (args.throwInsteadOfExit) {
            throwInsteadOfExit = true;
            // but remove it since it's not a real server arg per se
            delete args.throwInsteadOfExit;
          }
        } else {
          // otherwise parse from CLI
          args = parser.parseArgs();
        }
        initHeapdump(args);
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap((0, _logsink.init)(args));

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(preflightChecks(parser, args, throwInsteadOfExit));

      case 8:
        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(logStartupInfo(parser, args));

      case 10:
        appiumDriver = new _appium.AppiumDriver(args);
        router = (0, _appiumBaseDriver.routeConfiguringFunction)(appiumDriver);
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap((0, _appiumBaseDriver.server)(router, args.port, args.address));

      case 14:
        server = context$1$0.sent;

        appiumDriver.server = server;
        context$1$0.prev = 16;

        if (!(args.nodeconfig !== null)) {
          context$1$0.next = 20;
          break;
        }

        context$1$0.next = 20;
        return _regeneratorRuntime.awrap((0, _gridRegister2['default'])(args.nodeconfig, args.address, args.port));

      case 20:
        context$1$0.next = 27;
        break;

      case 22:
        context$1$0.prev = 22;
        context$1$0.t0 = context$1$0['catch'](16);
        context$1$0.next = 26;
        return _regeneratorRuntime.awrap(server.close());

      case 26:
        throw context$1$0.t0;

      case 27:

        process.once('SIGINT', function callee$1$0() {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                _logger2['default'].info('Received SIGINT - shutting down');
                context$2$0.next = 3;
                return _regeneratorRuntime.awrap(server.close());

              case 3:
              case 'end':
                return context$2$0.stop();
            }
          }, null, this);
        });

        process.once('SIGTERM', function callee$1$0() {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                _logger2['default'].info('Received SIGTERM - shutting down');
                context$2$0.next = 3;
                return _regeneratorRuntime.awrap(server.close());

              case 3:
              case 'end':
                return context$2$0.stop();
            }
          }, null, this);
        });

        logServerPort(args.address, args.port);

        return context$1$0.abrupt('return', server);

      case 31:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[16, 22]]);
}

if (require.main === module) {
  (0, _asyncbox.asyncify)(main);
}

exports.main = main;

// TODO prelaunch if args.launch is set
// TODO: startAlertSocket(server, appiumServer);

// configure as node on grid, if necessary
//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7O2NBTXZCLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFBOzs7Ozs7eUNBQ3BCLCtCQUFhLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDOzs7Ozs7Ozs7O3lDQUd4RCxNQUFNLENBQUMsS0FBSyxFQUFFOzs7Ozs7O0FBSXRCLGVBQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFOzs7O0FBQ3JCLG9DQUFPLElBQUksbUNBQW1DLENBQUM7O2lEQUN6QyxNQUFNLENBQUMsS0FBSyxFQUFFOzs7Ozs7O1NBQ3JCLENBQUMsQ0FBQzs7QUFFSCxlQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTs7OztBQUN0QixvQ0FBTyxJQUFJLG9DQUFvQyxDQUFDOztpREFDMUMsTUFBTSxDQUFDLEtBQUssRUFBRTs7Ozs7OztTQUNyQixDQUFDLENBQUM7O0FBRUgscUJBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7NENBRWhDLE1BQU07Ozs7Ozs7Q0FDZDs7QUFFRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO0FBQzNCLDBCQUFTLElBQUksQ0FBQyxDQUFDO0NBQ2hCOztRQUVRLElBQUksR0FBSixJQUFJIiwiZmlsZSI6ImxpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vLyB0cmFuc3BpbGU6bWFpblxuXG5pbXBvcnQgeyBpbml0IGFzIGxvZ3NpbmtJbml0IH0gZnJvbSAnLi9sb2dzaW5rJztcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi9sb2dnZXInOyAvLyBsb2dnZXIgbmVlZHMgdG8gcmVtYWluIGZpcnN0IG9mIGltcG9ydHNcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBzZXJ2ZXIgYXMgYmFzZVNlcnZlciwgcm91dGVDb25maWd1cmluZ0Z1bmN0aW9uIH0gZnJvbSAnYXBwaXVtLWJhc2UtZHJpdmVyJztcbmltcG9ydCB7IGFzeW5jaWZ5IH0gZnJvbSAnYXN5bmNib3gnO1xuaW1wb3J0IHsgZGVmYXVsdCBhcyBnZXRQYXJzZXIsIGdldERlZmF1bHRBcmdzIH0gZnJvbSAnLi9wYXJzZXInO1xuaW1wb3J0IHsgc2hvd0NvbmZpZywgY2hlY2tOb2RlT2ssIHZhbGlkYXRlU2VydmVyQXJncyxcbiAgICAgICAgIHdhcm5Ob2RlRGVwcmVjYXRpb25zLCB2YWxpZGF0ZVRtcERpciwgZ2V0Tm9uRGVmYXVsdEFyZ3MsXG4gICAgICAgICBnZXREZXByZWNhdGVkQXJncywgZ2V0R2l0UmV2LCBBUFBJVU1fVkVSIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgQXBwaXVtRHJpdmVyIH0gZnJvbSAnLi9hcHBpdW0nO1xuaW1wb3J0IHJlZ2lzdGVyTm9kZSBmcm9tICcuL2dyaWQtcmVnaXN0ZXInO1xuaW1wb3J0IHsgaW5zcGVjdE9iamVjdCB9IGZyb20gJy4vdXRpbHMnO1xuXG5cbmFzeW5jIGZ1bmN0aW9uIHByZWZsaWdodENoZWNrcyAocGFyc2VyLCBhcmdzLCB0aHJvd0luc3RlYWRPZkV4aXQgPSBmYWxzZSkge1xuICB0cnkge1xuICAgIGNoZWNrTm9kZU9rKCk7XG4gICAgaWYgKGFyZ3MubG9uZ1N0YWNrdHJhY2UpIHtcbiAgICAgIHJlcXVpcmUoJ2xvbmdqb2huJykuYXN5bmNfdHJhY2VfbGltaXQgPSAtMTtcbiAgICB9XG4gICAgaWYgKGFyZ3Muc2hvd0NvbmZpZykge1xuICAgICAgYXdhaXQgc2hvd0NvbmZpZygpO1xuICAgICAgcHJvY2Vzcy5leGl0KDApO1xuICAgIH1cbiAgICB3YXJuTm9kZURlcHJlY2F0aW9ucygpO1xuICAgIHZhbGlkYXRlU2VydmVyQXJncyhwYXJzZXIsIGFyZ3MpO1xuICAgIGlmIChhcmdzLnRtcERpcikge1xuICAgICAgYXdhaXQgdmFsaWRhdGVUbXBEaXIoYXJncy50bXBEaXIpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbG9nZ2VyLmVycm9yKGVyci5tZXNzYWdlLnJlZCk7XG4gICAgaWYgKHRocm93SW5zdGVhZE9mRXhpdCkge1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cblxuICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBsb2dEZXByZWNhdGlvbldhcm5pbmcgKGRlcHJlY2F0ZWRBcmdzKSB7XG4gIGxvZ2dlci53YXJuKCdEZXByZWNhdGVkIHNlcnZlciBhcmdzOicpO1xuICBmb3IgKGxldCBbYXJnLCByZWFsQXJnXSBvZiBfLnRvUGFpcnMoZGVwcmVjYXRlZEFyZ3MpKSB7XG4gICAgbG9nZ2VyLndhcm4oYCAgJHthcmcucmVkfSA9PiAke3JlYWxBcmd9YCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbG9nTm9uRGVmYXVsdEFyZ3NXYXJuaW5nIChhcmdzKSB7XG4gIGxvZ2dlci5pbmZvKCdOb24tZGVmYXVsdCBzZXJ2ZXIgYXJnczonKTtcbiAgaW5zcGVjdE9iamVjdChhcmdzKTtcbn1cblxuZnVuY3Rpb24gbG9nRGVmYXVsdENhcGFiaWxpdGllc1dhcm5pbmcgKGNhcHMpIHtcbiAgbG9nZ2VyLmluZm8oJ0RlZmF1bHQgY2FwYWJpbGl0aWVzLCB3aGljaCB3aWxsIGJlIGFkZGVkIHRvIGVhY2ggcmVxdWVzdCAnICtcbiAgICAgICAgICAgICAgJ3VubGVzcyBvdmVycmlkZGVuIGJ5IGRlc2lyZWQgY2FwYWJpbGl0aWVzOicpO1xuICBpbnNwZWN0T2JqZWN0KGNhcHMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBsb2dTdGFydHVwSW5mbyAocGFyc2VyLCBhcmdzKSB7XG4gIGxldCB3ZWxjb21lID0gYFdlbGNvbWUgdG8gQXBwaXVtIHYke0FQUElVTV9WRVJ9YDtcbiAgbGV0IGFwcGl1bVJldiA9IGF3YWl0IGdldEdpdFJldigpO1xuICBpZiAoYXBwaXVtUmV2KSB7XG4gICAgd2VsY29tZSArPSBgIChSRVYgJHthcHBpdW1SZXZ9KWA7XG4gIH1cbiAgbG9nZ2VyLmluZm8od2VsY29tZSk7XG5cbiAgbGV0IHNob3dBcmdzID0gZ2V0Tm9uRGVmYXVsdEFyZ3MocGFyc2VyLCBhcmdzKTtcbiAgaWYgKF8uc2l6ZShzaG93QXJncykpIHtcbiAgICBsb2dOb25EZWZhdWx0QXJnc1dhcm5pbmcoc2hvd0FyZ3MpO1xuICB9XG4gIGxldCBkZXByZWNhdGVkQXJncyA9IGdldERlcHJlY2F0ZWRBcmdzKHBhcnNlciwgYXJncyk7XG4gIGlmIChfLnNpemUoZGVwcmVjYXRlZEFyZ3MpKSB7XG4gICAgbG9nRGVwcmVjYXRpb25XYXJuaW5nKGRlcHJlY2F0ZWRBcmdzKTtcbiAgfVxuICBpZiAoIV8uaXNFbXB0eShhcmdzLmRlZmF1bHRDYXBhYmlsaXRpZXMpKSB7XG4gICAgbG9nRGVmYXVsdENhcGFiaWxpdGllc1dhcm5pbmcoYXJncy5kZWZhdWx0Q2FwYWJpbGl0aWVzKTtcbiAgfVxuICAvLyBUT0RPOiBicmluZyBiYWNrIGxvZ2xldmVsIHJlcG9ydGluZyBiZWxvdyBvbmNlIGxvZ2dlciBpcyBmbHVzaGVkIG91dFxuICAvL2xvZ2dlci5pbmZvKCdDb25zb2xlIExvZ0xldmVsOiAnICsgbG9nZ2VyLnRyYW5zcG9ydHMuY29uc29sZS5sZXZlbCk7XG4gIC8vaWYgKGxvZ2dlci50cmFuc3BvcnRzLmZpbGUpIHtcbiAgICAvL2xvZ2dlci5pbmZvKCdGaWxlIExvZ0xldmVsOiAnICsgbG9nZ2VyLnRyYW5zcG9ydHMuZmlsZS5sZXZlbCk7XG4gIC8vfVxufVxuXG5mdW5jdGlvbiBsb2dTZXJ2ZXJQb3J0IChhZGRyZXNzLCBwb3J0KSB7XG4gIGxldCBsb2dNZXNzYWdlID0gYEFwcGl1bSBSRVNUIGh0dHAgaW50ZXJmYWNlIGxpc3RlbmVyIHN0YXJ0ZWQgb24gYCArXG4gICAgICAgICAgICAgICAgICAgYCR7YWRkcmVzc306JHtwb3J0fWA7XG4gIGxvZ2dlci5pbmZvKGxvZ01lc3NhZ2UpO1xufVxuXG5mdW5jdGlvbiBpbml0SGVhcGR1bXAgKGFyZ3MpIHtcbiAgaWYgKGFyZ3MuaGVhcGR1bXBFbmFibGVkKSB7XG4gICAgcmVxdWlyZSgnaGVhcGR1bXAnKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBtYWluIChhcmdzID0gbnVsbCkge1xuICBsZXQgcGFyc2VyID0gZ2V0UGFyc2VyKCk7XG4gIGxldCB0aHJvd0luc3RlYWRPZkV4aXQgPSBmYWxzZTtcbiAgaWYgKGFyZ3MpIHtcbiAgICAvLyBhIGNvbnRhaW5pbmcgcGFja2FnZSBwYXNzZWQgaW4gdGhlaXIgb3duIGFyZ3MsIGxldCdzIGZpbGwgdGhlbSBvdXRcbiAgICAvLyB3aXRoIGRlZmF1bHRzXG4gICAgYXJncyA9IE9iamVjdC5hc3NpZ24oe30sIGdldERlZmF1bHRBcmdzKCksIGFyZ3MpO1xuXG4gICAgLy8gaWYgd2UgaGF2ZSBhIGNvbnRhaW5pbmcgcGFja2FnZSBpbnN0ZWFkIG9mIHJ1bm5pbmcgYXMgYSBDTEkgcHJvY2VzcyxcbiAgICAvLyB0aGF0IHBhY2thZ2UgbWlnaHQgbm90IGFwcHJlY2lhdGUgdXMgY2FsbGluZyAncHJvY2Vzcy5leGl0JyB3aWxseS1cbiAgICAvLyBuaWxseSwgc28gZ2l2ZSBpdCB0aGUgb3B0aW9uIHRvIGhhdmUgdXMgdGhyb3cgaW5zdGVhZCBvZiBleGl0XG4gICAgaWYgKGFyZ3MudGhyb3dJbnN0ZWFkT2ZFeGl0KSB7XG4gICAgICB0aHJvd0luc3RlYWRPZkV4aXQgPSB0cnVlO1xuICAgICAgLy8gYnV0IHJlbW92ZSBpdCBzaW5jZSBpdCdzIG5vdCBhIHJlYWwgc2VydmVyIGFyZyBwZXIgc2VcbiAgICAgIGRlbGV0ZSBhcmdzLnRocm93SW5zdGVhZE9mRXhpdDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gb3RoZXJ3aXNlIHBhcnNlIGZyb20gQ0xJXG4gICAgYXJncyA9IHBhcnNlci5wYXJzZUFyZ3MoKTtcbiAgfVxuICBpbml0SGVhcGR1bXAoYXJncyk7XG4gIGF3YWl0IGxvZ3NpbmtJbml0KGFyZ3MpO1xuICBhd2FpdCBwcmVmbGlnaHRDaGVja3MocGFyc2VyLCBhcmdzLCB0aHJvd0luc3RlYWRPZkV4aXQpO1xuICBhd2FpdCBsb2dTdGFydHVwSW5mbyhwYXJzZXIsIGFyZ3MpO1xuICBsZXQgYXBwaXVtRHJpdmVyID0gbmV3IEFwcGl1bURyaXZlcihhcmdzKTtcbiAgbGV0IHJvdXRlciA9IHJvdXRlQ29uZmlndXJpbmdGdW5jdGlvbihhcHBpdW1Ecml2ZXIpO1xuICBsZXQgc2VydmVyID0gYXdhaXQgYmFzZVNlcnZlcihyb3V0ZXIsIGFyZ3MucG9ydCwgYXJncy5hZGRyZXNzKTtcbiAgYXBwaXVtRHJpdmVyLnNlcnZlciA9IHNlcnZlcjtcbiAgdHJ5IHtcbiAgICAvLyBUT0RPIHByZWxhdW5jaCBpZiBhcmdzLmxhdW5jaCBpcyBzZXRcbiAgICAvLyBUT0RPOiBzdGFydEFsZXJ0U29ja2V0KHNlcnZlciwgYXBwaXVtU2VydmVyKTtcblxuICAgIC8vIGNvbmZpZ3VyZSBhcyBub2RlIG9uIGdyaWQsIGlmIG5lY2Vzc2FyeVxuICAgIGlmIChhcmdzLm5vZGVjb25maWcgIT09IG51bGwpIHtcbiAgICAgIGF3YWl0IHJlZ2lzdGVyTm9kZShhcmdzLm5vZGVjb25maWcsIGFyZ3MuYWRkcmVzcywgYXJncy5wb3J0KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGF3YWl0IHNlcnZlci5jbG9zZSgpO1xuICAgIHRocm93IGVycjtcbiAgfVxuXG4gIHByb2Nlc3Mub25jZSgnU0lHSU5UJywgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIGxvZ2dlci5pbmZvKGBSZWNlaXZlZCBTSUdJTlQgLSBzaHV0dGluZyBkb3duYCk7XG4gICAgYXdhaXQgc2VydmVyLmNsb3NlKCk7XG4gIH0pO1xuXG4gIHByb2Nlc3Mub25jZSgnU0lHVEVSTScsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICBsb2dnZXIuaW5mbyhgUmVjZWl2ZWQgU0lHVEVSTSAtIHNodXR0aW5nIGRvd25gKTtcbiAgICBhd2FpdCBzZXJ2ZXIuY2xvc2UoKTtcbiAgfSk7XG5cbiAgbG9nU2VydmVyUG9ydChhcmdzLmFkZHJlc3MsIGFyZ3MucG9ydCk7XG5cbiAgcmV0dXJuIHNlcnZlcjtcbn1cblxuaWYgKHJlcXVpcmUubWFpbiA9PT0gbW9kdWxlKSB7XG4gIGFzeW5jaWZ5KG1haW4pO1xufVxuXG5leHBvcnQgeyBtYWluIH07XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uIn0=
