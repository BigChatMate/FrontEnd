'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _appiumSupport = require('appium-support');

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _teen_process = require('teen_process');

var _utils = require('./utils');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var APPIUM_VER = require(_path2['default'].resolve(_utils.rootDir, 'package.json')).version;
var GIT_META_ROOT = '.git';
var GIT_BINARY = 'git' + (_appiumSupport.system.isWindows() ? '.exe' : '');
var GITHUB_API = 'https://api.github.com/repos/appium/appium';
var BUILD_INFO = {
  version: APPIUM_VER
};

function getNodeVersion() {
  // expect v<major>.<minor>.<patch>
  // we will pull out `major` and `minor`
  var version = process.version.match(/^v(\d+)\.(\d+)/);
  return [Number(version[1]), Number(version[2])];
}

function updateBuildInfo() {
  var sha, built;
  return _regeneratorRuntime.async(function updateBuildInfo$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(getGitRev(true));

      case 2:
        sha = context$1$0.sent;

        if (sha) {
          context$1$0.next = 5;
          break;
        }

        return context$1$0.abrupt('return');

      case 5:
        BUILD_INFO['git-sha'] = sha;
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(getGitTimestamp(sha, true));

      case 8:
        built = context$1$0.sent;

        if (!_lodash2['default'].isEmpty(built)) {
          BUILD_INFO.built = built;
        }

      case 10:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function getGitRev() {
  var useGitHubFallback = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

  var _ref, stdout, response, resBodyObj, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, _name, commit;

  return _regeneratorRuntime.async(function getGitRev$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(_path2['default'].resolve(_utils.rootDir, GIT_META_ROOT)));

      case 2:
        if (!context$1$0.sent) {
          context$1$0.next = 14;
          break;
        }

        context$1$0.prev = 3;
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap((0, _teen_process.exec)(GIT_BINARY, ['rev-parse', 'HEAD'], {
          cwd: _utils.rootDir
        }));

      case 6:
        _ref = context$1$0.sent;
        stdout = _ref.stdout;
        return context$1$0.abrupt('return', stdout.trim());

      case 11:
        context$1$0.prev = 11;
        context$1$0.t0 = context$1$0['catch'](3);

        _logger2['default'].warn('Cannot retrieve git revision for Appium version ' + APPIUM_VER + ' from the local repository. ' + ('Original error: ' + context$1$0.t0.message));

      case 14:
        if (useGitHubFallback) {
          context$1$0.next = 16;
          break;
        }

        return context$1$0.abrupt('return', null);

      case 16:
        context$1$0.prev = 16;
        context$1$0.next = 19;
        return _regeneratorRuntime.awrap(_requestPromise2['default'].get(GITHUB_API + '/tags', {
          headers: {
            'User-Agent': 'Appium ' + APPIUM_VER
          }
        }));

      case 19:
        response = context$1$0.sent;
        resBodyObj = _appiumSupport.util.safeJsonParse(response);

        if (!_lodash2['default'].isArray(resBodyObj)) {
          context$1$0.next = 50;
          break;
        }

        _iteratorNormalCompletion = true;
        _didIteratorError = false;
        _iteratorError = undefined;
        context$1$0.prev = 25;
        _iterator = _getIterator(resBodyObj);

      case 27:
        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
          context$1$0.next = 36;
          break;
        }

        _step$value = _step.value;
        _name = _step$value.name;
        commit = _step$value.commit;

        if (!(_name === 'v' + APPIUM_VER && commit && commit.sha)) {
          context$1$0.next = 33;
          break;
        }

        return context$1$0.abrupt('return', commit.sha);

      case 33:
        _iteratorNormalCompletion = true;
        context$1$0.next = 27;
        break;

      case 36:
        context$1$0.next = 42;
        break;

      case 38:
        context$1$0.prev = 38;
        context$1$0.t1 = context$1$0['catch'](25);
        _didIteratorError = true;
        _iteratorError = context$1$0.t1;

      case 42:
        context$1$0.prev = 42;
        context$1$0.prev = 43;

        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }

      case 45:
        context$1$0.prev = 45;

        if (!_didIteratorError) {
          context$1$0.next = 48;
          break;
        }

        throw _iteratorError;

      case 48:
        return context$1$0.finish(45);

      case 49:
        return context$1$0.finish(42);

      case 50:
        context$1$0.next = 55;
        break;

      case 52:
        context$1$0.prev = 52;
        context$1$0.t2 = context$1$0['catch'](16);

        _logger2['default'].warn('Cannot retrieve git revision for Appium version ' + APPIUM_VER + ' from GitHub. ' + ('Original error: ' + context$1$0.t2.message));

      case 55:
        return context$1$0.abrupt('return', null);

      case 56:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[3, 11], [16, 52], [25, 38, 42, 50], [43,, 45, 49]]);
}

