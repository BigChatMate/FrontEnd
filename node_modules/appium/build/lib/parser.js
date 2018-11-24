'use strict';

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _argparse = require('argparse');

var _utils = require('./utils');

var args = [[['--shell'], {
  required: false,
  defaultValue: null,
  help: 'Enter REPL mode',
  nargs: 0,
  dest: 'shell'
}], [['--reboot'], {
  defaultValue: false,
  dest: 'reboot',
  action: 'storeTrue',
  required: false,
  help: '(Android-only) reboot emulator after each session and kill it at the end',
  nargs: 0
}], [['--ipa'], {
  required: false,
  defaultValue: null,
  help: '(IOS-only) abs path to compiled .ipa file',
  example: '/abs/path/to/my.ipa',
  dest: 'ipa'
}], [['-a', '--address'], {
  defaultValue: '0.0.0.0',
  required: false,
  example: '0.0.0.0',
  help: 'IP Address to listen on',
  dest: 'address'
}], [['-p', '--port'], {
  defaultValue: 4723,
  required: false,
  type: 'int',
  example: '4723',
  help: 'port to listen on',
  dest: 'port'
}], [['-ca', '--callback-address'], {
  required: false,
  dest: 'callbackAddress',
  defaultValue: null,
  example: '127.0.0.1',
  help: 'callback IP Address (default: same as --address)'
}], [['-cp', '--callback-port'], {
  required: false,
  dest: 'callbackPort',
  defaultValue: null,
  type: 'int',
  example: '4723',
  help: 'callback port (default: same as port)'
}], [['-bp', '--bootstrap-port'], {
  defaultValue: 4724,
  dest: 'bootstrapPort',
  required: false,
  type: 'int',
  example: '4724',
  help: '(Android-only) port to use on device to talk to Appium'
}], [['-r', '--backend-retries'], {
  defaultValue: 3,
  dest: 'backendRetries',
  required: false,
  type: 'int',
  example: '3',
  help: '(iOS-only) How many times to retry launching Instruments ' + 'before saying it crashed or timed out'
}], [['--session-override'], {
  defaultValue: false,
  dest: 'sessionOverride',
  action: 'storeTrue',
  required: false,
  help: 'Enables session override (clobbering)',
  nargs: 0
}], [['-l', '--pre-launch'], {
  defaultValue: false,
  dest: 'launch',
  action: 'storeTrue',
  required: false,
  help: 'Pre-launch the application before allowing the first session ' + '(Requires --app and, for Android, --app-pkg and --app-activity)',
  nargs: 0
}], [['-g', '--log'], {
  defaultValue: null,
  dest: 'log',
  required: false,
  example: '/path/to/appium.log',
  help: 'Also send log output to this file'
}], [['--log-level'], {
  choices: ['info', 'info:debug', 'info:info', 'info:warn', 'info:error', 'warn', 'warn:debug', 'warn:info', 'warn:warn', 'warn:error', 'error', 'error:debug', 'error:info', 'error:warn', 'error:error', 'debug', 'debug:debug', 'debug:info', 'debug:warn', 'debug:error'],
  defaultValue: 'debug',
  dest: 'loglevel',
  required: false,
  example: 'debug',
  help: 'log level; default (console[:file]): debug[:debug]'
}], [['--log-timestamp'], {
  defaultValue: false,
  required: false,
  help: 'Show timestamps in console output',
  nargs: 0,
  action: 'storeTrue',
  dest: 'logTimestamp'
}], [['--local-timezone'], {
  defaultValue: false,
  required: false,
  help: 'Use local timezone for timestamps',
  nargs: 0,
  action: 'storeTrue',
  dest: 'localTimezone'
}], [['--log-no-colors'], {
  defaultValue: false,
  required: false,
  help: 'Do not use colors in console output',
  nargs: 0,
  action: 'storeTrue',
  dest: 'logNoColors'
}], [['-G', '--webhook'], {
  defaultValue: null,
  required: false,
  example: 'localhost:9876',
  dest: 'webhook',
  help: 'Also send log output to this HTTP listener'
}], [['--safari'], {
  defaultValue: false,
  action: 'storeTrue',
  dest: 'safari',
  required: false,
  help: '(IOS-Only) Use the safari app',
  nargs: 0
}], [['--default-device', '-dd'], {
  dest: 'defaultDevice',
  defaultValue: false,
  action: 'storeTrue',
  required: false,
  help: '(IOS-Simulator-only) use the default simulator that instruments ' + 'launches on its own'
}], [['--force-iphone'], {
  defaultValue: false,
  dest: 'forceIphone',
  action: 'storeTrue',
  required: false,
  help: '(IOS-only) Use the iPhone Simulator no matter what the app wants',
  nargs: 0
}], [['--force-ipad'], {
  defaultValue: false,
  dest: 'forceIpad',
  action: 'storeTrue',
  required: false,
  help: '(IOS-only) Use the iPad Simulator no matter what the app wants',
  nargs: 0
}], [['--tracetemplate'], {
  defaultValue: null,
  dest: 'automationTraceTemplatePath',
  required: false,
  example: '/Users/me/Automation.tracetemplate',
  help: '(IOS-only) .tracetemplate file to use with Instruments'
}], [['--instruments'], {
  defaultValue: null,
  dest: 'instrumentsPath',
  require: false,
  example: '/path/to/instruments',
  help: '(IOS-only) path to instruments binary'
}], [['--nodeconfig'], {
  required: false,
  defaultValue: null,
  dest: 'nodeconfig',
  help: 'Configuration JSON file to register appium with selenium grid',
  example: '/abs/path/to/nodeconfig.json'
}], [['-ra', '--robot-address'], {
  defaultValue: '0.0.0.0',
  dest: 'robotAddress',
  required: false,
  example: '0.0.0.0',
  help: 'IP Address of robot'
}], [['-rp', '--robot-port'], {
  defaultValue: -1,
  dest: 'robotPort',
  required: false,
  type: 'int',
  example: '4242',
  help: 'port for robot'
}], [['--selendroid-port'], {
  defaultValue: 8080,
  dest: 'selendroidPort',
  required: false,
  type: 'int',
  example: '8080',
  help: 'Local port used for communication with Selendroid'
}], [['--chromedriver-port'], {
  defaultValue: null,
  dest: 'chromeDriverPort',
  required: false,
  type: 'int',
  example: '9515',
  help: 'Port upon which ChromeDriver will run. If not given, Android driver will pick a random available port.'
}], [['--chromedriver-executable'], {
  defaultValue: null,
  dest: 'chromedriverExecutable',
  required: false,
  help: 'ChromeDriver executable full path'
}], [['--show-config'], {
  defaultValue: false,
  dest: 'showConfig',
  action: 'storeTrue',
  required: false,
  help: 'Show info about the appium server configuration and exit'
}], [['--no-perms-check'], {
  defaultValue: false,
  dest: 'noPermsCheck',
  action: 'storeTrue',
  required: false,
  help: 'Bypass Appium\'s checks to ensure we can read/write necessary files'
}], [['--strict-caps'], {
  defaultValue: false,
  dest: 'enforceStrictCaps',
  action: 'storeTrue',
  required: false,
  help: 'Cause sessions to fail if desired caps are sent in that Appium ' + 'does not recognize as valid for the selected device',
  nargs: 0
}], [['--isolate-sim-device'], {
  defaultValue: false,
  dest: 'isolateSimDevice',
  action: 'storeTrue',
  required: false,
  help: 'Xcode 6 has a bug on some platforms where a certain simulator ' + 'can only be launched without error if all other simulator devices ' + 'are first deleted. This option causes Appium to delete all ' + 'devices other than the one being used by Appium. Note that this ' + 'is a permanent deletion, and you are responsible for using simctl ' + 'or xcode to manage the categories of devices used with Appium.',
  nargs: 0
}], [['--tmp'], {
  defaultValue: null,
  dest: 'tmpDir',
  required: false,
  help: 'Absolute path to directory Appium can use to manage temporary ' + 'files, like built-in iOS apps it needs to move around. On *nix/Mac ' + 'defaults to /tmp, on Windows defaults to C:\\Windows\\Temp'
}], [['--trace-dir'], {
  defaultValue: null,
  dest: 'traceDir',
  required: false,
  help: 'Absolute path to directory Appium use to save ios instruments ' + 'traces, defaults to <tmp dir>/appium-instruments'
}], [['--debug-log-spacing'], {
  dest: 'debugLogSpacing',
  defaultValue: false,
  action: 'storeTrue',
  required: false,
  help: 'Add exaggerated spacing in logs to help with visual inspection'
}], [['--suppress-adb-kill-server'], {
  dest: 'suppressKillServer',
  defaultValue: false,
  action: 'storeTrue',
  required: false,
  help: '(Android-only) If set, prevents Appium from killing the adb server instance',
  nargs: 0
}], [['--long-stacktrace'], {
  dest: 'longStacktrace',
  defaultValue: false,
  required: false,
  action: 'storeTrue',
  help: 'Add long stack traces to log entries. Recommended for debugging only.'
}], [['--webkit-debug-proxy-port'], {
  defaultValue: 27753,
  dest: 'webkitDebugProxyPort',
  required: false,
  type: 'int',
  example: "27753",
  help: '(IOS-only) Local port used for communication with ios-webkit-debug-proxy'
}], [['--webdriveragent-port'], {
  defaultValue: 8100,
  dest: 'wdaLocalPort',
  required: false,
  type: 'int',
  example: "8100",
  help: '(IOS-only, XCUITest-only) Local port used for communication with WebDriverAgent'
}], [['-dc', '--default-capabilities'], {
  dest: 'defaultCapabilities',
  defaultValue: {},
  type: parseDefaultCaps,
  required: false,
  example: '[ \'{"app": "myapp.app", "deviceName": "iPhone Simulator"}\' ' + '| /path/to/caps.json ]',
  help: 'Set the default desired capabilities, which will be set on each ' + 'session unless overridden by received capabilities.'
}], [['--enable-heapdump'], {
  defaultValue: false,
  dest: 'heapdumpEnabled',
  action: 'storeTrue',
  required: false,
  help: 'Enable collection of NodeJS memory heap dumps. This is useful for memory leaks lookup',
  nargs: 0
}], [['--relaxed-security'], {
  defaultValue: false,
  dest: 'relaxedSecurityEnabled',
  action: 'storeTrue',
  required: false,
  help: 'Disable additional security checks, so it is possible to use some advanced features, provided ' + 'by drivers supporting this option. Only enable it if all the ' + 'clients are in the trusted network and it\'s not the case if a client could potentially ' + 'break out of the session sandbox.',
  nargs: 0
}]];

