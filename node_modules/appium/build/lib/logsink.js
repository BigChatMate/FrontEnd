'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _npmlog = require('npmlog');

var _npmlog2 = _interopRequireDefault(_npmlog);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _appiumSupport = require('appium-support');

var _dateformat = require('dateformat');

var _dateformat2 = _interopRequireDefault(_dateformat);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

// set up distributed logging before everything else
_appiumSupport.logger.patchLogger(_npmlog2['default']);
global._global_npmlog = _npmlog2['default'];

// npmlog is used only for emitting, we use winston for output
_npmlog2['default'].level = "silent";
var levels = {
  debug: 4,
  info: 3,
  warn: 2,
  error: 1
};

var colors = {
  info: 'cyan',
  debug: 'grey',
  warn: 'yellow',
  error: 'red'
};

var npmToWinstonLevels = {
  silly: 'debug',
  verbose: 'debug',
  debug: 'debug',
  info: 'info',
  http: 'info',
  warn: 'warn',
  error: 'error'
};

var log = null;
var timeZone = null;

function timestamp() {
  var date = new Date();
  if (!timeZone) {
    date = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
  }
  return (0, _dateformat2['default'])(date, "yyyy-mm-dd HH:MM:ss:l");
}

// Strip the color marking within messages.
// We need to patch the transports, because the stripColor functionality in
// Winston is wrongly implemented at the logger level, and we want to avoid
// having to create 2 loggers.
function applyStripColorPatch(transport) {
  var _log = transport.log.bind(transport);
  transport.log = function (level, msg, meta, callback) {
    // eslint-disable-line promise/prefer-await-to-callbacks
    var code = /\u001b\[(\d+(;\d+)*)?m/g;
    msg = ('' + msg).replace(code, '');
    _log(level, msg, meta, callback);
  };
}

function _createConsoleTransport(args, logLvl) {
  var transport = new _winston2['default'].transports.Console({
    name: "console",
    timestamp: args.logTimestamp ? timestamp : undefined,
    colorize: !args.logNoColors,
    handleExceptions: true,
    exitOnError: false,
    json: false,
    level: logLvl,
    formatter: function formatter(options) {
      var meta = options.meta && _Object$keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '';
      var timestampPrefix = '';
      if (options.timestamp) {
        timestampPrefix = options.timestamp() + ' - ';
      }
      return '' + timestampPrefix + (options.message || '') + meta;
    }
  });
  if (args.logNoColors) {
    applyStripColorPatch(transport);
  }

  return transport;
}

function _createFileTransport(args, logLvl) {
  var transport = new _winston2['default'].transports.File({
    name: "file",
    timestamp: timestamp,
    filename: args.log,
    maxFiles: 1,
    handleExceptions: true,
    exitOnError: false,
    json: false,
    level: logLvl
  });
  applyStripColorPatch(transport);
  return transport;
}

function _createHttpTransport(args, logLvl) {
  var host = null,
      port = null;

  if (args.webhook.match(':')) {
    var hostAndPort = args.webhook.split(':');
    host = hostAndPort[0];
    port = parseInt(hostAndPort[1], 10);
  }

  var transport = new _winston2['default'].transports.Http({
    name: "http",
    host: host || '127.0.0.1',
    port: port || 9003,
    path: '/',
    handleExceptions: true,
    exitOnError: false,
    json: false,
    level: logLvl
  });
  applyStripColorPatch(transport);
  return transport;
}

function _createTransports(args) {
  var transports, consoleLogLevel, fileLogLevel, lvlPair;
  return _regeneratorRuntime.async(function _createTransports$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        transports = [];
        consoleLogLevel = null;
        fileLogLevel = null;

        if (args.loglevel && args.loglevel.match(":")) {
          lvlPair = args.loglevel.split(':');

          consoleLogLevel = lvlPair[0] || consoleLogLevel;
          fileLogLevel = lvlPair[1] || fileLogLevel;
        } else {
          consoleLogLevel = fileLogLevel = args.loglevel;
        }

        transports.push(_createConsoleTransport(args, consoleLogLevel));

        if (!args.log) {
          context$1$0.next = 18;
          break;
        }

        context$1$0.prev = 6;
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(args.log));

      case 9:
        if (!context$1$0.sent) {
          context$1$0.next = 12;
          break;
        }

        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.unlink(args.log));

      case 12:

        transports.push(_createFileTransport(args, fileLogLevel));
        context$1$0.next = 18;
        break;

      case 15:
        context$1$0.prev = 15;
        context$1$0.t0 = context$1$0['catch'](6);

        // eslint-disable-next-line no-console
        console.log('Tried to attach logging to file ' + args.log + ' but an error ' + ('occurred: ' + context$1$0.t0.message));

      case 18:

        if (args.webhook) {
          try {
            transports.push(_createHttpTransport(args, fileLogLevel));
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log('Tried to attach logging to Http at ' + args.webhook + ' but ' + ('an error occurred: ' + e.message));
          }
        }

        return context$1$0.abrupt('return', transports);

      case 20:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[6, 15]]);
}

