'use strict';

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _appiumBaseDriver = require('appium-base-driver');

var _findRoot = require('find-root');

var _findRoot2 = _interopRequireDefault(_findRoot);

var W3C_APPIUM_PREFIX = 'appium';

function inspectObject(args) {
  function getValueArray(obj) {
    var indent = arguments.length <= 1 || arguments[1] === undefined ? '  ' : arguments[1];

    if (!_lodash2['default'].isObject(obj)) {
      return [obj];
    }

    var strArr = ['{'];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(_lodash2['default'].toPairs(obj)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _slicedToArray(_step.value, 2);

        var arg = _step$value[0];
        var value = _step$value[1];

        if (!_lodash2['default'].isObject(value)) {
          strArr.push(indent + '  ' + arg + ': ' + value);
        } else {
          value = getValueArray(value, indent + '  ');
          strArr.push(indent + '  ' + arg + ': ' + value.shift());
          strArr.push.apply(strArr, _toConsumableArray(value));
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

    strArr.push(indent + '}');
    return strArr;
  }
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = _getIterator(_lodash2['default'].toPairs(args)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _step2$value = _slicedToArray(_step2.value, 2);

      var arg = _step2$value[0];
      var value = _step2$value[1];

      value = getValueArray(value);
      _logger2['default'].info('  ' + arg + ': ' + value.shift());
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _getIterator(value), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var val = _step3.value;

          _logger2['default'].info(val);
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
}

/**
 * Takes the caps that were provided in the request and translates them
 * into caps that can be used by the inner drivers.
 *
 * @param {Object} jsonwpCapabilities
 * @param {Object} w3cCapabilities
 * @param {Object} constraints
 * @param {Object} defaultCapabilities
 */
function parseCapsForInnerDriver(jsonwpCapabilities, w3cCapabilities) {
  var constraints = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var defaultCapabilities = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  // Check if the caller sent JSONWP caps, W3C caps, or both
  var hasW3CCaps = _lodash2['default'].isPlainObject(w3cCapabilities) && (_lodash2['default'].has(w3cCapabilities, 'alwaysMatch') || _lodash2['default'].has(w3cCapabilities, 'firstMatch'));
  var hasJSONWPCaps = _lodash2['default'].isPlainObject(jsonwpCapabilities);
  var protocol = null;
  var desiredCaps = {};
  var processedW3CCapabilities = null;
  var processedJsonwpCapabilities = null;

  if (!hasJSONWPCaps && !hasW3CCaps) {
    return {
      protocol: _appiumBaseDriver.BaseDriver.DRIVER_PROTOCOL.W3C,
      error: new Error('Either JSONWP or W3C capabilities should be provided')
    };
  }

  var _BaseDriver$DRIVER_PROTOCOL = _appiumBaseDriver.BaseDriver.DRIVER_PROTOCOL;
  var W3C = _BaseDriver$DRIVER_PROTOCOL.W3C;
  var MJSONWP = _BaseDriver$DRIVER_PROTOCOL.MJSONWP;

  // Make sure we don't mutate the original arguments
  jsonwpCapabilities = _lodash2['default'].cloneDeep(jsonwpCapabilities);
  w3cCapabilities = _lodash2['default'].cloneDeep(w3cCapabilities);
  defaultCapabilities = _lodash2['default'].cloneDeep(defaultCapabilities);

  if (!_lodash2['default'].isEmpty(defaultCapabilities)) {
    if (hasW3CCaps) {
      var _w3cCapabilities = w3cCapabilities;
      var _w3cCapabilities$firstMatch = _w3cCapabilities.firstMatch;
      var firstMatch = _w3cCapabilities$firstMatch === undefined ? [] : _w3cCapabilities$firstMatch;
      var _w3cCapabilities$alwaysMatch = _w3cCapabilities.alwaysMatch;
      var alwaysMatch = _w3cCapabilities$alwaysMatch === undefined ? {} : _w3cCapabilities$alwaysMatch;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = _getIterator(_lodash2['default'].toPairs(defaultCapabilities)), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _step4$value = _slicedToArray(_step4.value, 2);

          var defaultCapKey = _step4$value[0];
          var defaultCapValue = _step4$value[1];

          var isCapAlreadySet = false;
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = _getIterator(firstMatch), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var firstMatchEntry = _step5.value;

              if (_lodash2['default'].has(removeW3CPrefixes(firstMatchEntry), removeW3CPrefix(defaultCapKey))) {
                isCapAlreadySet = true;
                break;
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

          isCapAlreadySet = isCapAlreadySet || _lodash2['default'].has(removeW3CPrefixes(alwaysMatch), removeW3CPrefix(defaultCapKey));
          if (isCapAlreadySet) {
            continue;
          }

          // Only add the default capability if it is not overridden
          if (_lodash2['default'].isEmpty(firstMatch)) {
            w3cCapabilities.firstMatch = [_defineProperty({}, defaultCapKey, defaultCapValue)];
          } else {
            firstMatch[0][defaultCapKey] = defaultCapValue;
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
    }
    if (hasJSONWPCaps) {
      jsonwpCapabilities = _Object$assign({}, removeW3CPrefixes(defaultCapabilities), jsonwpCapabilities);
    }
  }

  // Get MJSONWP caps
  if (hasJSONWPCaps) {
    protocol = MJSONWP;
    desiredCaps = jsonwpCapabilities;
    processedJsonwpCapabilities = removeW3CPrefixes(_extends({}, desiredCaps));
  }

  // Get W3C caps
  if (hasW3CCaps) {
    protocol = W3C;
    // Call the process capabilities algorithm to find matching caps on the W3C
    // (see: https://github.com/jlipps/simple-wd-spec#processing-capabilities)
    var isFixingNeededForW3cCaps = false;
    try {
      desiredCaps = (0, _appiumBaseDriver.processCapabilities)(w3cCapabilities, constraints, true);
    } catch (error) {
      if (!hasJSONWPCaps) {
        return {
          desiredCaps: desiredCaps,
          processedJsonwpCapabilities: processedJsonwpCapabilities,
          processedW3CCapabilities: processedW3CCapabilities,
          protocol: protocol,
          error: error
        };
      }
      _logger2['default'].info('Could not parse W3C capabilities: ' + error.message);
      isFixingNeededForW3cCaps = true;
    }

    if (hasJSONWPCaps && !isFixingNeededForW3cCaps) {
      var differingKeys = _lodash2['default'].difference(_lodash2['default'].keys(processedJsonwpCapabilities), _lodash2['default'].keys(removeW3CPrefixes(desiredCaps)));
      if (!_lodash2['default'].isEmpty(differingKeys)) {
        _logger2['default'].info('The following capabilities were provided in the JSONWP desired capabilities that are missing ' + ('in W3C capabilities: ' + JSON.stringify(differingKeys)));
        isFixingNeededForW3cCaps = true;
      }
    }

    if (isFixingNeededForW3cCaps && hasJSONWPCaps) {
      _logger2['default'].info('Trying to fix W3C capabilities by merging them with JSONWP caps');
      w3cCapabilities = fixW3cCapabilities(w3cCapabilities, jsonwpCapabilities);
      try {
        desiredCaps = (0, _appiumBaseDriver.processCapabilities)(w3cCapabilities, constraints, true);
      } catch (error) {
        _logger2['default'].warn('Could not parse fixed W3C capabilities: ' + error.message + '. Falling back to JSONWP protocol');
        return {
          desiredCaps: processedJsonwpCapabilities,
          processedJsonwpCapabilities: processedJsonwpCapabilities,
          processedW3CCapabilities: null,
          protocol: MJSONWP
        };
      }
    }

    // Create a new w3c capabilities payload that contains only the matching caps in `alwaysMatch`
    processedW3CCapabilities = {
      alwaysMatch: _extends({}, insertAppiumPrefixes(desiredCaps)),
      firstMatch: [{}]
    };
  }

  return { desiredCaps: desiredCaps, processedJsonwpCapabilities: processedJsonwpCapabilities, processedW3CCapabilities: processedW3CCapabilities, protocol: protocol };
}

/**
 * This helper method tries to fix corrupted W3C capabilities by
 * merging them to existing JSONWP capabilities.
 *
 * @param {Object} w3cCaps W3C capabilities
 * @param {Object} jsonwpCaps JSONWP capabilities
 * @returns {Object} Fixed W3C capabilities
 */
function fixW3cCapabilities(w3cCaps, jsonwpCaps) {
  var result = {
    firstMatch: w3cCaps.firstMatch || [],
    alwaysMatch: w3cCaps.alwaysMatch || {}
  };
  var keysToInsert = _lodash2['default'].keys(jsonwpCaps);
  var removeMatchingKeys = function removeMatchingKeys(match) {
    _lodash2['default'].pull(keysToInsert, match);
    var colonIndex = match.indexOf(':');
    if (colonIndex >= 0 && match.length > colonIndex) {
      _lodash2['default'].pull(keysToInsert, match.substring(colonIndex + 1));
    }
    if (keysToInsert.includes(W3C_APPIUM_PREFIX + ':' + match)) {
      _lodash2['default'].pull(keysToInsert, W3C_APPIUM_PREFIX + ':' + match);
    }
  };

  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = _getIterator(result.firstMatch), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var firstMatchEntry = _step6.value;
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = _getIterator(_lodash2['default'].toPairs(firstMatchEntry)), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var pair = _step9.value;

          removeMatchingKeys(pair[0]);
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9['return']) {
            _iterator9['return']();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
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

  var _iteratorNormalCompletion7 = true;
  var _didIteratorError7 = false;
  var _iteratorError7 = undefined;

  try {
    for (var _iterator7 = _getIterator(_lodash2['default'].toPairs(result.alwaysMatch)), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
      var pair = _step7.value;

      removeMatchingKeys(pair[0]);
    }
  } catch (err) {
    _didIteratorError7 = true;
    _iteratorError7 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion7 && _iterator7['return']) {
        _iterator7['return']();
      }
    } finally {
      if (_didIteratorError7) {
        throw _iteratorError7;
      }
    }
  }

  var _iteratorNormalCompletion8 = true;
  var _didIteratorError8 = false;
  var _iteratorError8 = undefined;

  try {
    for (var _iterator8 = _getIterator(keysToInsert), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
      var key = _step8.value;

      result.alwaysMatch[key] = jsonwpCaps[key];
    }
  } catch (err) {
    _didIteratorError8 = true;
    _iteratorError8 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion8 && _iterator8['return']) {
        _iterator8['return']();
      }
    } finally {
      if (_didIteratorError8) {
        throw _iteratorError8;
      }
    }
  }

  return result;
}

/**
 * Takes a capabilities objects and prefixes capabilities with `appium:`
 * @param {Object} caps Desired capabilities object
 */
function insertAppiumPrefixes(caps) {
  // Standard, non-prefixed capabilities (see https://www.w3.org/TR/webdriver/#dfn-table-of-standard-capabilities)
  var STANDARD_CAPS = ['browserName', 'browserVersion', 'platformName', 'acceptInsecureCerts', 'pageLoadStrategy', 'proxy', 'setWindowRect', 'timeouts', 'unhandledPromptBehavior'];

  var prefixedCaps = {};
  var _iteratorNormalCompletion10 = true;
  var _didIteratorError10 = false;
  var _iteratorError10 = undefined;

  try {
    for (var _iterator10 = _getIterator(_lodash2['default'].toPairs(caps)), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
      var _step10$value = _slicedToArray(_step10.value, 2);

      var _name = _step10$value[0];
      var value = _step10$value[1];

      if (STANDARD_CAPS.includes(_name) || _name.includes(':')) {
        prefixedCaps[_name] = value;
      } else {
        prefixedCaps[W3C_APPIUM_PREFIX + ':' + _name] = value;
      }
    }
  } catch (err) {
    _didIteratorError10 = true;
    _iteratorError10 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion10 && _iterator10['return']) {
        _iterator10['return']();
      }
    } finally {
      if (_didIteratorError10) {
        throw _iteratorError10;
      }
    }
  }

  return prefixedCaps;
}