var deprecatedArgs = [[['--command-timeout'], {
  defaultValue: 60,
  dest: 'defaultCommandTimeout',
  type: 'int',
  required: false,
  help: '[DEPRECATED] No effect. This used to be the default command ' + 'timeout for the server to use for all sessions (in seconds and ' + 'should be less than 2147483). Use newCommandTimeout cap instead'
}], [['-k', '--keep-artifacts'], {
  defaultValue: false,
  dest: 'keepArtifacts',
  action: 'storeTrue',
  required: false,
  help: '[DEPRECATED] - no effect, trace is now in tmp dir by default and is ' + 'cleared before each run. Please also refer to the --trace-dir flag.',
  nargs: 0
}], [['--platform-name'], {
  dest: 'platformName',
  defaultValue: null,
  required: false,
  deprecatedFor: '--default-capabilities',
  example: 'iOS',
  help: '[DEPRECATED] - Name of the mobile platform: iOS, Android, or FirefoxOS'
}], [['--platform-version'], {
  dest: 'platformVersion',
  defaultValue: null,
  required: false,
  deprecatedFor: '--default-capabilities',
  example: '7.1',
  help: '[DEPRECATED] - Version of the mobile platform'
}], [['--automation-name'], {
  dest: 'automationName',
  defaultValue: null,
  required: false,
  deprecatedFor: '--default-capabilities',
  example: 'Appium',
  help: '[DEPRECATED] - Name of the automation tool: Appium or Selendroid'
}], [['--device-name'], {
  dest: 'deviceName',
  defaultValue: null,
  required: false,
  deprecatedFor: '--default-capabilities',
  example: 'iPhone Retina (4-inch), Android Emulator',
  help: '[DEPRECATED] - Name of the mobile device to use'
}], [['--browser-name'], {
  dest: 'browserName',
  defaultValue: null,
  required: false,
  deprecatedFor: '--default-capabilities',
  example: 'Safari',
  help: '[DEPRECATED] - Name of the mobile browser: Safari or Chrome'
}], [['--app'], {
  dest: 'app',
  required: false,
  defaultValue: null,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - IOS: abs path to simulator-compiled .app file or the bundle_id of the desired target on device; Android: abs path to .apk file',
  example: '/abs/path/to/my.app'
}], [['-lt', '--launch-timeout'], {
  defaultValue: 90000,
  dest: 'launchTimeout',
  type: 'int',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (iOS-only) how long in ms to wait for Instruments to launch'
}], [['--language'], {
  defaultValue: null,
  dest: 'language',
  required: false,
  example: 'en',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - Language for the iOS simulator / Android Emulator'
}], [['--locale'], {
  defaultValue: null,
  dest: 'locale',
  required: false,
  example: 'en_US',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - Locale for the iOS simulator / Android Emulator'
}], [['-U', '--udid'], {
  dest: 'udid',
  required: false,
  defaultValue: null,
  example: '1adsf-sdfas-asdf-123sdf',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - Unique device identifier of the connected physical device'
}], [['--orientation'], {
  dest: 'orientation',
  defaultValue: null,
  required: false,
  example: 'LANDSCAPE',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (IOS-only) use LANDSCAPE or PORTRAIT to initialize all requests ' + 'to this orientation'
}], [['--no-reset'], {
  defaultValue: false,
  dest: 'noReset',
  action: 'storeTrue',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - Do not reset app state between sessions (IOS: do not delete app ' + 'plist files; Android: do not uninstall app before new session)',
  nargs: 0
}], [['--full-reset'], {
  defaultValue: false,
  dest: 'fullReset',
  action: 'storeTrue',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (iOS) Delete the entire simulator folder. (Android) Reset app ' + 'state by uninstalling app instead of clearing app data. On ' + 'Android, this will also remove the app after the session is complete.',
  nargs: 0
}], [['--app-pkg'], {
  dest: 'appPackage',
  defaultValue: null,
  required: false,
  deprecatedFor: '--default-capabilities',
  example: 'com.example.android.myApp',
  help: '[DEPRECATED] - (Android-only) Java package of the Android app you want to run ' + '(e.g., com.example.android.myApp)'
}], [['--app-activity'], {
  dest: 'appActivity',
  defaultValue: null,
  required: false,
  example: 'MainActivity',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Activity name for the Android activity you want ' + 'to launch from your package (e.g., MainActivity)'
}], [['--app-wait-package'], {
  dest: 'appWaitPackage',
  defaultValue: false,
  required: false,
  example: 'com.example.android.myApp',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Package name for the Android activity you want ' + 'to wait for (e.g., com.example.android.myApp)'
}], [['--app-wait-activity'], {
  dest: 'appWaitActivity',
  defaultValue: false,
  required: false,
  example: 'SplashActivity',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Activity name for the Android activity you want ' + 'to wait for (e.g., SplashActivity)'
}], [['--device-ready-timeout'], {
  dest: 'deviceReadyTimeout',
  defaultValue: 5,
  required: false,
  type: 'int',
  example: '5',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Timeout in seconds while waiting for device to become ready'
}], [['--android-coverage'], {
  dest: 'androidCoverage',
  defaultValue: false,
  required: false,
  example: 'com.my.Pkg/com.my.Pkg.instrumentation.MyInstrumentation',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Fully qualified instrumentation class. Passed to -w in ' + 'adb shell am instrument -e coverage true -w '
}], [['--avd'], {
  dest: 'avd',
  defaultValue: null,
  required: false,
  example: '@default',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Name of the avd to launch'
}], [['--avd-args'], {
  dest: 'avdArgs',
  defaultValue: null,
  required: false,
  example: '-no-snapshot-load',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Additional emulator arguments to launch the avd'
}], [['--use-keystore'], {
  defaultValue: false,
  dest: 'useKeystore',
  action: 'storeTrue',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) When set the keystore will be used to sign apks.'
}], [['--keystore-path'], {
  defaultValue: _path2['default'].resolve(process.env.HOME || process.env.USERPROFILE || '', '.android', 'debug.keystore'),
  dest: 'keystorePath',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Path to keystore'
}], [['--keystore-password'], {
  defaultValue: 'android',
  dest: 'keystorePassword',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Password to keystore'
}], [['--key-alias'], {
  defaultValue: 'androiddebugkey',
  dest: 'keyAlias',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Key alias'
}], [['--key-password'], {
  defaultValue: 'android',
  dest: 'keyPassword',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Key password'
}], [['--intent-action'], {
  dest: 'intentAction',
  defaultValue: 'android.intent.action.MAIN',
  required: false,
  example: 'android.intent.action.MAIN',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Intent action which will be used to start activity'
}], [['--intent-category'], {
  dest: 'intentCategory',
  defaultValue: 'android.intent.category.LAUNCHER',
  required: false,
  example: 'android.intent.category.APP_CONTACTS',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Intent category which will be used to start activity'
}], [['--intent-flags'], {
  dest: 'intentFlags',
  defaultValue: '0x10200000',
  required: false,
  example: '0x10200000',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Flags that will be used to start activity'
}], [['--intent-args'], {
  dest: 'optionalIntentArguments',
  defaultValue: null,
  required: false,
  example: '0x10200000',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) Additional intent arguments that will be used to ' + 'start activity'
}], [['--dont-stop-app-on-reset'], {
  dest: 'dontStopAppOnReset',
  defaultValue: false,
  action: 'storeTrue',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (Android-only) When included, refrains from stopping the app before restart'
}], [['--calendar-format'], {
  defaultValue: null,
  dest: 'calendarFormat',
  required: false,
  example: 'gregorian',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (IOS-only) calendar format for the iOS simulator'
}], [['--native-instruments-lib'], {
  defaultValue: false,
  dest: 'nativeInstrumentsLib',
  action: 'storeTrue',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (IOS-only) IOS has a weird built-in unavoidable ' + 'delay. We patch this in appium. If you do not want it patched, ' + 'pass in this flag.',
  nargs: 0
}], [['--keep-keychains'], {
  defaultValue: false,
  dest: 'keepKeyChains',
  action: 'storeTrue',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (iOS-only) Whether to keep keychains (Library/Keychains) when reset app between sessions',
  nargs: 0
}], [['--localizable-strings-dir'], {
  required: false,
  dest: 'localizableStringsDir',
  defaultValue: 'en.lproj',
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (IOS-only) the relative path of the dir where Localizable.strings file resides ',
  example: 'en.lproj'
}], [['--show-ios-log'], {
  defaultValue: false,
  dest: 'showIOSLog',
  action: 'storeTrue',
  required: false,
  deprecatedFor: '--default-capabilities',
  help: '[DEPRECATED] - (IOS-only) if set, the iOS system log will be written to the console',
  nargs: 0
}], [['--async-trace'], {
  dest: 'longStacktrace',
  defaultValue: false,
  required: false,
  action: 'storeTrue',
  deprecatedFor: '--long-stacktrace',
  help: '[DEPRECATED] - Add long stack traces to log entries. Recommended for debugging only.'
}]];