function init(args) {
  return _regeneratorRuntime.async(function init$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        // set de facto param passed to timestamp function
        timeZone = args.localTimezone;

        // by not adding colors here and not setting 'colorize' in transports
        // when logNoColors === true, console output is fully stripped of color.
        if (!args.logNoColors) {
          _winston2['default'].addColors(colors);
        }

        // clean up in case we have initted before since npmlog is a global
        // object
        clear();

        context$1$0.t0 = _winston2['default'].Logger;
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(_createTransports(args));

      case 6:
        context$1$0.t1 = context$1$0.sent;
        context$1$0.t2 = {
          transports: context$1$0.t1
        };
        log = new context$1$0.t0(context$1$0.t2);

        // Capture logs emitted via npmlog and pass them through winston
        _npmlog2['default'].on('log', function (logObj) {
          var winstonLevel = npmToWinstonLevels[logObj.level] || 'info';
          var msg = logObj.message;
          if (logObj.prefix) {
            var prefix = '[' + logObj.prefix + ']';
            msg = prefix.magenta + ' ' + msg;
          }
          log[winstonLevel](msg);
          if (args.logHandler && _lodash2['default'].isFunction(args.logHandler)) {
            args.logHandler(logObj.level, msg);
          }
        });

        log.setLevels(levels);

        // 8/19/14 this is a hack to force Winston to print debug messages to stdout rather than stderr.
        // TODO: remove this if winston provides an API for directing streams.
        if (levels[log.transports.console.level] === levels.debug) {
          log.debug = function (msg) {
            log.info('[debug] ' + msg);
          };
        }

      case 12:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function clear() {
  if (log) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(_lodash2['default'].keys(log.transports)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var transport = _step.value;

        log.remove(transport);
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
  _npmlog2['default'].removeAllListeners('log');
}

exports.init = init;
exports.clear = clear;
exports['default'] = init;

// --log-level arg can optionally provide diff logging levels for console and file, separated by a colon

// if we don't delete the log file, winston will always append and it will grow infinitely large;
// winston allows for limiting log file size, but as of 9.2.14 there's a serious bug when using
// maxFiles and maxSize together. https://github.com/flatiron/winston/issues/397
//# sourceMappingURL=data:application/json;charset=utf8;base64,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cnQgbnBtbG9nIGZyb20gJ25wbWxvZyc7XG5pbXBvcnQgd2luc3RvbiAgZnJvbSAnd2luc3Rvbic7XG5pbXBvcnQgeyBmcywgbG9nZ2VyIH0gZnJvbSAnYXBwaXVtLXN1cHBvcnQnO1xuaW1wb3J0IGRhdGVmb3JtYXQgZnJvbSAnZGF0ZWZvcm1hdCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG4vLyBzZXQgdXAgZGlzdHJpYnV0ZWQgbG9nZ2luZyBiZWZvcmUgZXZlcnl0aGluZyBlbHNlXG5sb2dnZXIucGF0Y2hMb2dnZXIobnBtbG9nKTtcbmdsb2JhbC5fZ2xvYmFsX25wbWxvZyA9IG5wbWxvZztcblxuLy8gbnBtbG9nIGlzIHVzZWQgb25seSBmb3IgZW1pdHRpbmcsIHdlIHVzZSB3aW5zdG9uIGZvciBvdXRwdXRcbm5wbWxvZy5sZXZlbCA9IFwic2lsZW50XCI7XG5jb25zdCBsZXZlbHMgPSB7XG4gIGRlYnVnOiA0LFxuICBpbmZvOiAzLFxuICB3YXJuOiAyLFxuICBlcnJvcjogMSxcbn07XG5cbmNvbnN0IGNvbG9ycyA9IHtcbiAgaW5mbzogJ2N5YW4nLFxuICBkZWJ1ZzogJ2dyZXknLFxuICB3YXJuOiAneWVsbG93JyxcbiAgZXJyb3I6ICdyZWQnLFxufTtcblxuY29uc3QgbnBtVG9XaW5zdG9uTGV2ZWxzID0ge1xuICBzaWxseTogJ2RlYnVnJyxcbiAgdmVyYm9zZTogJ2RlYnVnJyxcbiAgZGVidWc6ICdkZWJ1ZycsXG4gIGluZm86ICdpbmZvJyxcbiAgaHR0cDogJ2luZm8nLFxuICB3YXJuOiAnd2FybicsXG4gIGVycm9yOiAnZXJyb3InLFxufTtcblxubGV0IGxvZyA9IG51bGw7XG5sZXQgdGltZVpvbmUgPSBudWxsO1xuXG5mdW5jdGlvbiB0aW1lc3RhbXAgKCkge1xuICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gIGlmICghdGltZVpvbmUpIHtcbiAgICBkYXRlID0gbmV3IERhdGUoZGF0ZS52YWx1ZU9mKCkgKyBkYXRlLmdldFRpbWV6b25lT2Zmc2V0KCkgKiA2MDAwMCk7XG4gIH1cbiAgcmV0dXJuIGRhdGVmb3JtYXQoZGF0ZSwgXCJ5eXl5LW1tLWRkIEhIOk1NOnNzOmxcIik7XG59XG5cbi8vIFN0cmlwIHRoZSBjb2xvciBtYXJraW5nIHdpdGhpbiBtZXNzYWdlcy5cbi8vIFdlIG5lZWQgdG8gcGF0Y2ggdGhlIHRyYW5zcG9ydHMsIGJlY2F1c2UgdGhlIHN0cmlwQ29sb3IgZnVuY3Rpb25hbGl0eSBpblxuLy8gV2luc3RvbiBpcyB3cm9uZ2x5IGltcGxlbWVudGVkIGF0IHRoZSBsb2dnZXIgbGV2ZWwsIGFuZCB3ZSB3YW50IHRvIGF2b2lkXG4vLyBoYXZpbmcgdG8gY3JlYXRlIDIgbG9nZ2Vycy5cbmZ1bmN0aW9uIGFwcGx5U3RyaXBDb2xvclBhdGNoICh0cmFuc3BvcnQpIHtcbiAgbGV0IF9sb2cgPSB0cmFuc3BvcnQubG9nLmJpbmQodHJhbnNwb3J0KTtcbiAgdHJhbnNwb3J0LmxvZyA9IGZ1bmN0aW9uIChsZXZlbCwgbXNnLCBtZXRhLCBjYWxsYmFjaykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIHByb21pc2UvcHJlZmVyLWF3YWl0LXRvLWNhbGxiYWNrc1xuICAgIGxldCBjb2RlID0gL1xcdTAwMWJcXFsoXFxkKyg7XFxkKykqKT9tL2c7XG4gICAgbXNnID0gKCcnICsgbXNnKS5yZXBsYWNlKGNvZGUsICcnKTtcbiAgICBfbG9nKGxldmVsLCBtc2csIG1ldGEsIGNhbGxiYWNrKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUNvbnNvbGVUcmFuc3BvcnQgKGFyZ3MsIGxvZ0x2bCkge1xuICBsZXQgdHJhbnNwb3J0ID0gbmV3ICh3aW5zdG9uLnRyYW5zcG9ydHMuQ29uc29sZSkoe1xuICAgIG5hbWU6IFwiY29uc29sZVwiLFxuICAgIHRpbWVzdGFtcDogYXJncy5sb2dUaW1lc3RhbXAgPyB0aW1lc3RhbXAgOiB1bmRlZmluZWQsXG4gICAgY29sb3JpemU6ICFhcmdzLmxvZ05vQ29sb3JzLFxuICAgIGhhbmRsZUV4Y2VwdGlvbnM6IHRydWUsXG4gICAgZXhpdE9uRXJyb3I6IGZhbHNlLFxuICAgIGpzb246IGZhbHNlLFxuICAgIGxldmVsOiBsb2dMdmwsXG4gICAgZm9ybWF0dGVyIChvcHRpb25zKSB7XG4gICAgICBsZXQgbWV0YSA9IG9wdGlvbnMubWV0YSAmJiBPYmplY3Qua2V5cyhvcHRpb25zLm1ldGEpLmxlbmd0aCA/IGBcXG5cXHQke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMubWV0YSl9YCA6ICcnO1xuICAgICAgbGV0IHRpbWVzdGFtcFByZWZpeCA9ICcnO1xuICAgICAgaWYgKG9wdGlvbnMudGltZXN0YW1wKSB7XG4gICAgICAgIHRpbWVzdGFtcFByZWZpeCA9IGAke29wdGlvbnMudGltZXN0YW1wKCl9IC0gYDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBgJHt0aW1lc3RhbXBQcmVmaXh9JHtvcHRpb25zLm1lc3NhZ2UgfHwgJyd9JHttZXRhfWA7XG4gICAgfVxuICB9KTtcbiAgaWYgKGFyZ3MubG9nTm9Db2xvcnMpIHtcbiAgICBhcHBseVN0cmlwQ29sb3JQYXRjaCh0cmFuc3BvcnQpO1xuICB9XG5cbiAgcmV0dXJuIHRyYW5zcG9ydDtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUZpbGVUcmFuc3BvcnQgKGFyZ3MsIGxvZ0x2bCkge1xuICBsZXQgdHJhbnNwb3J0ID0gbmV3ICh3aW5zdG9uLnRyYW5zcG9ydHMuRmlsZSkoe1xuICAgIG5hbWU6IFwiZmlsZVwiLFxuICAgIHRpbWVzdGFtcCxcbiAgICBmaWxlbmFtZTogYXJncy5sb2csXG4gICAgbWF4RmlsZXM6IDEsXG4gICAgaGFuZGxlRXhjZXB0aW9uczogdHJ1ZSxcbiAgICBleGl0T25FcnJvcjogZmFsc2UsXG4gICAganNvbjogZmFsc2UsXG4gICAgbGV2ZWw6IGxvZ0x2bCxcbiAgfSk7XG4gIGFwcGx5U3RyaXBDb2xvclBhdGNoKHRyYW5zcG9ydCk7XG4gIHJldHVybiB0cmFuc3BvcnQ7XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVIdHRwVHJhbnNwb3J0IChhcmdzLCBsb2dMdmwpIHtcbiAgbGV0IGhvc3QgPSBudWxsLFxuICAgICAgcG9ydCA9IG51bGw7XG5cbiAgaWYgKGFyZ3Mud2ViaG9vay5tYXRjaCgnOicpKSB7XG4gICAgbGV0IGhvc3RBbmRQb3J0ID0gYXJncy53ZWJob29rLnNwbGl0KCc6Jyk7XG4gICAgaG9zdCA9IGhvc3RBbmRQb3J0WzBdO1xuICAgIHBvcnQgPSBwYXJzZUludChob3N0QW5kUG9ydFsxXSwgMTApO1xuICB9XG5cbiAgbGV0IHRyYW5zcG9ydCA9IG5ldyAod2luc3Rvbi50cmFuc3BvcnRzLkh0dHApKHtcbiAgICBuYW1lOiBcImh0dHBcIixcbiAgICBob3N0OiBob3N0IHx8ICcxMjcuMC4wLjEnLFxuICAgIHBvcnQ6IHBvcnQgfHwgOTAwMyxcbiAgICBwYXRoOiAnLycsXG4gICAgaGFuZGxlRXhjZXB0aW9uczogdHJ1ZSxcbiAgICBleGl0T25FcnJvcjogZmFsc2UsXG4gICAganNvbjogZmFsc2UsXG4gICAgbGV2ZWw6IGxvZ0x2bCxcbiAgfSk7XG4gIGFwcGx5U3RyaXBDb2xvclBhdGNoKHRyYW5zcG9ydCk7XG4gIHJldHVybiB0cmFuc3BvcnQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIF9jcmVhdGVUcmFuc3BvcnRzIChhcmdzKSB7XG4gIGxldCB0cmFuc3BvcnRzID0gW107XG4gIGxldCBjb25zb2xlTG9nTGV2ZWwgPSBudWxsO1xuICBsZXQgZmlsZUxvZ0xldmVsID0gbnVsbDtcblxuICBpZiAoYXJncy5sb2dsZXZlbCAmJiBhcmdzLmxvZ2xldmVsLm1hdGNoKFwiOlwiKSkge1xuICAgIC8vIC0tbG9nLWxldmVsIGFyZyBjYW4gb3B0aW9uYWxseSBwcm92aWRlIGRpZmYgbG9nZ2luZyBsZXZlbHMgZm9yIGNvbnNvbGUgYW5kIGZpbGUsIHNlcGFyYXRlZCBieSBhIGNvbG9uXG4gICAgbGV0IGx2bFBhaXIgPSBhcmdzLmxvZ2xldmVsLnNwbGl0KCc6Jyk7XG4gICAgY29uc29sZUxvZ0xldmVsID0gIGx2bFBhaXJbMF0gfHwgY29uc29sZUxvZ0xldmVsO1xuICAgIGZpbGVMb2dMZXZlbCA9IGx2bFBhaXJbMV0gfHwgZmlsZUxvZ0xldmVsO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGVMb2dMZXZlbCA9IGZpbGVMb2dMZXZlbCA9IGFyZ3MubG9nbGV2ZWw7XG4gIH1cblxuICB0cmFuc3BvcnRzLnB1c2goX2NyZWF0ZUNvbnNvbGVUcmFuc3BvcnQoYXJncywgY29uc29sZUxvZ0xldmVsKSk7XG5cbiAgaWYgKGFyZ3MubG9nKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIGlmIHdlIGRvbid0IGRlbGV0ZSB0aGUgbG9nIGZpbGUsIHdpbnN0b24gd2lsbCBhbHdheXMgYXBwZW5kIGFuZCBpdCB3aWxsIGdyb3cgaW5maW5pdGVseSBsYXJnZTtcbiAgICAgIC8vIHdpbnN0b24gYWxsb3dzIGZvciBsaW1pdGluZyBsb2cgZmlsZSBzaXplLCBidXQgYXMgb2YgOS4yLjE0IHRoZXJlJ3MgYSBzZXJpb3VzIGJ1ZyB3aGVuIHVzaW5nXG4gICAgICAvLyBtYXhGaWxlcyBhbmQgbWF4U2l6ZSB0b2dldGhlci4gaHR0cHM6Ly9naXRodWIuY29tL2ZsYXRpcm9uL3dpbnN0b24vaXNzdWVzLzM5N1xuICAgICAgaWYgKGF3YWl0IGZzLmV4aXN0cyhhcmdzLmxvZykpIHtcbiAgICAgICAgYXdhaXQgZnMudW5saW5rKGFyZ3MubG9nKTtcbiAgICAgIH1cblxuICAgICAgdHJhbnNwb3J0cy5wdXNoKF9jcmVhdGVGaWxlVHJhbnNwb3J0KGFyZ3MsIGZpbGVMb2dMZXZlbCkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmxvZyhgVHJpZWQgdG8gYXR0YWNoIGxvZ2dpbmcgdG8gZmlsZSAke2FyZ3MubG9nfSBidXQgYW4gZXJyb3IgYCArXG4gICAgICAgICAgICAgICAgICBgb2NjdXJyZWQ6ICR7ZS5tZXNzYWdlfWApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChhcmdzLndlYmhvb2spIHtcbiAgICB0cnkge1xuICAgICAgdHJhbnNwb3J0cy5wdXNoKF9jcmVhdGVIdHRwVHJhbnNwb3J0KGFyZ3MsIGZpbGVMb2dMZXZlbCkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmxvZyhgVHJpZWQgdG8gYXR0YWNoIGxvZ2dpbmcgdG8gSHR0cCBhdCAke2FyZ3Mud2ViaG9va30gYnV0IGAgK1xuICAgICAgICAgICAgICAgICAgYGFuIGVycm9yIG9jY3VycmVkOiAke2UubWVzc2FnZX1gKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJhbnNwb3J0cztcbn1cblxuYXN5bmMgZnVuY3Rpb24gaW5pdCAoYXJncykge1xuICAvLyBzZXQgZGUgZmFjdG8gcGFyYW0gcGFzc2VkIHRvIHRpbWVzdGFtcCBmdW5jdGlvblxuICB0aW1lWm9uZSA9IGFyZ3MubG9jYWxUaW1lem9uZTtcblxuICAvLyBieSBub3QgYWRkaW5nIGNvbG9ycyBoZXJlIGFuZCBub3Qgc2V0dGluZyAnY29sb3JpemUnIGluIHRyYW5zcG9ydHNcbiAgLy8gd2hlbiBsb2dOb0NvbG9ycyA9PT0gdHJ1ZSwgY29uc29sZSBvdXRwdXQgaXMgZnVsbHkgc3RyaXBwZWQgb2YgY29sb3IuXG4gIGlmICghYXJncy5sb2dOb0NvbG9ycykge1xuICAgIHdpbnN0b24uYWRkQ29sb3JzKGNvbG9ycyk7XG4gIH1cblxuICAvLyBjbGVhbiB1cCBpbiBjYXNlIHdlIGhhdmUgaW5pdHRlZCBiZWZvcmUgc2luY2UgbnBtbG9nIGlzIGEgZ2xvYmFsXG4gIC8vIG9iamVjdFxuICBjbGVhcigpO1xuXG4gIGxvZyA9IG5ldyAod2luc3Rvbi5Mb2dnZXIpKHtcbiAgICB0cmFuc3BvcnRzOiBhd2FpdCBfY3JlYXRlVHJhbnNwb3J0cyhhcmdzKVxuICB9KTtcblxuICAvLyBDYXB0dXJlIGxvZ3MgZW1pdHRlZCB2aWEgbnBtbG9nIGFuZCBwYXNzIHRoZW0gdGhyb3VnaCB3aW5zdG9uXG4gIG5wbWxvZy5vbignbG9nJywgKGxvZ09iaikgPT4ge1xuICAgIGxldCB3aW5zdG9uTGV2ZWwgPSBucG1Ub1dpbnN0b25MZXZlbHNbbG9nT2JqLmxldmVsXSB8fCAnaW5mbyc7XG4gICAgbGV0IG1zZyA9IGxvZ09iai5tZXNzYWdlO1xuICAgIGlmIChsb2dPYmoucHJlZml4KSB7XG4gICAgICBsZXQgcHJlZml4ID0gYFske2xvZ09iai5wcmVmaXh9XWA7XG4gICAgICBtc2cgPSBgJHtwcmVmaXgubWFnZW50YX0gJHttc2d9YDtcbiAgICB9XG4gICAgbG9nW3dpbnN0b25MZXZlbF0obXNnKTtcbiAgICBpZiAoYXJncy5sb2dIYW5kbGVyICYmIF8uaXNGdW5jdGlvbihhcmdzLmxvZ0hhbmRsZXIpKSB7XG4gICAgICBhcmdzLmxvZ0hhbmRsZXIobG9nT2JqLmxldmVsLCBtc2cpO1xuICAgIH1cblxuICB9KTtcblxuXG4gIGxvZy5zZXRMZXZlbHMobGV2ZWxzKTtcblxuICAvLyA4LzE5LzE0IHRoaXMgaXMgYSBoYWNrIHRvIGZvcmNlIFdpbnN0b24gdG8gcHJpbnQgZGVidWcgbWVzc2FnZXMgdG8gc3Rkb3V0IHJhdGhlciB0aGFuIHN0ZGVyci5cbiAgLy8gVE9ETzogcmVtb3ZlIHRoaXMgaWYgd2luc3RvbiBwcm92aWRlcyBhbiBBUEkgZm9yIGRpcmVjdGluZyBzdHJlYW1zLlxuICBpZiAobGV2ZWxzW2xvZy50cmFuc3BvcnRzLmNvbnNvbGUubGV2ZWxdID09PSBsZXZlbHMuZGVidWcpIHtcbiAgICBsb2cuZGVidWcgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgICBsb2cuaW5mbyhgW2RlYnVnXSAke21zZ31gKTtcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFyICgpIHtcbiAgaWYgKGxvZykge1xuICAgIGZvciAobGV0IHRyYW5zcG9ydCBvZiBfLmtleXMobG9nLnRyYW5zcG9ydHMpKSB7XG4gICAgICBsb2cucmVtb3ZlKHRyYW5zcG9ydCk7XG4gICAgfVxuICB9XG4gIG5wbWxvZy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ2xvZycpO1xufVxuXG5cbmV4cG9ydCB7IGluaXQsIGNsZWFyIH07XG5leHBvcnQgZGVmYXVsdCBpbml0O1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLiJ9
