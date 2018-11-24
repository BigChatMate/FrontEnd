'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _libUtils = require('../lib/utils');

var _helpers = require('./helpers');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var should = _chai2['default'].should();
_chai2['default'].use(_chaiAsPromised2['default']);

describe('utils', function () {
  describe('parseCapsForInnerDriver()', function () {
    it('should return JSONWP caps unchanged if only JSONWP caps provided', function () {
      var _parseCapsForInnerDriver = (0, _libUtils.parseCapsForInnerDriver)(_helpers.BASE_CAPS);

      var desiredCaps = _parseCapsForInnerDriver.desiredCaps;
      var processedJsonwpCapabilities = _parseCapsForInnerDriver.processedJsonwpCapabilities;
      var processedW3CCapabilities = _parseCapsForInnerDriver.processedW3CCapabilities;
      var protocol = _parseCapsForInnerDriver.protocol;

      desiredCaps.should.deep.equal(_helpers.BASE_CAPS);
      processedJsonwpCapabilities.should.deep.equal(_helpers.BASE_CAPS);
      should.not.exist(processedW3CCapabilities);
      protocol.should.equal('MJSONWP');
    });
    it('should return W3C caps unchanged if only W3C caps were provided', function () {
      var _parseCapsForInnerDriver2 = (0, _libUtils.parseCapsForInnerDriver)(undefined, _helpers.W3C_CAPS);

      var desiredCaps = _parseCapsForInnerDriver2.desiredCaps;
      var processedJsonwpCapabilities = _parseCapsForInnerDriver2.processedJsonwpCapabilities;
      var processedW3CCapabilities = _parseCapsForInnerDriver2.processedW3CCapabilities;
      var protocol = _parseCapsForInnerDriver2.protocol;

      desiredCaps.should.deep.equal(_helpers.BASE_CAPS);
      should.not.exist(processedJsonwpCapabilities);
      processedW3CCapabilities.should.deep.equal(_helpers.W3C_CAPS);
      protocol.should.equal('W3C');
    });
    it('should return JSONWP and W3C caps if both were provided', function () {
      var _parseCapsForInnerDriver3 = (0, _libUtils.parseCapsForInnerDriver)(_helpers.BASE_CAPS, _helpers.W3C_CAPS);

      var desiredCaps = _parseCapsForInnerDriver3.desiredCaps;
      var processedJsonwpCapabilities = _parseCapsForInnerDriver3.processedJsonwpCapabilities;
      var processedW3CCapabilities = _parseCapsForInnerDriver3.processedW3CCapabilities;
      var protocol = _parseCapsForInnerDriver3.protocol;

      desiredCaps.should.deep.equal(_helpers.BASE_CAPS);
      processedJsonwpCapabilities.should.deep.equal(_helpers.BASE_CAPS);
      processedW3CCapabilities.should.deep.equal(_helpers.W3C_CAPS);
      protocol.should.equal('W3C');
    });
    it('should include default capabilities in results', function () {
      var _parseCapsForInnerDriver4 = (0, _libUtils.parseCapsForInnerDriver)(_helpers.BASE_CAPS, _helpers.W3C_CAPS, {}, { foo: 'bar' });

      var desiredCaps = _parseCapsForInnerDriver4.desiredCaps;
      var processedJsonwpCapabilities = _parseCapsForInnerDriver4.processedJsonwpCapabilities;
      var processedW3CCapabilities = _parseCapsForInnerDriver4.processedW3CCapabilities;

      desiredCaps.should.deep.equal(_extends({ foo: 'bar' }, _helpers.BASE_CAPS));
      processedJsonwpCapabilities.should.deep.equal(_extends({ foo: 'bar' }, _helpers.BASE_CAPS));
      processedW3CCapabilities.alwaysMatch.should.deep.equal(_extends({ 'appium:foo': 'bar' }, (0, _libUtils.insertAppiumPrefixes)(_helpers.BASE_CAPS)));
    });
    it('should rewrite default capabilities in results', function () {
      var baseCapsWithDefault = _Object$assign({}, _helpers.BASE_CAPS, {
        foo: 'baz',
        'appium:foo2': 'baz2'
      });
      var w3cCapsWithDefault = _lodash2['default'].cloneDeep(_helpers.W3C_CAPS);
      w3cCapsWithDefault.alwaysMatch.foo = 'baz';
      w3cCapsWithDefault.alwaysMatch.foo2 = 'baz2';

      var _parseCapsForInnerDriver5 = (0, _libUtils.parseCapsForInnerDriver)(baseCapsWithDefault, w3cCapsWithDefault, {}, {
        foo: 'bar',
        'appium:foo2': 'bar2'
      });

      var desiredCaps = _parseCapsForInnerDriver5.desiredCaps;
      var processedJsonwpCapabilities = _parseCapsForInnerDriver5.processedJsonwpCapabilities;
      var processedW3CCapabilities = _parseCapsForInnerDriver5.processedW3CCapabilities;

      desiredCaps.should.deep.equal(_extends({ foo: 'baz', foo2: 'baz2' }, _helpers.BASE_CAPS));
      processedJsonwpCapabilities.should.deep.equal(_extends({ foo: 'baz', foo2: 'baz2' }, _helpers.BASE_CAPS));
      processedW3CCapabilities.alwaysMatch.should.deep.equal(_extends({ 'appium:foo': 'baz', 'appium:foo2': 'baz2' }, (0, _libUtils.insertAppiumPrefixes)(_helpers.BASE_CAPS)));
    });
    it('should reject if W3C caps are not passing constraints', function () {
      var err = (0, _libUtils.parseCapsForInnerDriver)(undefined, _helpers.W3C_CAPS, { hello: { presence: true } }).error;
      err.message.should.match(/'hello' can't be blank/);
      _lodash2['default'].isError(err).should.be['true'];
    });
    it('should only accept W3C caps that have passing constraints', function () {
      var w3cCaps = _extends({}, _helpers.W3C_CAPS, {
        firstMatch: [{ foo: 'bar' }, { hello: 'world' }]
      });

      var _parseCapsForInnerDriver6 = (0, _libUtils.parseCapsForInnerDriver)(_helpers.BASE_CAPS, w3cCaps, { hello: { presence: true } });

      var desiredCaps = _parseCapsForInnerDriver6.desiredCaps;
      var processedJsonwpCapabilities = _parseCapsForInnerDriver6.processedJsonwpCapabilities;
      var processedW3CCapabilities = _parseCapsForInnerDriver6.processedW3CCapabilities;
      var protocol = _parseCapsForInnerDriver6.protocol;

      var expectedResult = _extends({ hello: 'world' }, _helpers.BASE_CAPS);
      desiredCaps.should.deep.equal(expectedResult);
      processedJsonwpCapabilities.should.deep.equal(_extends({}, _helpers.BASE_CAPS));
      processedW3CCapabilities.alwaysMatch.should.deep.equal((0, _libUtils.insertAppiumPrefixes)(expectedResult));
      protocol.should.equal('W3C');
    });
    it('should add appium prefixes to W3C caps that are not standard in W3C', function () {
      (0, _libUtils.parseCapsForInnerDriver)(undefined, {
        alwaysMatch: {
          platformName: 'Fake',
          propertyName: 'PROP_NAME'
        }
      }).processedW3CCapabilities.should.deep.equal({
        alwaysMatch: {
          platformName: 'Fake',
          'appium:propertyName': 'PROP_NAME'
        },
        firstMatch: [{}]
      });
    });
    it('should merge extraneous MJSONWP caps into W3C', function () {
      var jsonwpCaps = _extends({}, _helpers.BASE_CAPS, {
        automationName: 'Fake'
      });

      var _parseCapsForInnerDriver7 = (0, _libUtils.parseCapsForInnerDriver)(jsonwpCaps, {
        alwaysMatch: { platformName: 'Fake', propertyName: 'PROP_NAME' }
      });

      var desiredCaps = _parseCapsForInnerDriver7.desiredCaps;
      var processedJsonwpCapabilities = _parseCapsForInnerDriver7.processedJsonwpCapabilities;
      var processedW3CCapabilities = _parseCapsForInnerDriver7.processedW3CCapabilities;
      var protocol = _parseCapsForInnerDriver7.protocol;

      // We expect a combo of jsonwp caps and w3c provided caps with `appium:` prefix for non-standard caps
      var expectedCaps = {};

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(_lodash2['default'].toPairs(jsonwpCaps)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2);

          var key = _step$value[0];
          var value = _step$value[1];

          if (key !== 'platformName') {
            expectedCaps['appium:' + key] = value;
          } else {
            expectedCaps[key] = value;
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

      expectedCaps['appium:propertyName'] = 'PROP_NAME';

      processedW3CCapabilities.alwaysMatch.should.eql(expectedCaps);
      desiredCaps.should.eql(_extends({}, jsonwpCaps, {
        propertyName: 'PROP_NAME'
      }));
      processedJsonwpCapabilities.should.eql(jsonwpCaps);
      protocol.should.equal('W3C');
    });
    it('should fix W3C caps by using MJSONWP if invalid W3C caps were provided', function () {
      var w3cCapabilities = {
        alwaysMatch: { platformName: 'Fake', propertyName: 'PROP_NAME' }
      };
      var constraints = {
        deviceName: {
          presence: true
        }
      };

      var _parseCapsForInnerDriver8 = (0, _libUtils.parseCapsForInnerDriver)(_extends({}, _helpers.BASE_CAPS), w3cCapabilities, constraints);

      var desiredCaps = _parseCapsForInnerDriver8.desiredCaps;
      var processedJsonwpCapabilities = _parseCapsForInnerDriver8.processedJsonwpCapabilities;
      var processedW3CCapabilities = _parseCapsForInnerDriver8.processedW3CCapabilities;
      var protocol = _parseCapsForInnerDriver8.protocol;

      processedW3CCapabilities.should.exist;
      desiredCaps.should.eql(_extends({}, _helpers.BASE_CAPS, { propertyName: 'PROP_NAME' }));
      processedJsonwpCapabilities.should.eql(_helpers.BASE_CAPS);
      protocol.should.equal('W3C');
    });
  });

  describe('insertAppiumPrefixes()', function () {
    it('should apply prefixes to non-standard capabilities', function () {
      (0, _libUtils.insertAppiumPrefixes)({
        someCap: 'someCap'
      }).should.deep.equal({
        'appium:someCap': 'someCap'
      });
    });
    it('should not apply prefixes to standard capabilities', function () {
      (0, _libUtils.insertAppiumPrefixes)({
        browserName: 'BrowserName',
        platformName: 'PlatformName'
      }).should.deep.equal({
        browserName: 'BrowserName',
        platformName: 'PlatformName'
      });
    });
    it('should not apply prefixes to capabilities that already have a prefix', function () {
      (0, _libUtils.insertAppiumPrefixes)({
        'appium:someCap': 'someCap',
        'moz:someOtherCap': 'someOtherCap'
      }).should.deep.equal({
        'appium:someCap': 'someCap',
        'moz:someOtherCap': 'someOtherCap'
      });
    });
    it('should apply prefixes to non-prefixed, non-standard capabilities; should not apply prefixes to any other capabilities', function () {
      (0, _libUtils.insertAppiumPrefixes)({
        'appium:someCap': 'someCap',
        'moz:someOtherCap': 'someOtherCap',
        browserName: 'BrowserName',
        platformName: 'PlatformName',
        someOtherCap: 'someOtherCap',
        yetAnotherCap: 'yetAnotherCap'
      }).should.deep.equal({
        'appium:someCap': 'someCap',
        'moz:someOtherCap': 'someOtherCap',
        browserName: 'BrowserName',
        platformName: 'PlatformName',
        'appium:someOtherCap': 'someOtherCap',
        'appium:yetAnotherCap': 'yetAnotherCap'
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,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cnQgY2hhaSBmcm9tICdjaGFpJztcbmltcG9ydCBjaGFpQXNQcm9taXNlZCBmcm9tICdjaGFpLWFzLXByb21pc2VkJztcbmltcG9ydCB7IHBhcnNlQ2Fwc0ZvcklubmVyRHJpdmVyLCBpbnNlcnRBcHBpdW1QcmVmaXhlcyB9IGZyb20gJy4uL2xpYi91dGlscyc7XG5pbXBvcnQgeyBCQVNFX0NBUFMsIFczQ19DQVBTIH0gZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cblxuY29uc3Qgc2hvdWxkID0gY2hhaS5zaG91bGQoKTtcbmNoYWkudXNlKGNoYWlBc1Byb21pc2VkKTtcblxuZGVzY3JpYmUoJ3V0aWxzJywgZnVuY3Rpb24gKCkge1xuICBkZXNjcmliZSgncGFyc2VDYXBzRm9ySW5uZXJEcml2ZXIoKScsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBKU09OV1AgY2FwcyB1bmNoYW5nZWQgaWYgb25seSBKU09OV1AgY2FwcyBwcm92aWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCB7ZGVzaXJlZENhcHMsIHByb2Nlc3NlZEpzb253cENhcGFiaWxpdGllcywgcHJvY2Vzc2VkVzNDQ2FwYWJpbGl0aWVzLCBwcm90b2NvbH0gPSBwYXJzZUNhcHNGb3JJbm5lckRyaXZlcihCQVNFX0NBUFMpO1xuICAgICAgZGVzaXJlZENhcHMuc2hvdWxkLmRlZXAuZXF1YWwoQkFTRV9DQVBTKTtcbiAgICAgIHByb2Nlc3NlZEpzb253cENhcGFiaWxpdGllcy5zaG91bGQuZGVlcC5lcXVhbChCQVNFX0NBUFMpO1xuICAgICAgc2hvdWxkLm5vdC5leGlzdChwcm9jZXNzZWRXM0NDYXBhYmlsaXRpZXMpO1xuICAgICAgcHJvdG9jb2wuc2hvdWxkLmVxdWFsKCdNSlNPTldQJyk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gVzNDIGNhcHMgdW5jaGFuZ2VkIGlmIG9ubHkgVzNDIGNhcHMgd2VyZSBwcm92aWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCB7ZGVzaXJlZENhcHMsIHByb2Nlc3NlZEpzb253cENhcGFiaWxpdGllcywgcHJvY2Vzc2VkVzNDQ2FwYWJpbGl0aWVzLCBwcm90b2NvbH0gPSBwYXJzZUNhcHNGb3JJbm5lckRyaXZlcih1bmRlZmluZWQsIFczQ19DQVBTKTtcbiAgICAgIGRlc2lyZWRDYXBzLnNob3VsZC5kZWVwLmVxdWFsKEJBU0VfQ0FQUyk7XG4gICAgICBzaG91bGQubm90LmV4aXN0KHByb2Nlc3NlZEpzb253cENhcGFiaWxpdGllcyk7XG4gICAgICBwcm9jZXNzZWRXM0NDYXBhYmlsaXRpZXMuc2hvdWxkLmRlZXAuZXF1YWwoVzNDX0NBUFMpO1xuICAgICAgcHJvdG9jb2wuc2hvdWxkLmVxdWFsKCdXM0MnKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBKU09OV1AgYW5kIFczQyBjYXBzIGlmIGJvdGggd2VyZSBwcm92aWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCB7ZGVzaXJlZENhcHMsIHByb2Nlc3NlZEpzb253cENhcGFiaWxpdGllcywgcHJvY2Vzc2VkVzNDQ2FwYWJpbGl0aWVzLCBwcm90b2NvbH0gPSBwYXJzZUNhcHNGb3JJbm5lckRyaXZlcihCQVNFX0NBUFMsIFczQ19DQVBTKTtcbiAgICAgIGRlc2lyZWRDYXBzLnNob3VsZC5kZWVwLmVxdWFsKEJBU0VfQ0FQUyk7XG4gICAgICBwcm9jZXNzZWRKc29ud3BDYXBhYmlsaXRpZXMuc2hvdWxkLmRlZXAuZXF1YWwoQkFTRV9DQVBTKTtcbiAgICAgIHByb2Nlc3NlZFczQ0NhcGFiaWxpdGllcy5zaG91bGQuZGVlcC5lcXVhbChXM0NfQ0FQUyk7XG4gICAgICBwcm90b2NvbC5zaG91bGQuZXF1YWwoJ1czQycpO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgaW5jbHVkZSBkZWZhdWx0IGNhcGFiaWxpdGllcyBpbiByZXN1bHRzJywgZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IHtkZXNpcmVkQ2FwcywgcHJvY2Vzc2VkSnNvbndwQ2FwYWJpbGl0aWVzLCBwcm9jZXNzZWRXM0NDYXBhYmlsaXRpZXN9ID0gcGFyc2VDYXBzRm9ySW5uZXJEcml2ZXIoQkFTRV9DQVBTLCBXM0NfQ0FQUywge30sIHtmb286ICdiYXInfSk7XG4gICAgICBkZXNpcmVkQ2Fwcy5zaG91bGQuZGVlcC5lcXVhbCh7Zm9vOiAnYmFyJywgLi4uQkFTRV9DQVBTfSk7XG4gICAgICBwcm9jZXNzZWRKc29ud3BDYXBhYmlsaXRpZXMuc2hvdWxkLmRlZXAuZXF1YWwoe2ZvbzogJ2JhcicsIC4uLkJBU0VfQ0FQU30pO1xuICAgICAgcHJvY2Vzc2VkVzNDQ2FwYWJpbGl0aWVzLmFsd2F5c01hdGNoLnNob3VsZC5kZWVwLmVxdWFsKHsnYXBwaXVtOmZvbyc6ICdiYXInLCAuLi5pbnNlcnRBcHBpdW1QcmVmaXhlcyhCQVNFX0NBUFMpfSk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCByZXdyaXRlIGRlZmF1bHQgY2FwYWJpbGl0aWVzIGluIHJlc3VsdHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBiYXNlQ2Fwc1dpdGhEZWZhdWx0ID0gT2JqZWN0LmFzc2lnbih7fSwgQkFTRV9DQVBTLCB7XG4gICAgICAgIGZvbzogJ2JheicsXG4gICAgICAgICdhcHBpdW06Zm9vMic6ICdiYXoyJyxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdzNjQ2Fwc1dpdGhEZWZhdWx0ID0gXy5jbG9uZURlZXAoVzNDX0NBUFMpO1xuICAgICAgdzNjQ2Fwc1dpdGhEZWZhdWx0LmFsd2F5c01hdGNoLmZvbyA9ICdiYXonO1xuICAgICAgdzNjQ2Fwc1dpdGhEZWZhdWx0LmFsd2F5c01hdGNoLmZvbzIgPSAnYmF6Mic7XG4gICAgICBsZXQge2Rlc2lyZWRDYXBzLCBwcm9jZXNzZWRKc29ud3BDYXBhYmlsaXRpZXMsIHByb2Nlc3NlZFczQ0NhcGFiaWxpdGllc30gPSBwYXJzZUNhcHNGb3JJbm5lckRyaXZlcihiYXNlQ2Fwc1dpdGhEZWZhdWx0LCB3M2NDYXBzV2l0aERlZmF1bHQsIHt9LCB7XG4gICAgICAgIGZvbzogJ2JhcicsXG4gICAgICAgICdhcHBpdW06Zm9vMic6ICdiYXIyJyxcbiAgICAgIH0pO1xuICAgICAgZGVzaXJlZENhcHMuc2hvdWxkLmRlZXAuZXF1YWwoe2ZvbzogJ2JheicsIGZvbzI6ICdiYXoyJywgLi4uQkFTRV9DQVBTfSk7XG4gICAgICBwcm9jZXNzZWRKc29ud3BDYXBhYmlsaXRpZXMuc2hvdWxkLmRlZXAuZXF1YWwoe2ZvbzogJ2JheicsIGZvbzI6ICdiYXoyJywgLi4uQkFTRV9DQVBTfSk7XG4gICAgICBwcm9jZXNzZWRXM0NDYXBhYmlsaXRpZXMuYWx3YXlzTWF0Y2guc2hvdWxkLmRlZXAuZXF1YWwoeydhcHBpdW06Zm9vJzogJ2JheicsICdhcHBpdW06Zm9vMic6ICdiYXoyJywgLi4uaW5zZXJ0QXBwaXVtUHJlZml4ZXMoQkFTRV9DQVBTKX0pO1xuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgcmVqZWN0IGlmIFczQyBjYXBzIGFyZSBub3QgcGFzc2luZyBjb25zdHJhaW50cycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IGVyciA9IHBhcnNlQ2Fwc0ZvcklubmVyRHJpdmVyKHVuZGVmaW5lZCwgVzNDX0NBUFMsIHtoZWxsbzoge3ByZXNlbmNlOiB0cnVlfX0pLmVycm9yO1xuICAgICAgZXJyLm1lc3NhZ2Uuc2hvdWxkLm1hdGNoKC8naGVsbG8nIGNhbid0IGJlIGJsYW5rLyk7XG4gICAgICBfLmlzRXJyb3IoZXJyKS5zaG91bGQuYmUudHJ1ZTtcblxuICAgIH0pO1xuICAgIGl0KCdzaG91bGQgb25seSBhY2NlcHQgVzNDIGNhcHMgdGhhdCBoYXZlIHBhc3NpbmcgY29uc3RyYWludHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgdzNjQ2FwcyA9IHtcbiAgICAgICAgLi4uVzNDX0NBUFMsXG4gICAgICAgIGZpcnN0TWF0Y2g6IFtcbiAgICAgICAgICB7Zm9vOiAnYmFyJ30sXG4gICAgICAgICAge2hlbGxvOiAnd29ybGQnfSxcbiAgICAgICAgXSxcbiAgICAgIH07XG4gICAgICBsZXQge2Rlc2lyZWRDYXBzLCBwcm9jZXNzZWRKc29ud3BDYXBhYmlsaXRpZXMsIHByb2Nlc3NlZFczQ0NhcGFiaWxpdGllcywgcHJvdG9jb2x9ID0gcGFyc2VDYXBzRm9ySW5uZXJEcml2ZXIoQkFTRV9DQVBTLCB3M2NDYXBzLCB7aGVsbG86IHtwcmVzZW5jZTogdHJ1ZX19KTtcbiAgICAgIGNvbnN0IGV4cGVjdGVkUmVzdWx0ID0ge2hlbGxvOiAnd29ybGQnLCAuLi5CQVNFX0NBUFN9O1xuICAgICAgZGVzaXJlZENhcHMuc2hvdWxkLmRlZXAuZXF1YWwoZXhwZWN0ZWRSZXN1bHQpO1xuICAgICAgcHJvY2Vzc2VkSnNvbndwQ2FwYWJpbGl0aWVzLnNob3VsZC5kZWVwLmVxdWFsKHsuLi5CQVNFX0NBUFN9KTtcbiAgICAgIHByb2Nlc3NlZFczQ0NhcGFiaWxpdGllcy5hbHdheXNNYXRjaC5zaG91bGQuZGVlcC5lcXVhbChpbnNlcnRBcHBpdW1QcmVmaXhlcyhleHBlY3RlZFJlc3VsdCkpO1xuICAgICAgcHJvdG9jb2wuc2hvdWxkLmVxdWFsKCdXM0MnKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIGFkZCBhcHBpdW0gcHJlZml4ZXMgdG8gVzNDIGNhcHMgdGhhdCBhcmUgbm90IHN0YW5kYXJkIGluIFczQycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHBhcnNlQ2Fwc0ZvcklubmVyRHJpdmVyKHVuZGVmaW5lZCwge1xuICAgICAgICBhbHdheXNNYXRjaDoge1xuICAgICAgICAgIHBsYXRmb3JtTmFtZTogJ0Zha2UnLFxuICAgICAgICAgIHByb3BlcnR5TmFtZTogJ1BST1BfTkFNRScsXG4gICAgICAgIH0sXG4gICAgICB9KS5wcm9jZXNzZWRXM0NDYXBhYmlsaXRpZXMuc2hvdWxkLmRlZXAuZXF1YWwoe1xuICAgICAgICBhbHdheXNNYXRjaDoge1xuICAgICAgICAgIHBsYXRmb3JtTmFtZTogJ0Zha2UnLFxuICAgICAgICAgICdhcHBpdW06cHJvcGVydHlOYW1lJzogJ1BST1BfTkFNRScsXG4gICAgICAgIH0sXG4gICAgICAgIGZpcnN0TWF0Y2g6IFt7fV0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIG1lcmdlIGV4dHJhbmVvdXMgTUpTT05XUCBjYXBzIGludG8gVzNDJywgZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGpzb253cENhcHMgPSB7XG4gICAgICAgIC4uLkJBU0VfQ0FQUyxcbiAgICAgICAgYXV0b21hdGlvbk5hbWU6ICdGYWtlJyxcbiAgICAgIH07XG4gICAgICBjb25zdCB7ZGVzaXJlZENhcHMsIHByb2Nlc3NlZEpzb253cENhcGFiaWxpdGllcywgcHJvY2Vzc2VkVzNDQ2FwYWJpbGl0aWVzLCBwcm90b2NvbH0gPSBwYXJzZUNhcHNGb3JJbm5lckRyaXZlcihqc29ud3BDYXBzLCB7XG4gICAgICAgIGFsd2F5c01hdGNoOiB7cGxhdGZvcm1OYW1lOiAnRmFrZScsIHByb3BlcnR5TmFtZTogJ1BST1BfTkFNRSd9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdlIGV4cGVjdCBhIGNvbWJvIG9mIGpzb253cCBjYXBzIGFuZCB3M2MgcHJvdmlkZWQgY2FwcyB3aXRoIGBhcHBpdW06YCBwcmVmaXggZm9yIG5vbi1zdGFuZGFyZCBjYXBzXG4gICAgICBjb25zdCBleHBlY3RlZENhcHMgPSB7fTtcblxuICAgICAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIF8udG9QYWlycyhqc29ud3BDYXBzKSkge1xuICAgICAgICBpZiAoa2V5ICE9PSAncGxhdGZvcm1OYW1lJykge1xuICAgICAgICAgIGV4cGVjdGVkQ2Fwc1tgYXBwaXVtOiR7a2V5fWBdID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhwZWN0ZWRDYXBzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZXhwZWN0ZWRDYXBzWydhcHBpdW06cHJvcGVydHlOYW1lJ10gPSAnUFJPUF9OQU1FJztcblxuICAgICAgcHJvY2Vzc2VkVzNDQ2FwYWJpbGl0aWVzLmFsd2F5c01hdGNoLnNob3VsZC5lcWwoZXhwZWN0ZWRDYXBzKTtcbiAgICAgIGRlc2lyZWRDYXBzLnNob3VsZC5lcWwoe1xuICAgICAgICAuLi5qc29ud3BDYXBzLFxuICAgICAgICBwcm9wZXJ0eU5hbWU6ICdQUk9QX05BTUUnLFxuICAgICAgfSk7XG4gICAgICBwcm9jZXNzZWRKc29ud3BDYXBhYmlsaXRpZXMuc2hvdWxkLmVxbChqc29ud3BDYXBzKTtcbiAgICAgIHByb3RvY29sLnNob3VsZC5lcXVhbCgnVzNDJyk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBmaXggVzNDIGNhcHMgYnkgdXNpbmcgTUpTT05XUCBpZiBpbnZhbGlkIFczQyBjYXBzIHdlcmUgcHJvdmlkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgdzNjQ2FwYWJpbGl0aWVzID0ge1xuICAgICAgICBhbHdheXNNYXRjaDoge3BsYXRmb3JtTmFtZTogJ0Zha2UnLCBwcm9wZXJ0eU5hbWU6ICdQUk9QX05BTUUnfSxcbiAgICAgIH07XG4gICAgICBsZXQgY29uc3RyYWludHMgPSB7XG4gICAgICAgIGRldmljZU5hbWU6IHtcbiAgICAgICAgICBwcmVzZW5jZTogdHJ1ZSxcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHtkZXNpcmVkQ2FwcywgcHJvY2Vzc2VkSnNvbndwQ2FwYWJpbGl0aWVzLCBwcm9jZXNzZWRXM0NDYXBhYmlsaXRpZXMsIHByb3RvY29sfSA9IHBhcnNlQ2Fwc0ZvcklubmVyRHJpdmVyKHsuLi5CQVNFX0NBUFN9LCB3M2NDYXBhYmlsaXRpZXMsIGNvbnN0cmFpbnRzKTtcbiAgICAgIHByb2Nlc3NlZFczQ0NhcGFiaWxpdGllcy5zaG91bGQuZXhpc3Q7XG4gICAgICBkZXNpcmVkQ2Fwcy5zaG91bGQuZXFsKHsuLi5CQVNFX0NBUFMsIHByb3BlcnR5TmFtZTogJ1BST1BfTkFNRSd9KTtcbiAgICAgIHByb2Nlc3NlZEpzb253cENhcGFiaWxpdGllcy5zaG91bGQuZXFsKEJBU0VfQ0FQUyk7XG4gICAgICBwcm90b2NvbC5zaG91bGQuZXF1YWwoJ1czQycpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaW5zZXJ0QXBwaXVtUHJlZml4ZXMoKScsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IHByZWZpeGVzIHRvIG5vbi1zdGFuZGFyZCBjYXBhYmlsaXRpZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnNlcnRBcHBpdW1QcmVmaXhlcyh7XG4gICAgICAgIHNvbWVDYXA6ICdzb21lQ2FwJyxcbiAgICAgIH0pLnNob3VsZC5kZWVwLmVxdWFsKHtcbiAgICAgICAgJ2FwcGl1bTpzb21lQ2FwJzogJ3NvbWVDYXAnLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBub3QgYXBwbHkgcHJlZml4ZXMgdG8gc3RhbmRhcmQgY2FwYWJpbGl0aWVzJywgZnVuY3Rpb24gKCkge1xuICAgICAgaW5zZXJ0QXBwaXVtUHJlZml4ZXMoe1xuICAgICAgICBicm93c2VyTmFtZTogJ0Jyb3dzZXJOYW1lJyxcbiAgICAgICAgcGxhdGZvcm1OYW1lOiAnUGxhdGZvcm1OYW1lJyxcbiAgICAgIH0pLnNob3VsZC5kZWVwLmVxdWFsKHtcbiAgICAgICAgYnJvd3Nlck5hbWU6ICdCcm93c2VyTmFtZScsXG4gICAgICAgIHBsYXRmb3JtTmFtZTogJ1BsYXRmb3JtTmFtZScsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIG5vdCBhcHBseSBwcmVmaXhlcyB0byBjYXBhYmlsaXRpZXMgdGhhdCBhbHJlYWR5IGhhdmUgYSBwcmVmaXgnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnNlcnRBcHBpdW1QcmVmaXhlcyh7XG4gICAgICAgICdhcHBpdW06c29tZUNhcCc6ICdzb21lQ2FwJyxcbiAgICAgICAgJ21vejpzb21lT3RoZXJDYXAnOiAnc29tZU90aGVyQ2FwJyxcbiAgICAgIH0pLnNob3VsZC5kZWVwLmVxdWFsKHtcbiAgICAgICAgJ2FwcGl1bTpzb21lQ2FwJzogJ3NvbWVDYXAnLFxuICAgICAgICAnbW96OnNvbWVPdGhlckNhcCc6ICdzb21lT3RoZXJDYXAnLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBhcHBseSBwcmVmaXhlcyB0byBub24tcHJlZml4ZWQsIG5vbi1zdGFuZGFyZCBjYXBhYmlsaXRpZXM7IHNob3VsZCBub3QgYXBwbHkgcHJlZml4ZXMgdG8gYW55IG90aGVyIGNhcGFiaWxpdGllcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGluc2VydEFwcGl1bVByZWZpeGVzKHtcbiAgICAgICAgJ2FwcGl1bTpzb21lQ2FwJzogJ3NvbWVDYXAnLFxuICAgICAgICAnbW96OnNvbWVPdGhlckNhcCc6ICdzb21lT3RoZXJDYXAnLFxuICAgICAgICBicm93c2VyTmFtZTogJ0Jyb3dzZXJOYW1lJyxcbiAgICAgICAgcGxhdGZvcm1OYW1lOiAnUGxhdGZvcm1OYW1lJyxcbiAgICAgICAgc29tZU90aGVyQ2FwOiAnc29tZU90aGVyQ2FwJyxcbiAgICAgICAgeWV0QW5vdGhlckNhcDogJ3lldEFub3RoZXJDYXAnLFxuICAgICAgfSkuc2hvdWxkLmRlZXAuZXF1YWwoe1xuICAgICAgICAnYXBwaXVtOnNvbWVDYXAnOiAnc29tZUNhcCcsXG4gICAgICAgICdtb3o6c29tZU90aGVyQ2FwJzogJ3NvbWVPdGhlckNhcCcsXG4gICAgICAgIGJyb3dzZXJOYW1lOiAnQnJvd3Nlck5hbWUnLFxuICAgICAgICBwbGF0Zm9ybU5hbWU6ICdQbGF0Zm9ybU5hbWUnLFxuICAgICAgICAnYXBwaXVtOnNvbWVPdGhlckNhcCc6ICdzb21lT3RoZXJDYXAnLFxuICAgICAgICAnYXBwaXVtOnlldEFub3RoZXJDYXAnOiAneWV0QW5vdGhlckNhcCcsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiLi4vLi4ifQ==