function updateParseArgsForDefaultCapabilities(parser) {
  // here we want to update the parser.parseArgs() function
  // in order to bring together all the args that are actually
  // default caps.
  // once those deprecated args are actually removed, this
  // can also be removed
  parser._parseArgs = parser.parseArgs;
  parser.parseArgs = function (args) {
    var parsedArgs = parser._parseArgs(args);
    parsedArgs.defaultCapabilities = parsedArgs.defaultCapabilities || {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(deprecatedArgs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var argEntry = _step.value;

        var arg = argEntry[1].dest;
        if (argEntry[1].deprecatedFor === '--default-capabilities') {
          if (arg in parsedArgs && parsedArgs[arg] !== argEntry[1].defaultValue) {
            parsedArgs.defaultCapabilities[arg] = parsedArgs[arg];
            // j s h i n t can't handle complex interpolated strings
            var capDict = _defineProperty({}, arg, parsedArgs[arg]);
            argEntry[1].deprecatedFor = '--default-capabilities ' + ('\'' + JSON.stringify(capDict) + '\'');
          }
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

    return parsedArgs;
  };
}

function parseDefaultCaps(caps) {
  try {
    // use synchronous file access, as `argparse` provides no way of either
    // awaiting or using callbacks. This step happens in startup, in what is
    // effectively command-line code, so nothing is blocked in terms of
    // sessions, so holding up the event loop does not incur the usual
    // drawbacks.
    if (_fs2['default'].statSync(caps).isFile()) {
      caps = _fs2['default'].readFileSync(caps, 'utf8');
    }
  } catch (err) {
    // not a file, or not readable
  }
  caps = JSON.parse(caps);
  if (!_lodash2['default'].isPlainObject(caps)) {
    throw 'Invalid format for default capabilities';
  }
  return caps;
}

function getParser() {
  var parser = new _argparse.ArgumentParser({
    version: require(_path2['default'].resolve(_utils.rootDir, 'package.json')).version,
    addHelp: true,
    description: 'A webdriver-compatible server for use with native and hybrid iOS and Android applications.',
    prog: process.argv[1] || 'Appium'
  });
  var allArgs = _lodash2['default'].union(args, deprecatedArgs);
  parser.rawArgs = allArgs;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = _getIterator(allArgs), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var arg = _step2.value;

      parser.addArgument(arg[0], arg[1]);
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

  updateParseArgsForDefaultCapabilities(parser);

  return parser;
}

function getDefaultArgs() {
  var defaults = {};
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = _getIterator(args), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _step3$value = _slicedToArray(_step3.value, 2);

      var arg = _step3$value[1];

      defaults[arg.dest] = arg.defaultValue;
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

  return defaults;
}

exports['default'] = getParser;
exports.getDefaultArgs = getDefaultArgs;
exports.getParser = getParser;
//# sourceMappingURL=data:application/json;charset=utf8;base64,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LEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3BDOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0QsdUNBQXFDLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTlDLFNBQU8sTUFBTSxDQUFDO0NBQ2Y7O0FBRUQsU0FBUyxjQUFjLEdBQUk7QUFDekIsTUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFDbEIsdUNBQW9CLElBQUksaUhBQUU7OztVQUFkLEdBQUc7O0FBQ2IsY0FBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDO0tBQ3ZDOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0QsU0FBTyxRQUFRLENBQUM7Q0FDakI7O3FCQUVjLFNBQVM7UUFDZixjQUFjLEdBQWQsY0FBYztRQUFFLFNBQVMsR0FBVCxTQUFTIiwiZmlsZSI6ImxpYi9wYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgQXJndW1lbnRQYXJzZXIgfSBmcm9tICdhcmdwYXJzZSc7XG5pbXBvcnQgeyByb290RGlyIH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IGFyZ3MgPSBbXG4gIFtbJy0tc2hlbGwnXSwge1xuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgaGVscDogJ0VudGVyIFJFUEwgbW9kZScsXG4gICAgbmFyZ3M6IDAsXG4gICAgZGVzdDogJ3NoZWxsJyxcbiAgfV0sXG5cbiAgW1snLS1yZWJvb3QnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgZGVzdDogJ3JlYm9vdCcsXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJyhBbmRyb2lkLW9ubHkpIHJlYm9vdCBlbXVsYXRvciBhZnRlciBlYWNoIHNlc3Npb24gYW5kIGtpbGwgaXQgYXQgdGhlIGVuZCcsXG4gICAgbmFyZ3M6IDAsXG4gIH1dLFxuXG4gIFtbJy0taXBhJ10sIHtcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIGhlbHA6ICcoSU9TLW9ubHkpIGFicyBwYXRoIHRvIGNvbXBpbGVkIC5pcGEgZmlsZScsXG4gICAgZXhhbXBsZTogJy9hYnMvcGF0aC90by9teS5pcGEnLFxuICAgIGRlc3Q6ICdpcGEnLFxuICB9XSxcblxuICBbWyctYScsICctLWFkZHJlc3MnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogJzAuMC4wLjAnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBleGFtcGxlOiAnMC4wLjAuMCcsXG4gICAgaGVscDogJ0lQIEFkZHJlc3MgdG8gbGlzdGVuIG9uJyxcbiAgICBkZXN0OiAnYWRkcmVzcycsXG4gIH1dLFxuXG4gIFtbJy1wJywgJy0tcG9ydCddLCB7XG4gICAgZGVmYXVsdFZhbHVlOiA0NzIzLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB0eXBlOiAnaW50JyxcbiAgICBleGFtcGxlOiAnNDcyMycsXG4gICAgaGVscDogJ3BvcnQgdG8gbGlzdGVuIG9uJyxcbiAgICBkZXN0OiAncG9ydCcsXG4gIH1dLFxuXG4gIFtbJy1jYScsICctLWNhbGxiYWNrLWFkZHJlc3MnXSwge1xuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZXN0OiAnY2FsbGJhY2tBZGRyZXNzJyxcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgZXhhbXBsZTogJzEyNy4wLjAuMScsXG4gICAgaGVscDogJ2NhbGxiYWNrIElQIEFkZHJlc3MgKGRlZmF1bHQ6IHNhbWUgYXMgLS1hZGRyZXNzKScsXG4gIH1dLFxuXG4gIFtbJy1jcCcsICctLWNhbGxiYWNrLXBvcnQnXSwge1xuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZXN0OiAnY2FsbGJhY2tQb3J0JyxcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgdHlwZTogJ2ludCcsXG4gICAgZXhhbXBsZTogJzQ3MjMnLFxuICAgIGhlbHA6ICdjYWxsYmFjayBwb3J0IChkZWZhdWx0OiBzYW1lIGFzIHBvcnQpJyxcbiAgfV0sXG5cbiAgW1snLWJwJywgJy0tYm9vdHN0cmFwLXBvcnQnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogNDcyNCxcbiAgICBkZXN0OiAnYm9vdHN0cmFwUG9ydCcsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIHR5cGU6ICdpbnQnLFxuICAgIGV4YW1wbGU6ICc0NzI0JyxcbiAgICBoZWxwOiAnKEFuZHJvaWQtb25seSkgcG9ydCB0byB1c2Ugb24gZGV2aWNlIHRvIHRhbGsgdG8gQXBwaXVtJyxcbiAgfV0sXG5cbiAgW1snLXInLCAnLS1iYWNrZW5kLXJldHJpZXMnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogMyxcbiAgICBkZXN0OiAnYmFja2VuZFJldHJpZXMnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB0eXBlOiAnaW50JyxcbiAgICBleGFtcGxlOiAnMycsXG4gICAgaGVscDogJyhpT1Mtb25seSkgSG93IG1hbnkgdGltZXMgdG8gcmV0cnkgbGF1bmNoaW5nIEluc3RydW1lbnRzICcgK1xuICAgICAgICAgICdiZWZvcmUgc2F5aW5nIGl0IGNyYXNoZWQgb3IgdGltZWQgb3V0JyxcbiAgfV0sXG5cbiAgW1snLS1zZXNzaW9uLW92ZXJyaWRlJ10sIHtcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIGRlc3Q6ICdzZXNzaW9uT3ZlcnJpZGUnLFxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICdFbmFibGVzIHNlc3Npb24gb3ZlcnJpZGUgKGNsb2JiZXJpbmcpJyxcbiAgICBuYXJnczogMCxcbiAgfV0sXG5cbiAgW1snLWwnLCAnLS1wcmUtbGF1bmNoJ10sIHtcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIGRlc3Q6ICdsYXVuY2gnLFxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICdQcmUtbGF1bmNoIHRoZSBhcHBsaWNhdGlvbiBiZWZvcmUgYWxsb3dpbmcgdGhlIGZpcnN0IHNlc3Npb24gJyArXG4gICAgICAgICAgJyhSZXF1aXJlcyAtLWFwcCBhbmQsIGZvciBBbmRyb2lkLCAtLWFwcC1wa2cgYW5kIC0tYXBwLWFjdGl2aXR5KScsXG4gICAgbmFyZ3M6IDAsXG4gIH1dLFxuXG4gIFtbJy1nJywgJy0tbG9nJ10sIHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgZGVzdDogJ2xvZycsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGV4YW1wbGU6ICcvcGF0aC90by9hcHBpdW0ubG9nJyxcbiAgICBoZWxwOiAnQWxzbyBzZW5kIGxvZyBvdXRwdXQgdG8gdGhpcyBmaWxlJyxcbiAgfV0sXG5cbiAgW1snLS1sb2ctbGV2ZWwnXSwge1xuICAgIGNob2ljZXM6IFsnaW5mbycsICdpbmZvOmRlYnVnJywgJ2luZm86aW5mbycsICdpbmZvOndhcm4nLCAnaW5mbzplcnJvcicsXG4gICAgICAgICAgICAgICd3YXJuJywgJ3dhcm46ZGVidWcnLCAnd2FybjppbmZvJywgJ3dhcm46d2FybicsICd3YXJuOmVycm9yJyxcbiAgICAgICAgICAgICAgJ2Vycm9yJywgJ2Vycm9yOmRlYnVnJywgJ2Vycm9yOmluZm8nLCAnZXJyb3I6d2FybicsICdlcnJvcjplcnJvcicsXG4gICAgICAgICAgICAgICdkZWJ1ZycsICdkZWJ1ZzpkZWJ1ZycsICdkZWJ1ZzppbmZvJywgJ2RlYnVnOndhcm4nLCAnZGVidWc6ZXJyb3InXSxcbiAgICBkZWZhdWx0VmFsdWU6ICdkZWJ1ZycsXG4gICAgZGVzdDogJ2xvZ2xldmVsJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZXhhbXBsZTogJ2RlYnVnJyxcbiAgICBoZWxwOiAnbG9nIGxldmVsOyBkZWZhdWx0IChjb25zb2xlWzpmaWxlXSk6IGRlYnVnWzpkZWJ1Z10nLFxuICB9XSxcblxuICBbWyctLWxvZy10aW1lc3RhbXAnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICdTaG93IHRpbWVzdGFtcHMgaW4gY29uc29sZSBvdXRwdXQnLFxuICAgIG5hcmdzOiAwLFxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXG4gICAgZGVzdDogJ2xvZ1RpbWVzdGFtcCcsXG4gIH1dLFxuXG4gIFtbJy0tbG9jYWwtdGltZXpvbmUnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICdVc2UgbG9jYWwgdGltZXpvbmUgZm9yIHRpbWVzdGFtcHMnLFxuICAgIG5hcmdzOiAwLFxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXG4gICAgZGVzdDogJ2xvY2FsVGltZXpvbmUnLFxuICB9XSxcblxuICBbWyctLWxvZy1uby1jb2xvcnMnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICdEbyBub3QgdXNlIGNvbG9ycyBpbiBjb25zb2xlIG91dHB1dCcsXG4gICAgbmFyZ3M6IDAsXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcbiAgICBkZXN0OiAnbG9nTm9Db2xvcnMnLFxuICB9XSxcblxuICBbWyctRycsICctLXdlYmhvb2snXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZXhhbXBsZTogJ2xvY2FsaG9zdDo5ODc2JyxcbiAgICBkZXN0OiAnd2ViaG9vaycsXG4gICAgaGVscDogJ0Fsc28gc2VuZCBsb2cgb3V0cHV0IHRvIHRoaXMgSFRUUCBsaXN0ZW5lcicsXG4gIH1dLFxuXG4gIFtbJy0tc2FmYXJpJ10sIHtcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXG4gICAgZGVzdDogJ3NhZmFyaScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICcoSU9TLU9ubHkpIFVzZSB0aGUgc2FmYXJpIGFwcCcsXG4gICAgbmFyZ3M6IDAsXG4gIH1dLFxuXG4gIFtbJy0tZGVmYXVsdC1kZXZpY2UnLCAnLWRkJ10sIHtcbiAgICBkZXN0OiAnZGVmYXVsdERldmljZScsXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICBhY3Rpb246ICdzdG9yZVRydWUnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnKElPUy1TaW11bGF0b3Itb25seSkgdXNlIHRoZSBkZWZhdWx0IHNpbXVsYXRvciB0aGF0IGluc3RydW1lbnRzICcgK1xuICAgICAgICAgICdsYXVuY2hlcyBvbiBpdHMgb3duJyxcbiAgfV0sXG5cbiAgW1snLS1mb3JjZS1pcGhvbmUnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgZGVzdDogJ2ZvcmNlSXBob25lJyxcbiAgICBhY3Rpb246ICdzdG9yZVRydWUnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnKElPUy1vbmx5KSBVc2UgdGhlIGlQaG9uZSBTaW11bGF0b3Igbm8gbWF0dGVyIHdoYXQgdGhlIGFwcCB3YW50cycsXG4gICAgbmFyZ3M6IDAsXG4gIH1dLFxuXG4gIFtbJy0tZm9yY2UtaXBhZCddLCB7XG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICBkZXN0OiAnZm9yY2VJcGFkJyxcbiAgICBhY3Rpb246ICdzdG9yZVRydWUnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnKElPUy1vbmx5KSBVc2UgdGhlIGlQYWQgU2ltdWxhdG9yIG5vIG1hdHRlciB3aGF0IHRoZSBhcHAgd2FudHMnLFxuICAgIG5hcmdzOiAwLFxuICB9XSxcblxuICBbWyctLXRyYWNldGVtcGxhdGUnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICBkZXN0OiAnYXV0b21hdGlvblRyYWNlVGVtcGxhdGVQYXRoJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZXhhbXBsZTogJy9Vc2Vycy9tZS9BdXRvbWF0aW9uLnRyYWNldGVtcGxhdGUnLFxuICAgIGhlbHA6ICcoSU9TLW9ubHkpIC50cmFjZXRlbXBsYXRlIGZpbGUgdG8gdXNlIHdpdGggSW5zdHJ1bWVudHMnLFxuICB9XSxcblxuICBbWyctLWluc3RydW1lbnRzJ10sIHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgZGVzdDogJ2luc3RydW1lbnRzUGF0aCcsXG4gICAgcmVxdWlyZTogZmFsc2UsXG4gICAgZXhhbXBsZTogJy9wYXRoL3RvL2luc3RydW1lbnRzJyxcbiAgICBoZWxwOiAnKElPUy1vbmx5KSBwYXRoIHRvIGluc3RydW1lbnRzIGJpbmFyeScsXG4gIH1dLFxuXG4gIFtbJy0tbm9kZWNvbmZpZyddLCB7XG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICBkZXN0OiAnbm9kZWNvbmZpZycsXG4gICAgaGVscDogJ0NvbmZpZ3VyYXRpb24gSlNPTiBmaWxlIHRvIHJlZ2lzdGVyIGFwcGl1bSB3aXRoIHNlbGVuaXVtIGdyaWQnLFxuICAgIGV4YW1wbGU6ICcvYWJzL3BhdGgvdG8vbm9kZWNvbmZpZy5qc29uJyxcbiAgfV0sXG5cbiAgW1snLXJhJywgJy0tcm9ib3QtYWRkcmVzcyddLCB7XG4gICAgZGVmYXVsdFZhbHVlOiAnMC4wLjAuMCcsXG4gICAgZGVzdDogJ3JvYm90QWRkcmVzcycsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGV4YW1wbGU6ICcwLjAuMC4wJyxcbiAgICBoZWxwOiAnSVAgQWRkcmVzcyBvZiByb2JvdCcsXG4gIH1dLFxuXG4gIFtbJy1ycCcsICctLXJvYm90LXBvcnQnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogLTEsXG4gICAgZGVzdDogJ3JvYm90UG9ydCcsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIHR5cGU6ICdpbnQnLFxuICAgIGV4YW1wbGU6ICc0MjQyJyxcbiAgICBoZWxwOiAncG9ydCBmb3Igcm9ib3QnLFxuICB9XSxcblxuICBbWyctLXNlbGVuZHJvaWQtcG9ydCddLCB7XG4gICAgZGVmYXVsdFZhbHVlOiA4MDgwLFxuICAgIGRlc3Q6ICdzZWxlbmRyb2lkUG9ydCcsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIHR5cGU6ICdpbnQnLFxuICAgIGV4YW1wbGU6ICc4MDgwJyxcbiAgICBoZWxwOiAnTG9jYWwgcG9ydCB1c2VkIGZvciBjb21tdW5pY2F0aW9uIHdpdGggU2VsZW5kcm9pZCcsXG4gIH1dLFxuXG4gIFtbJy0tY2hyb21lZHJpdmVyLXBvcnQnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICBkZXN0OiAnY2hyb21lRHJpdmVyUG9ydCcsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIHR5cGU6ICdpbnQnLFxuICAgIGV4YW1wbGU6ICc5NTE1JyxcbiAgICBoZWxwOiAnUG9ydCB1cG9uIHdoaWNoIENocm9tZURyaXZlciB3aWxsIHJ1bi4gSWYgbm90IGdpdmVuLCBBbmRyb2lkIGRyaXZlciB3aWxsIHBpY2sgYSByYW5kb20gYXZhaWxhYmxlIHBvcnQuJyxcbiAgfV0sXG5cbiAgW1snLS1jaHJvbWVkcml2ZXItZXhlY3V0YWJsZSddLCB7XG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIGRlc3Q6ICdjaHJvbWVkcml2ZXJFeGVjdXRhYmxlJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJ0Nocm9tZURyaXZlciBleGVjdXRhYmxlIGZ1bGwgcGF0aCcsXG4gIH1dLFxuXG4gIFtbJy0tc2hvdy1jb25maWcnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgZGVzdDogJ3Nob3dDb25maWcnLFxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICdTaG93IGluZm8gYWJvdXQgdGhlIGFwcGl1bSBzZXJ2ZXIgY29uZmlndXJhdGlvbiBhbmQgZXhpdCcsXG4gIH1dLFxuXG4gIFtbJy0tbm8tcGVybXMtY2hlY2snXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgZGVzdDogJ25vUGVybXNDaGVjaycsXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJ0J5cGFzcyBBcHBpdW1cXCdzIGNoZWNrcyB0byBlbnN1cmUgd2UgY2FuIHJlYWQvd3JpdGUgbmVjZXNzYXJ5IGZpbGVzJyxcbiAgfV0sXG5cbiAgW1snLS1zdHJpY3QtY2FwcyddLCB7XG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICBkZXN0OiAnZW5mb3JjZVN0cmljdENhcHMnLFxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICdDYXVzZSBzZXNzaW9ucyB0byBmYWlsIGlmIGRlc2lyZWQgY2FwcyBhcmUgc2VudCBpbiB0aGF0IEFwcGl1bSAnICtcbiAgICAgICAgICAnZG9lcyBub3QgcmVjb2duaXplIGFzIHZhbGlkIGZvciB0aGUgc2VsZWN0ZWQgZGV2aWNlJyxcbiAgICBuYXJnczogMCxcbiAgfV0sXG5cbiAgW1snLS1pc29sYXRlLXNpbS1kZXZpY2UnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgZGVzdDogJ2lzb2xhdGVTaW1EZXZpY2UnLFxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICdYY29kZSA2IGhhcyBhIGJ1ZyBvbiBzb21lIHBsYXRmb3JtcyB3aGVyZSBhIGNlcnRhaW4gc2ltdWxhdG9yICcgK1xuICAgICAgICAgICdjYW4gb25seSBiZSBsYXVuY2hlZCB3aXRob3V0IGVycm9yIGlmIGFsbCBvdGhlciBzaW11bGF0b3IgZGV2aWNlcyAnICtcbiAgICAgICAgICAnYXJlIGZpcnN0IGRlbGV0ZWQuIFRoaXMgb3B0aW9uIGNhdXNlcyBBcHBpdW0gdG8gZGVsZXRlIGFsbCAnICtcbiAgICAgICAgICAnZGV2aWNlcyBvdGhlciB0aGFuIHRoZSBvbmUgYmVpbmcgdXNlZCBieSBBcHBpdW0uIE5vdGUgdGhhdCB0aGlzICcgK1xuICAgICAgICAgICdpcyBhIHBlcm1hbmVudCBkZWxldGlvbiwgYW5kIHlvdSBhcmUgcmVzcG9uc2libGUgZm9yIHVzaW5nIHNpbWN0bCAnICtcbiAgICAgICAgICAnb3IgeGNvZGUgdG8gbWFuYWdlIHRoZSBjYXRlZ29yaWVzIG9mIGRldmljZXMgdXNlZCB3aXRoIEFwcGl1bS4nLFxuICAgIG5hcmdzOiAwLFxuICB9XSxcblxuICBbWyctLXRtcCddLCB7XG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIGRlc3Q6ICd0bXBEaXInLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnQWJzb2x1dGUgcGF0aCB0byBkaXJlY3RvcnkgQXBwaXVtIGNhbiB1c2UgdG8gbWFuYWdlIHRlbXBvcmFyeSAnICtcbiAgICAgICAgICAnZmlsZXMsIGxpa2UgYnVpbHQtaW4gaU9TIGFwcHMgaXQgbmVlZHMgdG8gbW92ZSBhcm91bmQuIE9uICpuaXgvTWFjICcgK1xuICAgICAgICAgICdkZWZhdWx0cyB0byAvdG1wLCBvbiBXaW5kb3dzIGRlZmF1bHRzIHRvIEM6XFxcXFdpbmRvd3NcXFxcVGVtcCcsXG4gIH1dLFxuXG4gIFtbJy0tdHJhY2UtZGlyJ10sIHtcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgZGVzdDogJ3RyYWNlRGlyJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJ0Fic29sdXRlIHBhdGggdG8gZGlyZWN0b3J5IEFwcGl1bSB1c2UgdG8gc2F2ZSBpb3MgaW5zdHJ1bWVudHMgJyArXG4gICAgICAgICAgJ3RyYWNlcywgZGVmYXVsdHMgdG8gPHRtcCBkaXI+L2FwcGl1bS1pbnN0cnVtZW50cycsXG4gIH1dLFxuXG4gIFtbJy0tZGVidWctbG9nLXNwYWNpbmcnXSwge1xuICAgIGRlc3Q6ICdkZWJ1Z0xvZ1NwYWNpbmcnLFxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJ0FkZCBleGFnZ2VyYXRlZCBzcGFjaW5nIGluIGxvZ3MgdG8gaGVscCB3aXRoIHZpc3VhbCBpbnNwZWN0aW9uJyxcbiAgfV0sXG5cbiAgW1snLS1zdXBwcmVzcy1hZGIta2lsbC1zZXJ2ZXInXSwge1xuICAgIGRlc3Q6ICdzdXBwcmVzc0tpbGxTZXJ2ZXInLFxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJyhBbmRyb2lkLW9ubHkpIElmIHNldCwgcHJldmVudHMgQXBwaXVtIGZyb20ga2lsbGluZyB0aGUgYWRiIHNlcnZlciBpbnN0YW5jZScsXG4gICAgbmFyZ3M6IDAsXG4gIH1dLFxuXG4gIFtbJy0tbG9uZy1zdGFja3RyYWNlJ10sIHtcbiAgICBkZXN0OiAnbG9uZ1N0YWNrdHJhY2UnLFxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXG4gICAgaGVscDogJ0FkZCBsb25nIHN0YWNrIHRyYWNlcyB0byBsb2cgZW50cmllcy4gUmVjb21tZW5kZWQgZm9yIGRlYnVnZ2luZyBvbmx5LicsXG4gIH1dLFxuXG4gIFtbJy0td2Via2l0LWRlYnVnLXByb3h5LXBvcnQnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogMjc3NTMsXG4gICAgZGVzdDogJ3dlYmtpdERlYnVnUHJveHlQb3J0JyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgdHlwZTogJ2ludCcsXG4gICAgZXhhbXBsZTogXCIyNzc1M1wiLFxuICAgIGhlbHA6ICcoSU9TLW9ubHkpIExvY2FsIHBvcnQgdXNlZCBmb3IgY29tbXVuaWNhdGlvbiB3aXRoIGlvcy13ZWJraXQtZGVidWctcHJveHknXG4gIH1dLFxuXG4gIFtbJy0td2ViZHJpdmVyYWdlbnQtcG9ydCddLCB7XG4gICAgZGVmYXVsdFZhbHVlOiA4MTAwLFxuICAgIGRlc3Q6ICd3ZGFMb2NhbFBvcnQnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB0eXBlOiAnaW50JyxcbiAgICBleGFtcGxlOiBcIjgxMDBcIixcbiAgICBoZWxwOiAnKElPUy1vbmx5LCBYQ1VJVGVzdC1vbmx5KSBMb2NhbCBwb3J0IHVzZWQgZm9yIGNvbW11bmljYXRpb24gd2l0aCBXZWJEcml2ZXJBZ2VudCdcbiAgfV0sXG5cbiAgW1snLWRjJywgJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnXSwge1xuICAgIGRlc3Q6ICdkZWZhdWx0Q2FwYWJpbGl0aWVzJyxcbiAgICBkZWZhdWx0VmFsdWU6IHt9LFxuICAgIHR5cGU6IHBhcnNlRGVmYXVsdENhcHMsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGV4YW1wbGU6ICdbIFxcJ3tcImFwcFwiOiBcIm15YXBwLmFwcFwiLCBcImRldmljZU5hbWVcIjogXCJpUGhvbmUgU2ltdWxhdG9yXCJ9XFwnICcgK1xuICAgICAgICAgICAgICd8IC9wYXRoL3RvL2NhcHMuanNvbiBdJyxcbiAgICBoZWxwOiAnU2V0IHRoZSBkZWZhdWx0IGRlc2lyZWQgY2FwYWJpbGl0aWVzLCB3aGljaCB3aWxsIGJlIHNldCBvbiBlYWNoICcgK1xuICAgICAgICAgICdzZXNzaW9uIHVubGVzcyBvdmVycmlkZGVuIGJ5IHJlY2VpdmVkIGNhcGFiaWxpdGllcy4nXG4gIH1dLFxuXG4gIFtbJy0tZW5hYmxlLWhlYXBkdW1wJ10sIHtcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIGRlc3Q6ICdoZWFwZHVtcEVuYWJsZWQnLFxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICdFbmFibGUgY29sbGVjdGlvbiBvZiBOb2RlSlMgbWVtb3J5IGhlYXAgZHVtcHMuIFRoaXMgaXMgdXNlZnVsIGZvciBtZW1vcnkgbGVha3MgbG9va3VwJyxcbiAgICBuYXJnczogMFxuICB9XSxcblxuICBbWyctLXJlbGF4ZWQtc2VjdXJpdHknXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgZGVzdDogJ3JlbGF4ZWRTZWN1cml0eUVuYWJsZWQnLFxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGhlbHA6ICdEaXNhYmxlIGFkZGl0aW9uYWwgc2VjdXJpdHkgY2hlY2tzLCBzbyBpdCBpcyBwb3NzaWJsZSB0byB1c2Ugc29tZSBhZHZhbmNlZCBmZWF0dXJlcywgcHJvdmlkZWQgJyArXG4gICAgICAgICAgJ2J5IGRyaXZlcnMgc3VwcG9ydGluZyB0aGlzIG9wdGlvbi4gT25seSBlbmFibGUgaXQgaWYgYWxsIHRoZSAnICtcbiAgICAgICAgICAnY2xpZW50cyBhcmUgaW4gdGhlIHRydXN0ZWQgbmV0d29yayBhbmQgaXRcXCdzIG5vdCB0aGUgY2FzZSBpZiBhIGNsaWVudCBjb3VsZCBwb3RlbnRpYWxseSAnICtcbiAgICAgICAgICAnYnJlYWsgb3V0IG9mIHRoZSBzZXNzaW9uIHNhbmRib3guJyxcbiAgICBuYXJnczogMFxuICB9XSxcbl07XG5cbmNvbnN0IGRlcHJlY2F0ZWRBcmdzID0gW1xuICBbWyctLWNvbW1hbmQtdGltZW91dCddLCB7XG4gICAgZGVmYXVsdFZhbHVlOiA2MCxcbiAgICBkZXN0OiAnZGVmYXVsdENvbW1hbmRUaW1lb3V0JyxcbiAgICB0eXBlOiAnaW50JyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSBObyBlZmZlY3QuIFRoaXMgdXNlZCB0byBiZSB0aGUgZGVmYXVsdCBjb21tYW5kICcgK1xuICAgICAgICAgICd0aW1lb3V0IGZvciB0aGUgc2VydmVyIHRvIHVzZSBmb3IgYWxsIHNlc3Npb25zIChpbiBzZWNvbmRzIGFuZCAnICtcbiAgICAgICAgICAnc2hvdWxkIGJlIGxlc3MgdGhhbiAyMTQ3NDgzKS4gVXNlIG5ld0NvbW1hbmRUaW1lb3V0IGNhcCBpbnN0ZWFkJ1xuICB9XSxcblxuICBbWyctaycsICctLWtlZXAtYXJ0aWZhY3RzJ10sIHtcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIGRlc3Q6ICdrZWVwQXJ0aWZhY3RzJyxcbiAgICBhY3Rpb246ICdzdG9yZVRydWUnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gbm8gZWZmZWN0LCB0cmFjZSBpcyBub3cgaW4gdG1wIGRpciBieSBkZWZhdWx0IGFuZCBpcyAnICtcbiAgICAgICAgICAnY2xlYXJlZCBiZWZvcmUgZWFjaCBydW4uIFBsZWFzZSBhbHNvIHJlZmVyIHRvIHRoZSAtLXRyYWNlLWRpciBmbGFnLicsXG4gICAgbmFyZ3M6IDAsXG4gIH1dLFxuXG4gIFtbJy0tcGxhdGZvcm0tbmFtZSddLCB7XG4gICAgZGVzdDogJ3BsYXRmb3JtTmFtZScsXG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXG4gICAgZXhhbXBsZTogJ2lPUycsXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIE5hbWUgb2YgdGhlIG1vYmlsZSBwbGF0Zm9ybTogaU9TLCBBbmRyb2lkLCBvciBGaXJlZm94T1MnLFxuICB9XSxcblxuICBbWyctLXBsYXRmb3JtLXZlcnNpb24nXSwge1xuICAgIGRlc3Q6ICdwbGF0Zm9ybVZlcnNpb24nLFxuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxuICAgIGV4YW1wbGU6ICc3LjEnLFxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSBWZXJzaW9uIG9mIHRoZSBtb2JpbGUgcGxhdGZvcm0nLFxuICB9XSxcblxuICBbWyctLWF1dG9tYXRpb24tbmFtZSddLCB7XG4gICAgZGVzdDogJ2F1dG9tYXRpb25OYW1lJyxcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcbiAgICBleGFtcGxlOiAnQXBwaXVtJyxcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gTmFtZSBvZiB0aGUgYXV0b21hdGlvbiB0b29sOiBBcHBpdW0gb3IgU2VsZW5kcm9pZCcsXG4gIH1dLFxuXG4gIFtbJy0tZGV2aWNlLW5hbWUnXSwge1xuICAgIGRlc3Q6ICdkZXZpY2VOYW1lJyxcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcbiAgICBleGFtcGxlOiAnaVBob25lIFJldGluYSAoNC1pbmNoKSwgQW5kcm9pZCBFbXVsYXRvcicsXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIE5hbWUgb2YgdGhlIG1vYmlsZSBkZXZpY2UgdG8gdXNlJyxcbiAgfV0sXG5cbiAgW1snLS1icm93c2VyLW5hbWUnXSwge1xuICAgIGRlc3Q6ICdicm93c2VyTmFtZScsXG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXG4gICAgZXhhbXBsZTogJ1NhZmFyaScsXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIE5hbWUgb2YgdGhlIG1vYmlsZSBicm93c2VyOiBTYWZhcmkgb3IgQ2hyb21lJyxcbiAgfV0sXG5cbiAgW1snLS1hcHAnXSwge1xuICAgIGRlc3Q6ICdhcHAnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSBJT1M6IGFicyBwYXRoIHRvIHNpbXVsYXRvci1jb21waWxlZCAuYXBwIGZpbGUgb3IgdGhlIGJ1bmRsZV9pZCBvZiB0aGUgZGVzaXJlZCB0YXJnZXQgb24gZGV2aWNlOyBBbmRyb2lkOiBhYnMgcGF0aCB0byAuYXBrIGZpbGUnLFxuICAgIGV4YW1wbGU6ICcvYWJzL3BhdGgvdG8vbXkuYXBwJyxcbiAgfV0sXG5cbiAgW1snLWx0JywgJy0tbGF1bmNoLXRpbWVvdXQnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogOTAwMDAsXG4gICAgZGVzdDogJ2xhdW5jaFRpbWVvdXQnLFxuICAgIHR5cGU6ICdpbnQnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIChpT1Mtb25seSkgaG93IGxvbmcgaW4gbXMgdG8gd2FpdCBmb3IgSW5zdHJ1bWVudHMgdG8gbGF1bmNoJyxcbiAgfV0sXG5cbiAgW1snLS1sYW5ndWFnZSddLCB7XG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIGRlc3Q6ICdsYW5ndWFnZScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGV4YW1wbGU6ICdlbicsXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSBMYW5ndWFnZSBmb3IgdGhlIGlPUyBzaW11bGF0b3IgLyBBbmRyb2lkIEVtdWxhdG9yJyxcbiAgfV0sXG5cbiAgW1snLS1sb2NhbGUnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICBkZXN0OiAnbG9jYWxlJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZXhhbXBsZTogJ2VuX1VTJyxcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIExvY2FsZSBmb3IgdGhlIGlPUyBzaW11bGF0b3IgLyBBbmRyb2lkIEVtdWxhdG9yJyxcbiAgfV0sXG5cbiAgW1snLVUnLCAnLS11ZGlkJ10sIHtcbiAgICBkZXN0OiAndWRpZCcsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICBleGFtcGxlOiAnMWFkc2Ytc2RmYXMtYXNkZi0xMjNzZGYnLFxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gVW5pcXVlIGRldmljZSBpZGVudGlmaWVyIG9mIHRoZSBjb25uZWN0ZWQgcGh5c2ljYWwgZGV2aWNlJyxcbiAgfV0sXG5cbiAgW1snLS1vcmllbnRhdGlvbiddLCB7XG4gICAgZGVzdDogJ29yaWVudGF0aW9uJyxcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGV4YW1wbGU6ICdMQU5EU0NBUEUnLFxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKElPUy1vbmx5KSB1c2UgTEFORFNDQVBFIG9yIFBPUlRSQUlUIHRvIGluaXRpYWxpemUgYWxsIHJlcXVlc3RzICcgK1xuICAgICAgICAgICd0byB0aGlzIG9yaWVudGF0aW9uJyxcbiAgfV0sXG5cbiAgW1snLS1uby1yZXNldCddLCB7XG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICBkZXN0OiAnbm9SZXNldCcsXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSBEbyBub3QgcmVzZXQgYXBwIHN0YXRlIGJldHdlZW4gc2Vzc2lvbnMgKElPUzogZG8gbm90IGRlbGV0ZSBhcHAgJyArXG4gICAgICAgICAgJ3BsaXN0IGZpbGVzOyBBbmRyb2lkOiBkbyBub3QgdW5pbnN0YWxsIGFwcCBiZWZvcmUgbmV3IHNlc3Npb24pJyxcbiAgICBuYXJnczogMCxcbiAgfV0sXG5cbiAgW1snLS1mdWxsLXJlc2V0J10sIHtcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIGRlc3Q6ICdmdWxsUmVzZXQnLFxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKGlPUykgRGVsZXRlIHRoZSBlbnRpcmUgc2ltdWxhdG9yIGZvbGRlci4gKEFuZHJvaWQpIFJlc2V0IGFwcCAnICtcbiAgICAgICAgICAnc3RhdGUgYnkgdW5pbnN0YWxsaW5nIGFwcCBpbnN0ZWFkIG9mIGNsZWFyaW5nIGFwcCBkYXRhLiBPbiAnICtcbiAgICAgICAgICAnQW5kcm9pZCwgdGhpcyB3aWxsIGFsc28gcmVtb3ZlIHRoZSBhcHAgYWZ0ZXIgdGhlIHNlc3Npb24gaXMgY29tcGxldGUuJyxcbiAgICBuYXJnczogMCxcbiAgfV0sXG5cbiAgW1snLS1hcHAtcGtnJ10sIHtcbiAgICBkZXN0OiAnYXBwUGFja2FnZScsXG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXG4gICAgZXhhbXBsZTogJ2NvbS5leGFtcGxlLmFuZHJvaWQubXlBcHAnLFxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoQW5kcm9pZC1vbmx5KSBKYXZhIHBhY2thZ2Ugb2YgdGhlIEFuZHJvaWQgYXBwIHlvdSB3YW50IHRvIHJ1biAnICtcbiAgICAgICAgICAnKGUuZy4sIGNvbS5leGFtcGxlLmFuZHJvaWQubXlBcHApJyxcbiAgfV0sXG5cbiAgW1snLS1hcHAtYWN0aXZpdHknXSwge1xuICAgIGRlc3Q6ICdhcHBBY3Rpdml0eScsXG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBleGFtcGxlOiAnTWFpbkFjdGl2aXR5JyxcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIChBbmRyb2lkLW9ubHkpIEFjdGl2aXR5IG5hbWUgZm9yIHRoZSBBbmRyb2lkIGFjdGl2aXR5IHlvdSB3YW50ICcgK1xuICAgICAgICAgICd0byBsYXVuY2ggZnJvbSB5b3VyIHBhY2thZ2UgKGUuZy4sIE1haW5BY3Rpdml0eSknLFxuICB9XSxcblxuICBbWyctLWFwcC13YWl0LXBhY2thZ2UnXSwge1xuICAgIGRlc3Q6ICdhcHBXYWl0UGFja2FnZScsXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZXhhbXBsZTogJ2NvbS5leGFtcGxlLmFuZHJvaWQubXlBcHAnLFxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKEFuZHJvaWQtb25seSkgUGFja2FnZSBuYW1lIGZvciB0aGUgQW5kcm9pZCBhY3Rpdml0eSB5b3Ugd2FudCAnICtcbiAgICAgICAgICAndG8gd2FpdCBmb3IgKGUuZy4sIGNvbS5leGFtcGxlLmFuZHJvaWQubXlBcHApJyxcbiAgfV0sXG5cbiAgW1snLS1hcHAtd2FpdC1hY3Rpdml0eSddLCB7XG4gICAgZGVzdDogJ2FwcFdhaXRBY3Rpdml0eScsXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZXhhbXBsZTogJ1NwbGFzaEFjdGl2aXR5JyxcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIChBbmRyb2lkLW9ubHkpIEFjdGl2aXR5IG5hbWUgZm9yIHRoZSBBbmRyb2lkIGFjdGl2aXR5IHlvdSB3YW50ICcgK1xuICAgICAgICAgICd0byB3YWl0IGZvciAoZS5nLiwgU3BsYXNoQWN0aXZpdHkpJyxcbiAgfV0sXG5cbiAgW1snLS1kZXZpY2UtcmVhZHktdGltZW91dCddLCB7XG4gICAgZGVzdDogJ2RldmljZVJlYWR5VGltZW91dCcsXG4gICAgZGVmYXVsdFZhbHVlOiA1LFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB0eXBlOiAnaW50JyxcbiAgICBleGFtcGxlOiAnNScsXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoQW5kcm9pZC1vbmx5KSBUaW1lb3V0IGluIHNlY29uZHMgd2hpbGUgd2FpdGluZyBmb3IgZGV2aWNlIHRvIGJlY29tZSByZWFkeScsXG4gIH1dLFxuXG4gIFtbJy0tYW5kcm9pZC1jb3ZlcmFnZSddLCB7XG4gICAgZGVzdDogJ2FuZHJvaWRDb3ZlcmFnZScsXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZXhhbXBsZTogJ2NvbS5teS5Qa2cvY29tLm15LlBrZy5pbnN0cnVtZW50YXRpb24uTXlJbnN0cnVtZW50YXRpb24nLFxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKEFuZHJvaWQtb25seSkgRnVsbHkgcXVhbGlmaWVkIGluc3RydW1lbnRhdGlvbiBjbGFzcy4gUGFzc2VkIHRvIC13IGluICcgK1xuICAgICAgICAgICdhZGIgc2hlbGwgYW0gaW5zdHJ1bWVudCAtZSBjb3ZlcmFnZSB0cnVlIC13ICcsXG4gIH1dLFxuXG4gIFtbJy0tYXZkJ10sIHtcbiAgICBkZXN0OiAnYXZkJyxcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGV4YW1wbGU6ICdAZGVmYXVsdCcsXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoQW5kcm9pZC1vbmx5KSBOYW1lIG9mIHRoZSBhdmQgdG8gbGF1bmNoJyxcbiAgfV0sXG5cbiAgW1snLS1hdmQtYXJncyddLCB7XG4gICAgZGVzdDogJ2F2ZEFyZ3MnLFxuICAgIGRlZmF1bHRWYWx1ZTogbnVsbCxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZXhhbXBsZTogJy1uby1zbmFwc2hvdC1sb2FkJyxcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIChBbmRyb2lkLW9ubHkpIEFkZGl0aW9uYWwgZW11bGF0b3IgYXJndW1lbnRzIHRvIGxhdW5jaCB0aGUgYXZkJyxcbiAgfV0sXG5cbiAgW1snLS11c2Uta2V5c3RvcmUnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgZGVzdDogJ3VzZUtleXN0b3JlJyxcbiAgICBhY3Rpb246ICdzdG9yZVRydWUnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIChBbmRyb2lkLW9ubHkpIFdoZW4gc2V0IHRoZSBrZXlzdG9yZSB3aWxsIGJlIHVzZWQgdG8gc2lnbiBhcGtzLicsXG4gIH1dLFxuXG4gIFtbJy0ta2V5c3RvcmUtcGF0aCddLCB7XG4gICAgZGVmYXVsdFZhbHVlOiBwYXRoLnJlc29sdmUocHJvY2Vzcy5lbnYuSE9NRSB8fCBwcm9jZXNzLmVudi5VU0VSUFJPRklMRSB8fCAnJywgJy5hbmRyb2lkJywgJ2RlYnVnLmtleXN0b3JlJyksXG4gICAgZGVzdDogJ2tleXN0b3JlUGF0aCcsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKEFuZHJvaWQtb25seSkgUGF0aCB0byBrZXlzdG9yZScsXG4gIH1dLFxuXG4gIFtbJy0ta2V5c3RvcmUtcGFzc3dvcmQnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogJ2FuZHJvaWQnLFxuICAgIGRlc3Q6ICdrZXlzdG9yZVBhc3N3b3JkJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoQW5kcm9pZC1vbmx5KSBQYXNzd29yZCB0byBrZXlzdG9yZScsXG4gIH1dLFxuXG4gIFtbJy0ta2V5LWFsaWFzJ10sIHtcbiAgICBkZWZhdWx0VmFsdWU6ICdhbmRyb2lkZGVidWdrZXknLFxuICAgIGRlc3Q6ICdrZXlBbGlhcycsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKEFuZHJvaWQtb25seSkgS2V5IGFsaWFzJyxcbiAgfV0sXG5cbiAgW1snLS1rZXktcGFzc3dvcmQnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogJ2FuZHJvaWQnLFxuICAgIGRlc3Q6ICdrZXlQYXNzd29yZCcsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKEFuZHJvaWQtb25seSkgS2V5IHBhc3N3b3JkJyxcbiAgfV0sXG5cbiAgW1snLS1pbnRlbnQtYWN0aW9uJ10sIHtcbiAgICBkZXN0OiAnaW50ZW50QWN0aW9uJyxcbiAgICBkZWZhdWx0VmFsdWU6ICdhbmRyb2lkLmludGVudC5hY3Rpb24uTUFJTicsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGV4YW1wbGU6ICdhbmRyb2lkLmludGVudC5hY3Rpb24uTUFJTicsXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoQW5kcm9pZC1vbmx5KSBJbnRlbnQgYWN0aW9uIHdoaWNoIHdpbGwgYmUgdXNlZCB0byBzdGFydCBhY3Rpdml0eScsXG4gIH1dLFxuXG4gIFtbJy0taW50ZW50LWNhdGVnb3J5J10sIHtcbiAgICBkZXN0OiAnaW50ZW50Q2F0ZWdvcnknLFxuICAgIGRlZmF1bHRWYWx1ZTogJ2FuZHJvaWQuaW50ZW50LmNhdGVnb3J5LkxBVU5DSEVSJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZXhhbXBsZTogJ2FuZHJvaWQuaW50ZW50LmNhdGVnb3J5LkFQUF9DT05UQUNUUycsXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoQW5kcm9pZC1vbmx5KSBJbnRlbnQgY2F0ZWdvcnkgd2hpY2ggd2lsbCBiZSB1c2VkIHRvIHN0YXJ0IGFjdGl2aXR5JyxcbiAgfV0sXG5cbiAgW1snLS1pbnRlbnQtZmxhZ3MnXSwge1xuICAgIGRlc3Q6ICdpbnRlbnRGbGFncycsXG4gICAgZGVmYXVsdFZhbHVlOiAnMHgxMDIwMDAwMCcsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGV4YW1wbGU6ICcweDEwMjAwMDAwJyxcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIChBbmRyb2lkLW9ubHkpIEZsYWdzIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHN0YXJ0IGFjdGl2aXR5JyxcbiAgfV0sXG5cbiAgW1snLS1pbnRlbnQtYXJncyddLCB7XG4gICAgZGVzdDogJ29wdGlvbmFsSW50ZW50QXJndW1lbnRzJyxcbiAgICBkZWZhdWx0VmFsdWU6IG51bGwsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGV4YW1wbGU6ICcweDEwMjAwMDAwJyxcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycsXG4gICAgaGVscDogJ1tERVBSRUNBVEVEXSAtIChBbmRyb2lkLW9ubHkpIEFkZGl0aW9uYWwgaW50ZW50IGFyZ3VtZW50cyB0aGF0IHdpbGwgYmUgdXNlZCB0byAnICtcbiAgICAgICAgICAnc3RhcnQgYWN0aXZpdHknLFxuICB9XSxcblxuICBbWyctLWRvbnQtc3RvcC1hcHAtb24tcmVzZXQnXSwge1xuICAgIGRlc3Q6ICdkb250U3RvcEFwcE9uUmVzZXQnLFxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoQW5kcm9pZC1vbmx5KSBXaGVuIGluY2x1ZGVkLCByZWZyYWlucyBmcm9tIHN0b3BwaW5nIHRoZSBhcHAgYmVmb3JlIHJlc3RhcnQnLFxuICB9XSxcblxuICBbWyctLWNhbGVuZGFyLWZvcm1hdCddLCB7XG4gICAgZGVmYXVsdFZhbHVlOiBudWxsLFxuICAgIGRlc3Q6ICdjYWxlbmRhckZvcm1hdCcsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGV4YW1wbGU6ICdncmVnb3JpYW4nLFxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKElPUy1vbmx5KSBjYWxlbmRhciBmb3JtYXQgZm9yIHRoZSBpT1Mgc2ltdWxhdG9yJyxcbiAgfV0sXG5cbiAgW1snLS1uYXRpdmUtaW5zdHJ1bWVudHMtbGliJ10sIHtcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIGRlc3Q6ICduYXRpdmVJbnN0cnVtZW50c0xpYicsXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoSU9TLW9ubHkpIElPUyBoYXMgYSB3ZWlyZCBidWlsdC1pbiB1bmF2b2lkYWJsZSAnICtcbiAgICAgICAgICAnZGVsYXkuIFdlIHBhdGNoIHRoaXMgaW4gYXBwaXVtLiBJZiB5b3UgZG8gbm90IHdhbnQgaXQgcGF0Y2hlZCwgJyArXG4gICAgICAgICAgJ3Bhc3MgaW4gdGhpcyBmbGFnLicsXG4gICAgbmFyZ3M6IDAsXG4gIH1dLFxuXG4gIFtbJy0ta2VlcC1rZXljaGFpbnMnXSwge1xuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgZGVzdDogJ2tlZXBLZXlDaGFpbnMnLFxuICAgIGFjdGlvbjogJ3N0b3JlVHJ1ZScsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlcHJlY2F0ZWRGb3I6ICctLWRlZmF1bHQtY2FwYWJpbGl0aWVzJyxcbiAgICBoZWxwOiAnW0RFUFJFQ0FURURdIC0gKGlPUy1vbmx5KSBXaGV0aGVyIHRvIGtlZXAga2V5Y2hhaW5zIChMaWJyYXJ5L0tleWNoYWlucykgd2hlbiByZXNldCBhcHAgYmV0d2VlbiBzZXNzaW9ucycsXG4gICAgbmFyZ3M6IDAsXG4gIH1dLFxuXG4gIFtbJy0tbG9jYWxpemFibGUtc3RyaW5ncy1kaXInXSwge1xuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZXN0OiAnbG9jYWxpemFibGVTdHJpbmdzRGlyJyxcbiAgICBkZWZhdWx0VmFsdWU6ICdlbi5scHJvaicsXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoSU9TLW9ubHkpIHRoZSByZWxhdGl2ZSBwYXRoIG9mIHRoZSBkaXIgd2hlcmUgTG9jYWxpemFibGUuc3RyaW5ncyBmaWxlIHJlc2lkZXMgJyxcbiAgICBleGFtcGxlOiAnZW4ubHByb2onLFxuICB9XSxcblxuICBbWyctLXNob3ctaW9zLWxvZyddLCB7XG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICBkZXN0OiAnc2hvd0lPU0xvZycsXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZGVwcmVjYXRlZEZvcjogJy0tZGVmYXVsdC1jYXBhYmlsaXRpZXMnLFxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSAoSU9TLW9ubHkpIGlmIHNldCwgdGhlIGlPUyBzeXN0ZW0gbG9nIHdpbGwgYmUgd3JpdHRlbiB0byB0aGUgY29uc29sZScsXG4gICAgbmFyZ3M6IDAsXG4gIH1dLFxuXG4gIFtbJy0tYXN5bmMtdHJhY2UnXSwge1xuICAgIGRlc3Q6ICdsb25nU3RhY2t0cmFjZScsXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgYWN0aW9uOiAnc3RvcmVUcnVlJyxcbiAgICBkZXByZWNhdGVkRm9yOiAnLS1sb25nLXN0YWNrdHJhY2UnLFxuICAgIGhlbHA6ICdbREVQUkVDQVRFRF0gLSBBZGQgbG9uZyBzdGFjayB0cmFjZXMgdG8gbG9nIGVudHJpZXMuIFJlY29tbWVuZGVkIGZvciBkZWJ1Z2dpbmcgb25seS4nLFxuICB9XSxcbl07XG5cbmZ1bmN0aW9uIHVwZGF0ZVBhcnNlQXJnc0ZvckRlZmF1bHRDYXBhYmlsaXRpZXMgKHBhcnNlcikge1xuICAvLyBoZXJlIHdlIHdhbnQgdG8gdXBkYXRlIHRoZSBwYXJzZXIucGFyc2VBcmdzKCkgZnVuY3Rpb25cbiAgLy8gaW4gb3JkZXIgdG8gYnJpbmcgdG9nZXRoZXIgYWxsIHRoZSBhcmdzIHRoYXQgYXJlIGFjdHVhbGx5XG4gIC8vIGRlZmF1bHQgY2Fwcy5cbiAgLy8gb25jZSB0aG9zZSBkZXByZWNhdGVkIGFyZ3MgYXJlIGFjdHVhbGx5IHJlbW92ZWQsIHRoaXNcbiAgLy8gY2FuIGFsc28gYmUgcmVtb3ZlZFxuICBwYXJzZXIuX3BhcnNlQXJncyA9IHBhcnNlci5wYXJzZUFyZ3M7XG4gIHBhcnNlci5wYXJzZUFyZ3MgPSBmdW5jdGlvbiAoYXJncykge1xuICAgIGxldCBwYXJzZWRBcmdzID0gcGFyc2VyLl9wYXJzZUFyZ3MoYXJncyk7XG4gICAgcGFyc2VkQXJncy5kZWZhdWx0Q2FwYWJpbGl0aWVzID0gcGFyc2VkQXJncy5kZWZhdWx0Q2FwYWJpbGl0aWVzIHx8IHt9O1xuICAgIGZvciAobGV0IGFyZ0VudHJ5IG9mIGRlcHJlY2F0ZWRBcmdzKSB7XG4gICAgICBsZXQgYXJnID0gYXJnRW50cnlbMV0uZGVzdDtcbiAgICAgIGlmIChhcmdFbnRyeVsxXS5kZXByZWNhdGVkRm9yID09PSAnLS1kZWZhdWx0LWNhcGFiaWxpdGllcycpIHtcbiAgICAgICAgaWYgKGFyZyBpbiBwYXJzZWRBcmdzICYmIHBhcnNlZEFyZ3NbYXJnXSAhPT0gYXJnRW50cnlbMV0uZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgICAgcGFyc2VkQXJncy5kZWZhdWx0Q2FwYWJpbGl0aWVzW2FyZ10gPSBwYXJzZWRBcmdzW2FyZ107XG4gICAgICAgICAgLy8gaiBzIGggaSBuIHQgY2FuJ3QgaGFuZGxlIGNvbXBsZXggaW50ZXJwb2xhdGVkIHN0cmluZ3NcbiAgICAgICAgICBsZXQgY2FwRGljdCA9IHtbYXJnXTogcGFyc2VkQXJnc1thcmddfTtcbiAgICAgICAgICBhcmdFbnRyeVsxXS5kZXByZWNhdGVkRm9yID0gYC0tZGVmYXVsdC1jYXBhYmlsaXRpZXMgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAnJHtKU09OLnN0cmluZ2lmeShjYXBEaWN0KX0nYDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGFyc2VkQXJncztcbiAgfTtcbn1cblxuZnVuY3Rpb24gcGFyc2VEZWZhdWx0Q2FwcyAoY2Fwcykge1xuICB0cnkge1xuICAgIC8vIHVzZSBzeW5jaHJvbm91cyBmaWxlIGFjY2VzcywgYXMgYGFyZ3BhcnNlYCBwcm92aWRlcyBubyB3YXkgb2YgZWl0aGVyXG4gICAgLy8gYXdhaXRpbmcgb3IgdXNpbmcgY2FsbGJhY2tzLiBUaGlzIHN0ZXAgaGFwcGVucyBpbiBzdGFydHVwLCBpbiB3aGF0IGlzXG4gICAgLy8gZWZmZWN0aXZlbHkgY29tbWFuZC1saW5lIGNvZGUsIHNvIG5vdGhpbmcgaXMgYmxvY2tlZCBpbiB0ZXJtcyBvZlxuICAgIC8vIHNlc3Npb25zLCBzbyBob2xkaW5nIHVwIHRoZSBldmVudCBsb29wIGRvZXMgbm90IGluY3VyIHRoZSB1c3VhbFxuICAgIC8vIGRyYXdiYWNrcy5cbiAgICBpZiAoZnMuc3RhdFN5bmMoY2FwcykuaXNGaWxlKCkpIHtcbiAgICAgIGNhcHMgPSBmcy5yZWFkRmlsZVN5bmMoY2FwcywgJ3V0ZjgnKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIC8vIG5vdCBhIGZpbGUsIG9yIG5vdCByZWFkYWJsZVxuICB9XG4gIGNhcHMgPSBKU09OLnBhcnNlKGNhcHMpO1xuICBpZiAoIV8uaXNQbGFpbk9iamVjdChjYXBzKSkge1xuICAgIHRocm93ICdJbnZhbGlkIGZvcm1hdCBmb3IgZGVmYXVsdCBjYXBhYmlsaXRpZXMnO1xuICB9XG4gIHJldHVybiBjYXBzO1xufVxuXG5mdW5jdGlvbiBnZXRQYXJzZXIgKCkge1xuICBsZXQgcGFyc2VyID0gbmV3IEFyZ3VtZW50UGFyc2VyKHtcbiAgICB2ZXJzaW9uOiByZXF1aXJlKHBhdGgucmVzb2x2ZShyb290RGlyLCAncGFja2FnZS5qc29uJykpLnZlcnNpb24sXG4gICAgYWRkSGVscDogdHJ1ZSxcbiAgICBkZXNjcmlwdGlvbjogJ0Egd2ViZHJpdmVyLWNvbXBhdGlibGUgc2VydmVyIGZvciB1c2Ugd2l0aCBuYXRpdmUgYW5kIGh5YnJpZCBpT1MgYW5kIEFuZHJvaWQgYXBwbGljYXRpb25zLicsXG4gICAgcHJvZzogcHJvY2Vzcy5hcmd2WzFdIHx8ICdBcHBpdW0nXG4gIH0pO1xuICBsZXQgYWxsQXJncyA9IF8udW5pb24oYXJncywgZGVwcmVjYXRlZEFyZ3MpO1xuICBwYXJzZXIucmF3QXJncyA9IGFsbEFyZ3M7XG4gIGZvciAobGV0IGFyZyBvZiBhbGxBcmdzKSB7XG4gICAgcGFyc2VyLmFkZEFyZ3VtZW50KGFyZ1swXSwgYXJnWzFdKTtcbiAgfVxuICB1cGRhdGVQYXJzZUFyZ3NGb3JEZWZhdWx0Q2FwYWJpbGl0aWVzKHBhcnNlcik7XG5cbiAgcmV0dXJuIHBhcnNlcjtcbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdEFyZ3MgKCkge1xuICBsZXQgZGVmYXVsdHMgPSB7fTtcbiAgZm9yIChsZXQgWywgYXJnXSBvZiBhcmdzKSB7XG4gICAgZGVmYXVsdHNbYXJnLmRlc3RdID0gYXJnLmRlZmF1bHRWYWx1ZTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdHM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFBhcnNlcjtcbmV4cG9ydCB7IGdldERlZmF1bHRBcmdzLCBnZXRQYXJzZXIgfTtcbiJdLCJzb3VyY2VSb290IjoiLi4vLi4ifQ==