function removeW3CPrefixes(caps) {
  if (!_lodash2['default'].isPlainObject(caps)) {
    return caps;
  }

  var fixedCaps = {};
  var _iteratorNormalCompletion11 = true;
  var _didIteratorError11 = false;
  var _iteratorError11 = undefined;

  try {
    for (var _iterator11 = _getIterator(_lodash2['default'].toPairs(caps)), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
      var _step11$value = _slicedToArray(_step11.value, 2);

      var _name2 = _step11$value[0];
      var value = _step11$value[1];

      fixedCaps[removeW3CPrefix(_name2)] = value;
    }
  } catch (err) {
    _didIteratorError11 = true;
    _iteratorError11 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion11 && _iterator11['return']) {
        _iterator11['return']();
      }
    } finally {
      if (_didIteratorError11) {
        throw _iteratorError11;
      }
    }
  }

  return fixedCaps;
}

function removeW3CPrefix(key) {
  var colonPos = key.indexOf(':');
  return colonPos > 0 && key.length > colonPos ? key.substring(colonPos + 1) : key;
}

function getPackageVersion(pkgName) {
  var pkgInfo = require(pkgName + '/package.json') || {};
  return pkgInfo.version;
}

var rootDir = (0, _findRoot2['default'])(__dirname);

exports.inspectObject = inspectObject;
exports.parseCapsForInnerDriver = parseCapsForInnerDriver;
exports.insertAppiumPrefixes = insertAppiumPrefixes;
exports.rootDir = rootDir;
exports.getPackageVersion = getPackageVersion;
//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUFFRCxTQUFTLGVBQWUsQ0FBRSxHQUFHLEVBQUU7QUFDN0IsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxTQUFPLFFBQVEsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0NBQ2xGOztBQUVELFNBQVMsaUJBQWlCLENBQUUsT0FBTyxFQUFFO0FBQ25DLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBSSxPQUFPLG1CQUFnQixJQUFJLEVBQUUsQ0FBQztBQUN6RCxTQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUM7Q0FDeEI7O0FBRUQsSUFBTSxPQUFPLEdBQUcsMkJBQVMsU0FBUyxDQUFDLENBQUM7O1FBRTNCLGFBQWEsR0FBYixhQUFhO1FBQUUsdUJBQXVCLEdBQXZCLHVCQUF1QjtRQUFFLG9CQUFvQixHQUFwQixvQkFBb0I7UUFBRSxPQUFPLEdBQVAsT0FBTztRQUNyRSxpQkFBaUIsR0FBakIsaUJBQWlCIiwiZmlsZSI6ImxpYi91dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7IHByb2Nlc3NDYXBhYmlsaXRpZXMsIEJhc2VEcml2ZXIgfSBmcm9tICdhcHBpdW0tYmFzZS1kcml2ZXInO1xuaW1wb3J0IGZpbmRSb290IGZyb20gJ2ZpbmQtcm9vdCc7XG5cbmNvbnN0IFczQ19BUFBJVU1fUFJFRklYID0gJ2FwcGl1bSc7XG5cbmZ1bmN0aW9uIGluc3BlY3RPYmplY3QgKGFyZ3MpIHtcbiAgZnVuY3Rpb24gZ2V0VmFsdWVBcnJheSAob2JqLCBpbmRlbnQgPSAnICAnKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHtcbiAgICAgIHJldHVybiBbb2JqXTtcbiAgICB9XG5cbiAgICBsZXQgc3RyQXJyID0gWyd7J107XG4gICAgZm9yIChsZXQgW2FyZywgdmFsdWVdIG9mIF8udG9QYWlycyhvYmopKSB7XG4gICAgICBpZiAoIV8uaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgIHN0ckFyci5wdXNoKGAke2luZGVudH0gICR7YXJnfTogJHt2YWx1ZX1gKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gZ2V0VmFsdWVBcnJheSh2YWx1ZSwgYCR7aW5kZW50fSAgYCk7XG4gICAgICAgIHN0ckFyci5wdXNoKGAke2luZGVudH0gICR7YXJnfTogJHt2YWx1ZS5zaGlmdCgpfWApO1xuICAgICAgICBzdHJBcnIucHVzaCguLi52YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHN0ckFyci5wdXNoKGAke2luZGVudH19YCk7XG4gICAgcmV0dXJuIHN0ckFycjtcbiAgfVxuICBmb3IgKGxldCBbYXJnLCB2YWx1ZV0gb2YgXy50b1BhaXJzKGFyZ3MpKSB7XG4gICAgdmFsdWUgPSBnZXRWYWx1ZUFycmF5KHZhbHVlKTtcbiAgICBsb2dnZXIuaW5mbyhgICAke2FyZ306ICR7dmFsdWUuc2hpZnQoKX1gKTtcbiAgICBmb3IgKGxldCB2YWwgb2YgdmFsdWUpIHtcbiAgICAgIGxvZ2dlci5pbmZvKHZhbCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVGFrZXMgdGhlIGNhcHMgdGhhdCB3ZXJlIHByb3ZpZGVkIGluIHRoZSByZXF1ZXN0IGFuZCB0cmFuc2xhdGVzIHRoZW1cbiAqIGludG8gY2FwcyB0aGF0IGNhbiBiZSB1c2VkIGJ5IHRoZSBpbm5lciBkcml2ZXJzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBqc29ud3BDYXBhYmlsaXRpZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSB3M2NDYXBhYmlsaXRpZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25zdHJhaW50c1xuICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRDYXBhYmlsaXRpZXNcbiAqL1xuZnVuY3Rpb24gcGFyc2VDYXBzRm9ySW5uZXJEcml2ZXIgKGpzb253cENhcGFiaWxpdGllcywgdzNjQ2FwYWJpbGl0aWVzLCBjb25zdHJhaW50cyA9IHt9LCBkZWZhdWx0Q2FwYWJpbGl0aWVzID0ge30pIHtcbiAgLy8gQ2hlY2sgaWYgdGhlIGNhbGxlciBzZW50IEpTT05XUCBjYXBzLCBXM0MgY2Fwcywgb3IgYm90aFxuICBjb25zdCBoYXNXM0NDYXBzID0gXy5pc1BsYWluT2JqZWN0KHczY0NhcGFiaWxpdGllcykgJiZcbiAgICAoXy5oYXModzNjQ2FwYWJpbGl0aWVzLCAnYWx3YXlzTWF0Y2gnKSB8fCBfLmhhcyh3M2NDYXBhYmlsaXRpZXMsICdmaXJzdE1hdGNoJykpO1xuICBjb25zdCBoYXNKU09OV1BDYXBzID0gXy5pc1BsYWluT2JqZWN0KGpzb253cENhcGFiaWxpdGllcyk7XG4gIGxldCBwcm90b2NvbCA9IG51bGw7XG4gIGxldCBkZXNpcmVkQ2FwcyA9IHt9O1xuICBsZXQgcHJvY2Vzc2VkVzNDQ2FwYWJpbGl0aWVzID0gbnVsbDtcbiAgbGV0IHByb2Nlc3NlZEpzb253cENhcGFiaWxpdGllcyA9IG51bGw7XG5cbiAgaWYgKCFoYXNKU09OV1BDYXBzICYmICFoYXNXM0NDYXBzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb3RvY29sOiBCYXNlRHJpdmVyLkRSSVZFUl9QUk9UT0NPTC5XM0MsXG4gICAgICBlcnJvcjogbmV3IEVycm9yKCdFaXRoZXIgSlNPTldQIG9yIFczQyBjYXBhYmlsaXRpZXMgc2hvdWxkIGJlIHByb3ZpZGVkJyksXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHtXM0MsIE1KU09OV1B9ID0gQmFzZURyaXZlci5EUklWRVJfUFJPVE9DT0w7XG5cbiAgLy8gTWFrZSBzdXJlIHdlIGRvbid0IG11dGF0ZSB0aGUgb3JpZ2luYWwgYXJndW1lbnRzXG4gIGpzb253cENhcGFiaWxpdGllcyA9IF8uY2xvbmVEZWVwKGpzb253cENhcGFiaWxpdGllcyk7XG4gIHczY0NhcGFiaWxpdGllcyA9IF8uY2xvbmVEZWVwKHczY0NhcGFiaWxpdGllcyk7XG4gIGRlZmF1bHRDYXBhYmlsaXRpZXMgPSBfLmNsb25lRGVlcChkZWZhdWx0Q2FwYWJpbGl0aWVzKTtcblxuICBpZiAoIV8uaXNFbXB0eShkZWZhdWx0Q2FwYWJpbGl0aWVzKSkge1xuICAgIGlmIChoYXNXM0NDYXBzKSB7XG4gICAgICBjb25zdCB7Zmlyc3RNYXRjaCA9IFtdLCBhbHdheXNNYXRjaCA9IHt9fSA9IHczY0NhcGFiaWxpdGllcztcbiAgICAgIGZvciAoY29uc3QgW2RlZmF1bHRDYXBLZXksIGRlZmF1bHRDYXBWYWx1ZV0gb2YgXy50b1BhaXJzKGRlZmF1bHRDYXBhYmlsaXRpZXMpKSB7XG4gICAgICAgIGxldCBpc0NhcEFscmVhZHlTZXQgPSBmYWxzZTtcbiAgICAgICAgZm9yIChjb25zdCBmaXJzdE1hdGNoRW50cnkgb2YgZmlyc3RNYXRjaCkge1xuICAgICAgICAgIGlmIChfLmhhcyhyZW1vdmVXM0NQcmVmaXhlcyhmaXJzdE1hdGNoRW50cnkpLCByZW1vdmVXM0NQcmVmaXgoZGVmYXVsdENhcEtleSkpKSB7XG4gICAgICAgICAgICBpc0NhcEFscmVhZHlTZXQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlzQ2FwQWxyZWFkeVNldCA9IGlzQ2FwQWxyZWFkeVNldCB8fCBfLmhhcyhyZW1vdmVXM0NQcmVmaXhlcyhhbHdheXNNYXRjaCksIHJlbW92ZVczQ1ByZWZpeChkZWZhdWx0Q2FwS2V5KSk7XG4gICAgICAgIGlmIChpc0NhcEFscmVhZHlTZXQpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9ubHkgYWRkIHRoZSBkZWZhdWx0IGNhcGFiaWxpdHkgaWYgaXQgaXMgbm90IG92ZXJyaWRkZW5cbiAgICAgICAgaWYgKF8uaXNFbXB0eShmaXJzdE1hdGNoKSkge1xuICAgICAgICAgIHczY0NhcGFiaWxpdGllcy5maXJzdE1hdGNoID0gW3tbZGVmYXVsdENhcEtleV06IGRlZmF1bHRDYXBWYWx1ZX1dO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpcnN0TWF0Y2hbMF1bZGVmYXVsdENhcEtleV0gPSBkZWZhdWx0Q2FwVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGhhc0pTT05XUENhcHMpIHtcbiAgICAgIGpzb253cENhcGFiaWxpdGllcyA9IE9iamVjdC5hc3NpZ24oe30sIHJlbW92ZVczQ1ByZWZpeGVzKGRlZmF1bHRDYXBhYmlsaXRpZXMpLCBqc29ud3BDYXBhYmlsaXRpZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdldCBNSlNPTldQIGNhcHNcbiAgaWYgKGhhc0pTT05XUENhcHMpIHtcbiAgICBwcm90b2NvbCA9IE1KU09OV1A7XG4gICAgZGVzaXJlZENhcHMgPSBqc29ud3BDYXBhYmlsaXRpZXM7XG4gICAgcHJvY2Vzc2VkSnNvbndwQ2FwYWJpbGl0aWVzID0gcmVtb3ZlVzNDUHJlZml4ZXMoey4uLmRlc2lyZWRDYXBzfSk7XG4gIH1cblxuICAvLyBHZXQgVzNDIGNhcHNcbiAgaWYgKGhhc1czQ0NhcHMpIHtcbiAgICBwcm90b2NvbCA9IFczQztcbiAgICAvLyBDYWxsIHRoZSBwcm9jZXNzIGNhcGFiaWxpdGllcyBhbGdvcml0aG0gdG8gZmluZCBtYXRjaGluZyBjYXBzIG9uIHRoZSBXM0NcbiAgICAvLyAoc2VlOiBodHRwczovL2dpdGh1Yi5jb20vamxpcHBzL3NpbXBsZS13ZC1zcGVjI3Byb2Nlc3NpbmctY2FwYWJpbGl0aWVzKVxuICAgIGxldCBpc0ZpeGluZ05lZWRlZEZvclczY0NhcHMgPSBmYWxzZTtcbiAgICB0cnkge1xuICAgICAgZGVzaXJlZENhcHMgPSBwcm9jZXNzQ2FwYWJpbGl0aWVzKHczY0NhcGFiaWxpdGllcywgY29uc3RyYWludHMsIHRydWUpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoIWhhc0pTT05XUENhcHMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBkZXNpcmVkQ2FwcyxcbiAgICAgICAgICBwcm9jZXNzZWRKc29ud3BDYXBhYmlsaXRpZXMsXG4gICAgICAgICAgcHJvY2Vzc2VkVzNDQ2FwYWJpbGl0aWVzLFxuICAgICAgICAgIHByb3RvY29sLFxuICAgICAgICAgIGVycm9yLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgbG9nZ2VyLmluZm8oYENvdWxkIG5vdCBwYXJzZSBXM0MgY2FwYWJpbGl0aWVzOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG4gICAgICBpc0ZpeGluZ05lZWRlZEZvclczY0NhcHMgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChoYXNKU09OV1BDYXBzICYmICFpc0ZpeGluZ05lZWRlZEZvclczY0NhcHMpIHtcbiAgICAgIGNvbnN0IGRpZmZlcmluZ0tleXMgPSBfLmRpZmZlcmVuY2UoXy5rZXlzKHByb2Nlc3NlZEpzb253cENhcGFiaWxpdGllcyksIF8ua2V5cyhyZW1vdmVXM0NQcmVmaXhlcyhkZXNpcmVkQ2FwcykpKTtcbiAgICAgIGlmICghXy5pc0VtcHR5KGRpZmZlcmluZ0tleXMpKSB7XG4gICAgICAgIGxvZ2dlci5pbmZvKGBUaGUgZm9sbG93aW5nIGNhcGFiaWxpdGllcyB3ZXJlIHByb3ZpZGVkIGluIHRoZSBKU09OV1AgZGVzaXJlZCBjYXBhYmlsaXRpZXMgdGhhdCBhcmUgbWlzc2luZyBgICtcbiAgICAgICAgICBgaW4gVzNDIGNhcGFiaWxpdGllczogJHtKU09OLnN0cmluZ2lmeShkaWZmZXJpbmdLZXlzKX1gKTtcbiAgICAgICAgaXNGaXhpbmdOZWVkZWRGb3JXM2NDYXBzID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNGaXhpbmdOZWVkZWRGb3JXM2NDYXBzICYmIGhhc0pTT05XUENhcHMpIHtcbiAgICAgIGxvZ2dlci5pbmZvKCdUcnlpbmcgdG8gZml4IFczQyBjYXBhYmlsaXRpZXMgYnkgbWVyZ2luZyB0aGVtIHdpdGggSlNPTldQIGNhcHMnKTtcbiAgICAgIHczY0NhcGFiaWxpdGllcyA9IGZpeFczY0NhcGFiaWxpdGllcyh3M2NDYXBhYmlsaXRpZXMsIGpzb253cENhcGFiaWxpdGllcyk7XG4gICAgICB0cnkge1xuICAgICAgICBkZXNpcmVkQ2FwcyA9IHByb2Nlc3NDYXBhYmlsaXRpZXModzNjQ2FwYWJpbGl0aWVzLCBjb25zdHJhaW50cywgdHJ1ZSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBsb2dnZXIud2FybihgQ291bGQgbm90IHBhcnNlIGZpeGVkIFczQyBjYXBhYmlsaXRpZXM6ICR7ZXJyb3IubWVzc2FnZX0uIEZhbGxpbmcgYmFjayB0byBKU09OV1AgcHJvdG9jb2xgKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBkZXNpcmVkQ2FwczogcHJvY2Vzc2VkSnNvbndwQ2FwYWJpbGl0aWVzLFxuICAgICAgICAgIHByb2Nlc3NlZEpzb253cENhcGFiaWxpdGllcyxcbiAgICAgICAgICBwcm9jZXNzZWRXM0NDYXBhYmlsaXRpZXM6IG51bGwsXG4gICAgICAgICAgcHJvdG9jb2w6IE1KU09OV1AsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGEgbmV3IHczYyBjYXBhYmlsaXRpZXMgcGF5bG9hZCB0aGF0IGNvbnRhaW5zIG9ubHkgdGhlIG1hdGNoaW5nIGNhcHMgaW4gYGFsd2F5c01hdGNoYFxuICAgIHByb2Nlc3NlZFczQ0NhcGFiaWxpdGllcyA9IHtcbiAgICAgIGFsd2F5c01hdGNoOiB7Li4uaW5zZXJ0QXBwaXVtUHJlZml4ZXMoZGVzaXJlZENhcHMpfSxcbiAgICAgIGZpcnN0TWF0Y2g6IFt7fV0sXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7ZGVzaXJlZENhcHMsIHByb2Nlc3NlZEpzb253cENhcGFiaWxpdGllcywgcHJvY2Vzc2VkVzNDQ2FwYWJpbGl0aWVzLCBwcm90b2NvbH07XG59XG5cbi8qKlxuICogVGhpcyBoZWxwZXIgbWV0aG9kIHRyaWVzIHRvIGZpeCBjb3JydXB0ZWQgVzNDIGNhcGFiaWxpdGllcyBieVxuICogbWVyZ2luZyB0aGVtIHRvIGV4aXN0aW5nIEpTT05XUCBjYXBhYmlsaXRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHczY0NhcHMgVzNDIGNhcGFiaWxpdGllc1xuICogQHBhcmFtIHtPYmplY3R9IGpzb253cENhcHMgSlNPTldQIGNhcGFiaWxpdGllc1xuICogQHJldHVybnMge09iamVjdH0gRml4ZWQgVzNDIGNhcGFiaWxpdGllc1xuICovXG5mdW5jdGlvbiBmaXhXM2NDYXBhYmlsaXRpZXMgKHczY0NhcHMsIGpzb253cENhcHMpIHtcbiAgY29uc3QgcmVzdWx0ID0ge1xuICAgIGZpcnN0TWF0Y2g6IHczY0NhcHMuZmlyc3RNYXRjaCB8fCBbXSxcbiAgICBhbHdheXNNYXRjaDogdzNjQ2Fwcy5hbHdheXNNYXRjaCB8fCB7fSxcbiAgfTtcbiAgY29uc3Qga2V5c1RvSW5zZXJ0ID0gXy5rZXlzKGpzb253cENhcHMpO1xuICBjb25zdCByZW1vdmVNYXRjaGluZ0tleXMgPSAobWF0Y2gpID0+IHtcbiAgICBfLnB1bGwoa2V5c1RvSW5zZXJ0LCBtYXRjaCk7XG4gICAgY29uc3QgY29sb25JbmRleCA9IG1hdGNoLmluZGV4T2YoJzonKTtcbiAgICBpZiAoY29sb25JbmRleCA+PSAwICYmIG1hdGNoLmxlbmd0aCA+IGNvbG9uSW5kZXgpIHtcbiAgICAgIF8ucHVsbChrZXlzVG9JbnNlcnQsIG1hdGNoLnN1YnN0cmluZyhjb2xvbkluZGV4ICsgMSkpO1xuICAgIH1cbiAgICBpZiAoa2V5c1RvSW5zZXJ0LmluY2x1ZGVzKGAke1czQ19BUFBJVU1fUFJFRklYfToke21hdGNofWApKSB7XG4gICAgICBfLnB1bGwoa2V5c1RvSW5zZXJ0LCBgJHtXM0NfQVBQSVVNX1BSRUZJWH06JHttYXRjaH1gKTtcbiAgICB9XG4gIH07XG5cbiAgZm9yIChjb25zdCBmaXJzdE1hdGNoRW50cnkgb2YgcmVzdWx0LmZpcnN0TWF0Y2gpIHtcbiAgICBmb3IgKGNvbnN0IHBhaXIgb2YgXy50b1BhaXJzKGZpcnN0TWF0Y2hFbnRyeSkpIHtcbiAgICAgIHJlbW92ZU1hdGNoaW5nS2V5cyhwYWlyWzBdKTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHBhaXIgb2YgXy50b1BhaXJzKHJlc3VsdC5hbHdheXNNYXRjaCkpIHtcbiAgICByZW1vdmVNYXRjaGluZ0tleXMocGFpclswXSk7XG4gIH1cblxuICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzVG9JbnNlcnQpIHtcbiAgICByZXN1bHQuYWx3YXlzTWF0Y2hba2V5XSA9IGpzb253cENhcHNba2V5XTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFRha2VzIGEgY2FwYWJpbGl0aWVzIG9iamVjdHMgYW5kIHByZWZpeGVzIGNhcGFiaWxpdGllcyB3aXRoIGBhcHBpdW06YFxuICogQHBhcmFtIHtPYmplY3R9IGNhcHMgRGVzaXJlZCBjYXBhYmlsaXRpZXMgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGluc2VydEFwcGl1bVByZWZpeGVzIChjYXBzKSB7XG4gIC8vIFN0YW5kYXJkLCBub24tcHJlZml4ZWQgY2FwYWJpbGl0aWVzIChzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dlYmRyaXZlci8jZGZuLXRhYmxlLW9mLXN0YW5kYXJkLWNhcGFiaWxpdGllcylcbiAgY29uc3QgU1RBTkRBUkRfQ0FQUyA9IFtcbiAgICAnYnJvd3Nlck5hbWUnLFxuICAgICdicm93c2VyVmVyc2lvbicsXG4gICAgJ3BsYXRmb3JtTmFtZScsXG4gICAgJ2FjY2VwdEluc2VjdXJlQ2VydHMnLFxuICAgICdwYWdlTG9hZFN0cmF0ZWd5JyxcbiAgICAncHJveHknLFxuICAgICdzZXRXaW5kb3dSZWN0JyxcbiAgICAndGltZW91dHMnLFxuICAgICd1bmhhbmRsZWRQcm9tcHRCZWhhdmlvcidcbiAgXTtcblxuICBsZXQgcHJlZml4ZWRDYXBzID0ge307XG4gIGZvciAobGV0IFtuYW1lLCB2YWx1ZV0gb2YgXy50b1BhaXJzKGNhcHMpKSB7XG4gICAgaWYgKFNUQU5EQVJEX0NBUFMuaW5jbHVkZXMobmFtZSkgfHwgbmFtZS5pbmNsdWRlcygnOicpKSB7XG4gICAgICBwcmVmaXhlZENhcHNbbmFtZV0gPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJlZml4ZWRDYXBzW2Ake1czQ19BUFBJVU1fUFJFRklYfToke25hbWV9YF0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHByZWZpeGVkQ2Fwcztcbn1cblxuZnVuY3Rpb24gcmVtb3ZlVzNDUHJlZml4ZXMgKGNhcHMpIHtcbiAgaWYgKCFfLmlzUGxhaW5PYmplY3QoY2FwcykpIHtcbiAgICByZXR1cm4gY2FwcztcbiAgfVxuXG4gIGNvbnN0IGZpeGVkQ2FwcyA9IHt9O1xuICBmb3IgKGxldCBbbmFtZSwgdmFsdWVdIG9mIF8udG9QYWlycyhjYXBzKSkge1xuICAgIGZpeGVkQ2Fwc1tyZW1vdmVXM0NQcmVmaXgobmFtZSldID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIGZpeGVkQ2Fwcztcbn1cblxuZnVuY3Rpb24gcmVtb3ZlVzNDUHJlZml4IChrZXkpIHtcbiAgY29uc3QgY29sb25Qb3MgPSBrZXkuaW5kZXhPZignOicpO1xuICByZXR1cm4gY29sb25Qb3MgPiAwICYmIGtleS5sZW5ndGggPiBjb2xvblBvcyA/IGtleS5zdWJzdHJpbmcoY29sb25Qb3MgKyAxKSA6IGtleTtcbn1cblxuZnVuY3Rpb24gZ2V0UGFja2FnZVZlcnNpb24gKHBrZ05hbWUpIHtcbiAgY29uc3QgcGtnSW5mbyA9IHJlcXVpcmUoYCR7cGtnTmFtZX0vcGFja2FnZS5qc29uYCkgfHwge307XG4gIHJldHVybiBwa2dJbmZvLnZlcnNpb247XG59XG5cbmNvbnN0IHJvb3REaXIgPSBmaW5kUm9vdChfX2Rpcm5hbWUpO1xuXG5leHBvcnQgeyBpbnNwZWN0T2JqZWN0LCBwYXJzZUNhcHNGb3JJbm5lckRyaXZlciwgaW5zZXJ0QXBwaXVtUHJlZml4ZXMsIHJvb3REaXIsXG4gICAgICAgICBnZXRQYWNrYWdlVmVyc2lvbiB9O1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLiJ9