function getGitTimestamp(commitSha) {
  var useGitHubFallback = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  var _ref2, stdout, response, resBodyObj;

  return _regeneratorRuntime.async(function getGitTimestamp$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(_path2['default'].resolve(_utils.rootDir, GIT_META_ROOT)));

      case 2:
        if (!context$1$0.sent) {
          context$1$0.next = 14;
          break;
        }

        context$1$0.prev = 3;
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap((0, _teen_process.exec)(GIT_BINARY, ['show', '-s', '--format=%ci', commitSha], {
          cwd: _utils.rootDir
        }));

      case 6:
        _ref2 = context$1$0.sent;
        stdout = _ref2.stdout;
        return context$1$0.abrupt('return', stdout.trim());

      case 11:
        context$1$0.prev = 11;
        context$1$0.t0 = context$1$0['catch'](3);

        _logger2['default'].warn('Cannot retrieve the timestamp for Appium git commit ' + commitSha + ' from the local repository. ' + ('Original error: ' + context$1$0.t0.message));

      case 14:
        if (useGitHubFallback) {
          context$1$0.next = 16;
          break;
        }

        return context$1$0.abrupt('return', null);

      case 16:
        context$1$0.prev = 16;
        context$1$0.next = 19;
        return _regeneratorRuntime.awrap(_requestPromise2['default'].get(GITHUB_API + '/commits/' + commitSha, {
          headers: {
            'User-Agent': 'Appium ' + APPIUM_VER
          }
        }));

      case 19:
        response = context$1$0.sent;
        resBodyObj = _appiumSupport.util.safeJsonParse(response);

        if (!(resBodyObj && resBodyObj.commit)) {
          context$1$0.next = 26;
          break;
        }

        if (!(resBodyObj.commit.committer && resBodyObj.commit.committer.date)) {
          context$1$0.next = 24;
          break;
        }

        return context$1$0.abrupt('return', resBodyObj.commit.committer.date);

      case 24:
        if (!(resBodyObj.commit.author && resBodyObj.commit.author.date)) {
          context$1$0.next = 26;
          break;
        }

        return context$1$0.abrupt('return', resBodyObj.commit.author.date);

      case 26:
        context$1$0.next = 31;
        break;

      case 28:
        context$1$0.prev = 28;
        context$1$0.t1 = context$1$0['catch'](16);

        _logger2['default'].warn('Cannot retrieve the timestamp for Appium git commit ' + commitSha + ' from GitHub. ' + ('Original error: ' + context$1$0.t1.message));

      case 31:
        return context$1$0.abrupt('return', null);

      case 32:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[3, 11], [16, 28]]);
}

/**
 * @returns Mutable object containing Appium build information. By default it
 * only contains the Appium version, but is updated with the build timestamp
 * and git commit hash asynchronously as soon as `updateBuildInfo` is called
 * and succeeds.
 */
function getBuildInfo() {
  return _regeneratorRuntime.async(function getBuildInfo$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        return context$1$0.abrupt('return', BUILD_INFO);

      case 1:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function checkNodeOk() {
  var _getNodeVersion = getNodeVersion();

  var _getNodeVersion2 = _slicedToArray(_getNodeVersion, 2);

  var major = _getNodeVersion2[0];
  var minor = _getNodeVersion2[1];

  if (major < 6) {
    var msg = 'Node version must be >= 6. Currently ' + major + '.' + minor;
    _logger2['default'].errorAndThrow(msg);
  }
}

function warnNodeDeprecations() {
  var _getNodeVersion3 = getNodeVersion();

  var _getNodeVersion32 = _slicedToArray(_getNodeVersion3, 1);

  var major = _getNodeVersion32[0];

  if (major < 8) {
    _logger2['default'].warn("Appium support for versions of node < 8 has been " + "deprecated and will be removed in a future version. Please " + "upgrade!");
  }
}

function showConfig() {
  return _regeneratorRuntime.async(function showConfig$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(updateBuildInfo());

      case 2:
        context$1$0.t0 = console;
        context$1$0.t1 = JSON;
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(getBuildInfo());

      case 6:
        context$1$0.t2 = context$1$0.sent;
        context$1$0.t3 = context$1$0.t1.stringify.call(context$1$0.t1, context$1$0.t2);
        context$1$0.t0.log.call(context$1$0.t0, context$1$0.t3);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

// eslint-disable-line no-console
function getNonDefaultArgs(parser, args) {
  var nonDefaults = {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = _getIterator(parser.rawArgs), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var rawArg = _step2.value;

      var arg = rawArg[1].dest;
      if (args[arg] && args[arg] !== rawArg[1].defaultValue) {
        nonDefaults[arg] = args[arg];
      }
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

  return nonDefaults;
}

function getDeprecatedArgs(parser, args) {
  // go through the server command line arguments and figure
  // out which of the ones used are deprecated
  var deprecated = {};
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = _getIterator(parser.rawArgs), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var rawArg = _step3.value;

      var arg = rawArg[1].dest;
      var defaultValue = rawArg[1].defaultValue;
      var isDeprecated = !!rawArg[1].deprecatedFor;
      if (args[arg] && args[arg] !== defaultValue && isDeprecated) {
        deprecated[rawArg[0]] = rawArg[1].deprecatedFor;
      }
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

  return deprecated;
}

function checkValidPort(port, portName) {
  if (port > 0 && port < 65536) return true; // eslint-disable-line curly
  _logger2['default'].error('Port \'' + portName + '\' must be greater than 0 and less than 65536. Currently ' + port);
  return false;
}

function validateServerArgs(parser, args) {
  // arguments that cannot both be set
  var exclusives = [['noReset', 'fullReset'], ['ipa', 'safari'], ['app', 'safari'], ['forceIphone', 'forceIpad'], ['deviceName', 'defaultDevice']];

  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = _getIterator(exclusives), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var exSet = _step4.value;

      var numFoundInArgs = 0;
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = _getIterator(exSet), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var opt = _step6.value;

          if (_lodash2['default'].has(args, opt) && args[opt]) {
            numFoundInArgs++;
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6['return']) {
            _iterator6['return']();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      if (numFoundInArgs > 1) {
        throw new Error('You can\'t pass in more than one argument from the ' + ('set ' + JSON.stringify(exSet) + ', since they are ') + 'mutually exclusive');
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4['return']) {
        _iterator4['return']();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  var validations = {
    port: checkValidPort,
    callbackPort: checkValidPort,
    bootstrapPort: checkValidPort,
    selendroidPort: checkValidPort,
    chromedriverPort: checkValidPort,
    robotPort: checkValidPort,
    backendRetries: function backendRetries(r) {
      return r >= 0;
    }
  };

  var nonDefaultArgs = getNonDefaultArgs(parser, args);

  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = _getIterator(_lodash2['default'].toPairs(validations)), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var _step5$value = _slicedToArray(_step5.value, 2);

      var arg = _step5$value[0];
      var validator = _step5$value[1];

      if (_lodash2['default'].has(nonDefaultArgs, arg)) {
        if (!validator(args[arg], arg)) {
          throw new Error('Invalid argument for param ' + arg + ': ' + args[arg]);
        }
      }
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5['return']) {
        _iterator5['return']();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }
}

function validateTmpDir(tmpDir) {
  return _regeneratorRuntime.async(function validateTmpDir$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap((0, _appiumSupport.mkdirp)(tmpDir));

      case 3:
        context$1$0.next = 8;
        break;

      case 5:
        context$1$0.prev = 5;
        context$1$0.t0 = context$1$0['catch'](0);
        throw new Error('We could not ensure that the temp dir you specified ' + ('(' + tmpDir + ') exists. Please make sure it\'s writeable.'));

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 5]]);
}

exports.getBuildInfo = getBuildInfo;
exports.validateServerArgs = validateServerArgs;
exports.checkNodeOk = checkNodeOk;
exports.showConfig = showConfig;
exports.warnNodeDeprecations = warnNodeDeprecations;
exports.validateTmpDir = validateTmpDir;
exports.getNonDefaultArgs = getNonDefaultArgs;
exports.getDeprecatedArgs = getDeprecatedArgs;
exports.getGitRev = getGitRev;
exports.checkValidPort = checkValidPort;
exports.APPIUM_VER = APPIUM_VER;
exports.updateBuildInfo = updateBuildInfo;
//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRTtBQUM5QixnQkFBTSxJQUFJLEtBQUssaUNBQStCLEdBQUcsVUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUcsQ0FBQztTQUNwRTtPQUNGO0tBQ0Y7Ozs7Ozs7Ozs7Ozs7OztDQUNGOztBQUVELFNBQWUsY0FBYyxDQUFFLE1BQU07Ozs7Ozt5Q0FFM0IsMkJBQU8sTUFBTSxDQUFDOzs7Ozs7Ozs7Y0FFZCxJQUFJLEtBQUssQ0FBQyxnRUFDSSxNQUFNLGlEQUE0QyxDQUFDOzs7Ozs7O0NBRTFFOztRQUVRLFlBQVksR0FBWixZQUFZO1FBQUUsa0JBQWtCLEdBQWxCLGtCQUFrQjtRQUFFLFdBQVcsR0FBWCxXQUFXO1FBQUUsVUFBVSxHQUFWLFVBQVU7UUFDekQsb0JBQW9CLEdBQXBCLG9CQUFvQjtRQUFFLGNBQWMsR0FBZCxjQUFjO1FBQUUsaUJBQWlCLEdBQWpCLGlCQUFpQjtRQUN2RCxpQkFBaUIsR0FBakIsaUJBQWlCO1FBQUUsU0FBUyxHQUFULFNBQVM7UUFBRSxjQUFjLEdBQWQsY0FBYztRQUFFLFVBQVUsR0FBVixVQUFVO1FBQ3hELGVBQWUsR0FBZixlQUFlIiwiZmlsZSI6ImxpYi9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBta2RpcnAsIGZzLCBzeXN0ZW0sIHV0aWwgfSBmcm9tICdhcHBpdW0tc3VwcG9ydCc7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0LXByb21pc2UnO1xuaW1wb3J0IHsgZXhlYyB9IGZyb20gJ3RlZW5fcHJvY2Vzcyc7XG5pbXBvcnQgeyByb290RGlyIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcblxuY29uc3QgQVBQSVVNX1ZFUiA9IHJlcXVpcmUocGF0aC5yZXNvbHZlKHJvb3REaXIsICdwYWNrYWdlLmpzb24nKSkudmVyc2lvbjtcbmNvbnN0IEdJVF9NRVRBX1JPT1QgPSAnLmdpdCc7XG5jb25zdCBHSVRfQklOQVJZID0gYGdpdCR7c3lzdGVtLmlzV2luZG93cygpID8gJy5leGUnIDogJyd9YDtcbmNvbnN0IEdJVEhVQl9BUEkgPSAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9hcHBpdW0vYXBwaXVtJztcbmNvbnN0IEJVSUxEX0lORk8gPSB7XG4gIHZlcnNpb246IEFQUElVTV9WRVIsXG59O1xuXG5mdW5jdGlvbiBnZXROb2RlVmVyc2lvbiAoKSB7XG4gIC8vIGV4cGVjdCB2PG1ham9yPi48bWlub3I+LjxwYXRjaD5cbiAgLy8gd2Ugd2lsbCBwdWxsIG91dCBgbWFqb3JgIGFuZCBgbWlub3JgXG4gIGxldCB2ZXJzaW9uID0gcHJvY2Vzcy52ZXJzaW9uLm1hdGNoKC9edihcXGQrKVxcLihcXGQrKS8pO1xuICByZXR1cm4gW051bWJlcih2ZXJzaW9uWzFdKSwgTnVtYmVyKHZlcnNpb25bMl0pXTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlQnVpbGRJbmZvICgpIHtcbiAgY29uc3Qgc2hhID0gYXdhaXQgZ2V0R2l0UmV2KHRydWUpO1xuICBpZiAoIXNoYSkge1xuICAgIHJldHVybjtcbiAgfVxuICBCVUlMRF9JTkZPWydnaXQtc2hhJ10gPSBzaGE7XG4gIGNvbnN0IGJ1aWx0ID0gYXdhaXQgZ2V0R2l0VGltZXN0YW1wKHNoYSwgdHJ1ZSk7XG4gIGlmICghXy5pc0VtcHR5KGJ1aWx0KSkge1xuICAgIEJVSUxEX0lORk8uYnVpbHQgPSBidWlsdDtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRHaXRSZXYgKHVzZUdpdEh1YkZhbGxiYWNrID0gZmFsc2UpIHtcbiAgaWYgKGF3YWl0IGZzLmV4aXN0cyhwYXRoLnJlc29sdmUocm9vdERpciwgR0lUX01FVEFfUk9PVCkpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHtzdGRvdXR9ID0gYXdhaXQgZXhlYyhHSVRfQklOQVJZLCBbJ3Jldi1wYXJzZScsICdIRUFEJ10sIHtcbiAgICAgICAgY3dkOiByb290RGlyXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBzdGRvdXQudHJpbSgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgbG9nZ2VyLndhcm4oYENhbm5vdCByZXRyaWV2ZSBnaXQgcmV2aXNpb24gZm9yIEFwcGl1bSB2ZXJzaW9uICR7QVBQSVVNX1ZFUn0gZnJvbSB0aGUgbG9jYWwgcmVwb3NpdG9yeS4gYCArXG4gICAgICAgIGBPcmlnaW5hbCBlcnJvcjogJHtlcnIubWVzc2FnZX1gKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIXVzZUdpdEh1YkZhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVxdWVzdC5nZXQoYCR7R0lUSFVCX0FQSX0vdGFnc2AsIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ1VzZXItQWdlbnQnOiBgQXBwaXVtICR7QVBQSVVNX1ZFUn1gXG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcmVzQm9keU9iaiA9IHV0aWwuc2FmZUpzb25QYXJzZShyZXNwb25zZSk7XG4gICAgaWYgKF8uaXNBcnJheShyZXNCb2R5T2JqKSkge1xuICAgICAgZm9yIChjb25zdCB7bmFtZSwgY29tbWl0fSBvZiByZXNCb2R5T2JqKSB7XG4gICAgICAgIGlmIChuYW1lID09PSBgdiR7QVBQSVVNX1ZFUn1gICYmIGNvbW1pdCAmJiBjb21taXQuc2hhKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbW1pdC5zaGE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGxvZ2dlci53YXJuKGBDYW5ub3QgcmV0cmlldmUgZ2l0IHJldmlzaW9uIGZvciBBcHBpdW0gdmVyc2lvbiAke0FQUElVTV9WRVJ9IGZyb20gR2l0SHViLiBgICtcbiAgICAgIGBPcmlnaW5hbCBlcnJvcjogJHtlcnIubWVzc2FnZX1gKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0R2l0VGltZXN0YW1wIChjb21taXRTaGEsIHVzZUdpdEh1YkZhbGxiYWNrID0gZmFsc2UpIHtcbiAgaWYgKGF3YWl0IGZzLmV4aXN0cyhwYXRoLnJlc29sdmUocm9vdERpciwgR0lUX01FVEFfUk9PVCkpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHtzdGRvdXR9ID0gYXdhaXQgZXhlYyhHSVRfQklOQVJZLCBbJ3Nob3cnLCAnLXMnLCAnLS1mb3JtYXQ9JWNpJywgY29tbWl0U2hhXSwge1xuICAgICAgICBjd2Q6IHJvb3REaXJcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHN0ZG91dC50cmltKCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBsb2dnZXIud2FybihgQ2Fubm90IHJldHJpZXZlIHRoZSB0aW1lc3RhbXAgZm9yIEFwcGl1bSBnaXQgY29tbWl0ICR7Y29tbWl0U2hhfSBmcm9tIHRoZSBsb2NhbCByZXBvc2l0b3J5LiBgICtcbiAgICAgICAgYE9yaWdpbmFsIGVycm9yOiAke2Vyci5tZXNzYWdlfWApO1xuICAgIH1cbiAgfVxuXG4gIGlmICghdXNlR2l0SHViRmFsbGJhY2spIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCByZXF1ZXN0LmdldChgJHtHSVRIVUJfQVBJfS9jb21taXRzLyR7Y29tbWl0U2hhfWAsIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ1VzZXItQWdlbnQnOiBgQXBwaXVtICR7QVBQSVVNX1ZFUn1gXG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcmVzQm9keU9iaiA9IHV0aWwuc2FmZUpzb25QYXJzZShyZXNwb25zZSk7XG4gICAgaWYgKHJlc0JvZHlPYmogJiYgcmVzQm9keU9iai5jb21taXQpIHtcbiAgICAgIGlmIChyZXNCb2R5T2JqLmNvbW1pdC5jb21taXR0ZXIgJiYgcmVzQm9keU9iai5jb21taXQuY29tbWl0dGVyLmRhdGUpIHtcbiAgICAgICAgcmV0dXJuIHJlc0JvZHlPYmouY29tbWl0LmNvbW1pdHRlci5kYXRlO1xuICAgICAgfVxuICAgICAgaWYgKHJlc0JvZHlPYmouY29tbWl0LmF1dGhvciAmJiByZXNCb2R5T2JqLmNvbW1pdC5hdXRob3IuZGF0ZSkge1xuICAgICAgICByZXR1cm4gcmVzQm9keU9iai5jb21taXQuYXV0aG9yLmRhdGU7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBsb2dnZXIud2FybihgQ2Fubm90IHJldHJpZXZlIHRoZSB0aW1lc3RhbXAgZm9yIEFwcGl1bSBnaXQgY29tbWl0ICR7Y29tbWl0U2hhfSBmcm9tIEdpdEh1Yi4gYCArXG4gICAgICBgT3JpZ2luYWwgZXJyb3I6ICR7ZXJyLm1lc3NhZ2V9YCk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogQHJldHVybnMgTXV0YWJsZSBvYmplY3QgY29udGFpbmluZyBBcHBpdW0gYnVpbGQgaW5mb3JtYXRpb24uIEJ5IGRlZmF1bHQgaXRcbiAqIG9ubHkgY29udGFpbnMgdGhlIEFwcGl1bSB2ZXJzaW9uLCBidXQgaXMgdXBkYXRlZCB3aXRoIHRoZSBidWlsZCB0aW1lc3RhbXBcbiAqIGFuZCBnaXQgY29tbWl0IGhhc2ggYXN5bmNocm9ub3VzbHkgYXMgc29vbiBhcyBgdXBkYXRlQnVpbGRJbmZvYCBpcyBjYWxsZWRcbiAqIGFuZCBzdWNjZWVkcy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZ2V0QnVpbGRJbmZvICgpIHtcbiAgcmV0dXJuIEJVSUxEX0lORk87XG59XG5cbmZ1bmN0aW9uIGNoZWNrTm9kZU9rICgpIHtcbiAgbGV0IFttYWpvciwgbWlub3JdID0gZ2V0Tm9kZVZlcnNpb24oKTtcbiAgaWYgKG1ham9yIDwgNikge1xuICAgIGxldCBtc2cgPSBgTm9kZSB2ZXJzaW9uIG11c3QgYmUgPj0gNi4gQ3VycmVudGx5ICR7bWFqb3J9LiR7bWlub3J9YDtcbiAgICBsb2dnZXIuZXJyb3JBbmRUaHJvdyhtc2cpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHdhcm5Ob2RlRGVwcmVjYXRpb25zICgpIHtcbiAgbGV0IFttYWpvcl0gPSBnZXROb2RlVmVyc2lvbigpO1xuICBpZiAobWFqb3IgPCA4KSB7XG4gICAgbG9nZ2VyLndhcm4oXCJBcHBpdW0gc3VwcG9ydCBmb3IgdmVyc2lvbnMgb2Ygbm9kZSA8IDggaGFzIGJlZW4gXCIgK1xuICAgICAgICAgICAgICAgIFwiZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIGEgZnV0dXJlIHZlcnNpb24uIFBsZWFzZSBcIiArXG4gICAgICAgICAgICAgICAgXCJ1cGdyYWRlIVwiKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBzaG93Q29uZmlnICgpIHtcbiAgYXdhaXQgdXBkYXRlQnVpbGRJbmZvKCk7XG4gIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGF3YWl0IGdldEJ1aWxkSW5mbygpKSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxufVxuXG5mdW5jdGlvbiBnZXROb25EZWZhdWx0QXJncyAocGFyc2VyLCBhcmdzKSB7XG4gIGxldCBub25EZWZhdWx0cyA9IHt9O1xuICBmb3IgKGxldCByYXdBcmcgb2YgcGFyc2VyLnJhd0FyZ3MpIHtcbiAgICBsZXQgYXJnID0gcmF3QXJnWzFdLmRlc3Q7XG4gICAgaWYgKGFyZ3NbYXJnXSAmJiBhcmdzW2FyZ10gIT09IHJhd0FyZ1sxXS5kZWZhdWx0VmFsdWUpIHtcbiAgICAgIG5vbkRlZmF1bHRzW2FyZ10gPSBhcmdzW2FyZ107XG4gICAgfVxuICB9XG4gIHJldHVybiBub25EZWZhdWx0cztcbn1cblxuZnVuY3Rpb24gZ2V0RGVwcmVjYXRlZEFyZ3MgKHBhcnNlciwgYXJncykge1xuICAvLyBnbyB0aHJvdWdoIHRoZSBzZXJ2ZXIgY29tbWFuZCBsaW5lIGFyZ3VtZW50cyBhbmQgZmlndXJlXG4gIC8vIG91dCB3aGljaCBvZiB0aGUgb25lcyB1c2VkIGFyZSBkZXByZWNhdGVkXG4gIGxldCBkZXByZWNhdGVkID0ge307XG4gIGZvciAobGV0IHJhd0FyZyBvZiBwYXJzZXIucmF3QXJncykge1xuICAgIGxldCBhcmcgPSByYXdBcmdbMV0uZGVzdDtcbiAgICBsZXQgZGVmYXVsdFZhbHVlID0gcmF3QXJnWzFdLmRlZmF1bHRWYWx1ZTtcbiAgICBsZXQgaXNEZXByZWNhdGVkID0gISFyYXdBcmdbMV0uZGVwcmVjYXRlZEZvcjtcbiAgICBpZiAoYXJnc1thcmddICYmIGFyZ3NbYXJnXSAhPT0gZGVmYXVsdFZhbHVlICYmIGlzRGVwcmVjYXRlZCkge1xuICAgICAgZGVwcmVjYXRlZFtyYXdBcmdbMF1dID0gcmF3QXJnWzFdLmRlcHJlY2F0ZWRGb3I7XG4gICAgfVxuICB9XG4gIHJldHVybiBkZXByZWNhdGVkO1xufVxuXG5mdW5jdGlvbiBjaGVja1ZhbGlkUG9ydCAocG9ydCwgcG9ydE5hbWUpIHtcbiAgaWYgKHBvcnQgPiAwICYmIHBvcnQgPCA2NTUzNikgcmV0dXJuIHRydWU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY3VybHlcbiAgbG9nZ2VyLmVycm9yKGBQb3J0ICcke3BvcnROYW1lfScgbXVzdCBiZSBncmVhdGVyIHRoYW4gMCBhbmQgbGVzcyB0aGFuIDY1NTM2LiBDdXJyZW50bHkgJHtwb3J0fWApO1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlU2VydmVyQXJncyAocGFyc2VyLCBhcmdzKSB7XG4gIC8vIGFyZ3VtZW50cyB0aGF0IGNhbm5vdCBib3RoIGJlIHNldFxuICBsZXQgZXhjbHVzaXZlcyA9IFtcbiAgICBbJ25vUmVzZXQnLCAnZnVsbFJlc2V0J10sXG4gICAgWydpcGEnLCAnc2FmYXJpJ10sXG4gICAgWydhcHAnLCAnc2FmYXJpJ10sXG4gICAgWydmb3JjZUlwaG9uZScsICdmb3JjZUlwYWQnXSxcbiAgICBbJ2RldmljZU5hbWUnLCAnZGVmYXVsdERldmljZSddXG4gIF07XG5cbiAgZm9yIChsZXQgZXhTZXQgb2YgZXhjbHVzaXZlcykge1xuICAgIGxldCBudW1Gb3VuZEluQXJncyA9IDA7XG4gICAgZm9yIChsZXQgb3B0IG9mIGV4U2V0KSB7XG4gICAgICBpZiAoXy5oYXMoYXJncywgb3B0KSAmJiBhcmdzW29wdF0pIHtcbiAgICAgICAgbnVtRm91bmRJbkFyZ3MrKztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG51bUZvdW5kSW5BcmdzID4gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBZb3UgY2FuJ3QgcGFzcyBpbiBtb3JlIHRoYW4gb25lIGFyZ3VtZW50IGZyb20gdGhlIGAgK1xuICAgICAgICAgICAgICAgICAgICAgIGBzZXQgJHtKU09OLnN0cmluZ2lmeShleFNldCl9LCBzaW5jZSB0aGV5IGFyZSBgICtcbiAgICAgICAgICAgICAgICAgICAgICBgbXV0dWFsbHkgZXhjbHVzaXZlYCk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgdmFsaWRhdGlvbnMgPSB7XG4gICAgcG9ydDogY2hlY2tWYWxpZFBvcnQsXG4gICAgY2FsbGJhY2tQb3J0OiBjaGVja1ZhbGlkUG9ydCxcbiAgICBib290c3RyYXBQb3J0OiBjaGVja1ZhbGlkUG9ydCxcbiAgICBzZWxlbmRyb2lkUG9ydDogY2hlY2tWYWxpZFBvcnQsXG4gICAgY2hyb21lZHJpdmVyUG9ydDogY2hlY2tWYWxpZFBvcnQsXG4gICAgcm9ib3RQb3J0OiBjaGVja1ZhbGlkUG9ydCxcbiAgICBiYWNrZW5kUmV0cmllczogKHIpID0+IHsgcmV0dXJuIHIgPj0gMDsgfVxuICB9O1xuXG4gIGNvbnN0IG5vbkRlZmF1bHRBcmdzID0gZ2V0Tm9uRGVmYXVsdEFyZ3MocGFyc2VyLCBhcmdzKTtcblxuICBmb3IgKGxldCBbYXJnLCB2YWxpZGF0b3JdIG9mIF8udG9QYWlycyh2YWxpZGF0aW9ucykpIHtcbiAgICBpZiAoXy5oYXMobm9uRGVmYXVsdEFyZ3MsIGFyZykpIHtcbiAgICAgIGlmICghdmFsaWRhdG9yKGFyZ3NbYXJnXSwgYXJnKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgYXJndW1lbnQgZm9yIHBhcmFtICR7YXJnfTogJHthcmdzW2FyZ119YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHZhbGlkYXRlVG1wRGlyICh0bXBEaXIpIHtcbiAgdHJ5IHtcbiAgICBhd2FpdCBta2RpcnAodG1wRGlyKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgV2UgY291bGQgbm90IGVuc3VyZSB0aGF0IHRoZSB0ZW1wIGRpciB5b3Ugc3BlY2lmaWVkIGAgK1xuICAgICAgICAgICAgICAgICAgICBgKCR7dG1wRGlyfSkgZXhpc3RzLiBQbGVhc2UgbWFrZSBzdXJlIGl0J3Mgd3JpdGVhYmxlLmApO1xuICB9XG59XG5cbmV4cG9ydCB7IGdldEJ1aWxkSW5mbywgdmFsaWRhdGVTZXJ2ZXJBcmdzLCBjaGVja05vZGVPaywgc2hvd0NvbmZpZyxcbiAgICAgICAgIHdhcm5Ob2RlRGVwcmVjYXRpb25zLCB2YWxpZGF0ZVRtcERpciwgZ2V0Tm9uRGVmYXVsdEFyZ3MsXG4gICAgICAgICBnZXREZXByZWNhdGVkQXJncywgZ2V0R2l0UmV2LCBjaGVja1ZhbGlkUG9ydCwgQVBQSVVNX1ZFUixcbiAgICAgICAgIHVwZGF0ZUJ1aWxkSW5mbyB9O1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLiJ9
