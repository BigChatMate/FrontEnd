'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var request = require('request-promise');

var _require = require('appium-support');

var logger = _require.logger;

var path = require('path');
var fs = require('fs');

// Bintray info
var BINTRAY_USERNAME = process.env.BINTRAY_USERNAME;
var BINTRAY_API_KEY = process.env.BINTRAY_API_KEY;
var BINTRAY_REPO = process.env.BINTRAY_REPO || 'appium';
var BINTRAY_SUBJECT = process.env.BINTRAY_SUBJECT || 'appium-builds';
var BINTRAY_PACKAGE = process.env.BINTRAY_PACKAGE || 'appium';
var BINTRAY_URL = 'https://bintray.com/api/v1';

var log = logger.getLogger('Bintray');

(function callee$0$0() {
  var BUILD_NAME, COMMIT_MESSAGE, postVersionUrl, uploadZipUrl;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        BUILD_NAME = process.env.TRAVIS_TAG || process.env.TRAVIS_COMMIT || Math.random() + "";
        COMMIT_MESSAGE = process.env.TRAVIS_COMMIT_MESSAGE || 'No commit message provided';

        // 1. Create a new 'version' that uses the commit SHA as the name
        log.info('Creating a new Bintray version: ' + BUILD_NAME);
        postVersionUrl = BINTRAY_URL + '/packages/' + BINTRAY_SUBJECT + '/' + BINTRAY_REPO + '/' + BINTRAY_PACKAGE + '/versions';

        log.info('Using Bintray REST API endpoint ' + postVersionUrl);
        context$1$0.prev = 5;
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(request.post(postVersionUrl, {
          body: {
            name: BUILD_NAME,
            desc: COMMIT_MESSAGE
          },
          json: true,
          auth: {
            user: BINTRAY_USERNAME,
            pass: BINTRAY_API_KEY
          }
        }));

      case 8:
        context$1$0.next = 13;
        break;

      case 10:
        context$1$0.prev = 10;
        context$1$0.t0 = context$1$0['catch'](5);

        // 409 means it was created already
        if (context$1$0.t0.statusCode !== 409) {
          log.error('Failed to create new version ' + BUILD_NAME + '. Reason: ' + context$1$0.t0.error.message);
          process.exit(-1);
        } else {
          log.info('Version ' + BUILD_NAME + ' was already created. Continuing.');
        }

      case 13:

        // 2. Upload and publish Appium.zip to Bintray
        log.info('Uploading \'appium.zip\' to bintray at version ' + BUILD_NAME);
        uploadZipUrl = BINTRAY_URL + '/content/' + BINTRAY_SUBJECT + '/' + BINTRAY_REPO + '/' + BINTRAY_PACKAGE + '/' + BUILD_NAME + '/appium-' + BUILD_NAME + '.zip?publish=1&override=1';

        log.info('Using Bintray REST API upload endpoint ' + uploadZipUrl);
        context$1$0.prev = 16;
        context$1$0.next = 19;
        return _regeneratorRuntime.awrap(request.put(uploadZipUrl, {
          formData: {
            file: {
              value: fs.createReadStream(path.resolve(__dirname, '..', '..', '..', 'appium.zip')),
              options: {
                filename: 'appium.zip',
                contentType: 'application/octet-stream'
              }
            }
          },
          auth: {
            user: BINTRAY_USERNAME,
            pass: BINTRAY_API_KEY
          }
        }));

      case 19:
        context$1$0.next = 24;
        break;

      case 21:
        context$1$0.prev = 21;
        context$1$0.t1 = context$1$0['catch'](16);

        if (context$1$0.t1.statusCode !== 409) {
          // Doesn't fail on 409 because sometimes 409 means that the asset was already published
          // and if that's the case, we don't want it to fail
          log.error('Didn\'t publish upload. Upload is already available. Reason:', context$1$0.t1.message);
        } else {
          log.error('Failed to publish \'appium.zip\' to ' + BUILD_NAME + '. Reason: ' + JSON.stringify(context$1$0.t1));
          process.exit(-1);
        }

      case 24:
        log.info('Done publishing \'appium.zip\' to ' + BUILD_NAME);

      case 25:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[5, 10], [16, 21]]);
})();

// Version info
// The random number is for local, throwaway tests
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3Qvc2NyaXB0cy9iaW50cmF5LXVwbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7O2VBQ3hCLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQzs7SUFBcEMsTUFBTSxZQUFOLE1BQU07O0FBQ2QsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7O0FBR3pCLElBQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQztBQUN0RCxJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztBQUNwRCxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksSUFBSSxRQUFRLENBQUM7QUFDMUQsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLElBQUksZUFBZSxDQUFDO0FBQ3ZFLElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxJQUFJLFFBQVEsQ0FBQztBQUNoRSxJQUFNLFdBQVcsK0JBQStCLENBQUM7O0FBRWpELElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRXhDLENBQUM7TUFHTyxVQUFVLEVBQ1YsY0FBYyxFQUlkLGNBQWMsRUEwQmQsWUFBWTs7OztBQS9CWixrQkFBVSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxJQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEFBQUM7QUFDeEYsc0JBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixJQUFJLDRCQUE0Qjs7O0FBR3hGLFdBQUcsQ0FBQyxJQUFJLHNDQUFvQyxVQUFVLENBQUcsQ0FBQztBQUNwRCxzQkFBYyxHQUFNLFdBQVcsa0JBQWEsZUFBZSxTQUFJLFlBQVksU0FBSSxlQUFlOztBQUNwRyxXQUFHLENBQUMsSUFBSSxzQ0FBb0MsY0FBYyxDQUFHLENBQUM7Ozt5Q0FFdEQsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFDakMsY0FBSSxFQUFFO0FBQ0osZ0JBQUksRUFBRSxVQUFVO0FBQ2hCLGdCQUFJLEVBQUUsY0FBYztXQUNyQjtBQUNELGNBQUksRUFBRSxJQUFJO0FBQ1YsY0FBSSxFQUFFO0FBQ0osZ0JBQUksRUFBRSxnQkFBZ0I7QUFDdEIsZ0JBQUksRUFBRSxlQUFlO1dBQ3RCO1NBQ0YsQ0FBQzs7Ozs7Ozs7Ozs7QUFHRixZQUFJLGVBQUUsVUFBVSxLQUFLLEdBQUcsRUFBRTtBQUN4QixhQUFHLENBQUMsS0FBSyxtQ0FBaUMsVUFBVSxrQkFBYSxlQUFFLEtBQUssQ0FBQyxPQUFPLENBQUcsQ0FBQztBQUNwRixpQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xCLE1BQU07QUFDTCxhQUFHLENBQUMsSUFBSSxjQUFZLFVBQVUsdUNBQW9DLENBQUM7U0FDcEU7Ozs7O0FBSUgsV0FBRyxDQUFDLElBQUkscURBQWlELFVBQVUsQ0FBRyxDQUFDO0FBQ2pFLG9CQUFZLEdBQU0sV0FBVyxpQkFBWSxlQUFlLFNBQUksWUFBWSxTQUFJLGVBQWUsU0FBSSxVQUFVLGdCQUFXLFVBQVU7O0FBQ3BJLFdBQUcsQ0FBQyxJQUFJLDZDQUEyQyxZQUFZLENBQUcsQ0FBQzs7O3lDQUUzRCxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRTtBQUM5QixrQkFBUSxFQUFFO0FBQ1IsZ0JBQUksRUFBRTtBQUNKLG1CQUFLLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ25GLHFCQUFPLEVBQUU7QUFDUCx3QkFBUSxFQUFFLFlBQVk7QUFDdEIsMkJBQVcsRUFBRSwwQkFBMEI7ZUFDeEM7YUFDRjtXQUNGO0FBQ0QsY0FBSSxFQUFFO0FBQ0osZ0JBQUksRUFBRSxnQkFBZ0I7QUFDdEIsZ0JBQUksRUFBRSxlQUFlO1dBQ3RCO1NBQ0YsQ0FBQzs7Ozs7Ozs7OztBQUVGLFlBQUksZUFBRSxVQUFVLEtBQUssR0FBRyxFQUFFOzs7QUFHeEIsYUFBRyxDQUFDLEtBQUssaUVBQWdFLGVBQUUsT0FBTyxDQUFDLENBQUM7U0FDckYsTUFBTTtBQUNMLGFBQUcsQ0FBQyxLQUFLLDBDQUFzQyxVQUFVLGtCQUFhLElBQUksQ0FBQyxTQUFTLGdCQUFHLENBQUcsQ0FBQztBQUMzRixpQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xCOzs7QUFFSCxXQUFHLENBQUMsSUFBSSx3Q0FBb0MsVUFBVSxDQUFHLENBQUM7Ozs7Ozs7RUFFM0QsRUFBRyxDQUFDIiwiZmlsZSI6InRlc3Qvc2NyaXB0cy9iaW50cmF5LXVwbG9hZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0LXByb21pc2UnKTtcbmNvbnN0IHsgbG9nZ2VyIH0gPSByZXF1aXJlKCdhcHBpdW0tc3VwcG9ydCcpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcblxuLy8gQmludHJheSBpbmZvXG5jb25zdCBCSU5UUkFZX1VTRVJOQU1FID0gcHJvY2Vzcy5lbnYuQklOVFJBWV9VU0VSTkFNRTtcbmNvbnN0IEJJTlRSQVlfQVBJX0tFWSA9IHByb2Nlc3MuZW52LkJJTlRSQVlfQVBJX0tFWTtcbmNvbnN0IEJJTlRSQVlfUkVQTyA9IHByb2Nlc3MuZW52LkJJTlRSQVlfUkVQTyB8fCAnYXBwaXVtJztcbmNvbnN0IEJJTlRSQVlfU1VCSkVDVCA9IHByb2Nlc3MuZW52LkJJTlRSQVlfU1VCSkVDVCB8fCAnYXBwaXVtLWJ1aWxkcyc7XG5jb25zdCBCSU5UUkFZX1BBQ0tBR0UgPSBwcm9jZXNzLmVudi5CSU5UUkFZX1BBQ0tBR0UgfHwgJ2FwcGl1bSc7XG5jb25zdCBCSU5UUkFZX1VSTCA9IGBodHRwczovL2JpbnRyYXkuY29tL2FwaS92MWA7XG5cbmNvbnN0IGxvZyA9IGxvZ2dlci5nZXRMb2dnZXIoJ0JpbnRyYXknKTtcblxuKGFzeW5jIGZ1bmN0aW9uICgpIHtcblxuICAvLyBWZXJzaW9uIGluZm9cbiAgY29uc3QgQlVJTERfTkFNRSA9IHByb2Nlc3MuZW52LlRSQVZJU19UQUcgfHwgcHJvY2Vzcy5lbnYuVFJBVklTX0NPTU1JVCB8fCAoTWF0aC5yYW5kb20oKSArIFwiXCIpOyAvLyBUaGUgcmFuZG9tIG51bWJlciBpcyBmb3IgbG9jYWwsIHRocm93YXdheSB0ZXN0c1xuICBjb25zdCBDT01NSVRfTUVTU0FHRSA9IHByb2Nlc3MuZW52LlRSQVZJU19DT01NSVRfTUVTU0FHRSB8fCAnTm8gY29tbWl0IG1lc3NhZ2UgcHJvdmlkZWQnO1xuXG4gIC8vIDEuIENyZWF0ZSBhIG5ldyAndmVyc2lvbicgdGhhdCB1c2VzIHRoZSBjb21taXQgU0hBIGFzIHRoZSBuYW1lXG4gIGxvZy5pbmZvKGBDcmVhdGluZyBhIG5ldyBCaW50cmF5IHZlcnNpb246ICR7QlVJTERfTkFNRX1gKTtcbiAgY29uc3QgcG9zdFZlcnNpb25VcmwgPSBgJHtCSU5UUkFZX1VSTH0vcGFja2FnZXMvJHtCSU5UUkFZX1NVQkpFQ1R9LyR7QklOVFJBWV9SRVBPfS8ke0JJTlRSQVlfUEFDS0FHRX0vdmVyc2lvbnNgO1xuICBsb2cuaW5mbyhgVXNpbmcgQmludHJheSBSRVNUIEFQSSBlbmRwb2ludCAke3Bvc3RWZXJzaW9uVXJsfWApO1xuICB0cnkge1xuICAgIGF3YWl0IHJlcXVlc3QucG9zdChwb3N0VmVyc2lvblVybCwge1xuICAgICAgYm9keToge1xuICAgICAgICBuYW1lOiBCVUlMRF9OQU1FLFxuICAgICAgICBkZXNjOiBDT01NSVRfTUVTU0FHRSxcbiAgICAgIH0sXG4gICAgICBqc29uOiB0cnVlLFxuICAgICAgYXV0aDoge1xuICAgICAgICB1c2VyOiBCSU5UUkFZX1VTRVJOQU1FLFxuICAgICAgICBwYXNzOiBCSU5UUkFZX0FQSV9LRVksXG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyA0MDkgbWVhbnMgaXQgd2FzIGNyZWF0ZWQgYWxyZWFkeVxuICAgIGlmIChlLnN0YXR1c0NvZGUgIT09IDQwOSkge1xuICAgICAgbG9nLmVycm9yKGBGYWlsZWQgdG8gY3JlYXRlIG5ldyB2ZXJzaW9uICR7QlVJTERfTkFNRX0uIFJlYXNvbjogJHtlLmVycm9yLm1lc3NhZ2V9YCk7XG4gICAgICBwcm9jZXNzLmV4aXQoLTEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cuaW5mbyhgVmVyc2lvbiAke0JVSUxEX05BTUV9IHdhcyBhbHJlYWR5IGNyZWF0ZWQuIENvbnRpbnVpbmcuYCk7XG4gICAgfVxuICB9XG5cbiAgLy8gMi4gVXBsb2FkIGFuZCBwdWJsaXNoIEFwcGl1bS56aXAgdG8gQmludHJheVxuICBsb2cuaW5mbyhgVXBsb2FkaW5nICdhcHBpdW0uemlwJyB0byBiaW50cmF5IGF0IHZlcnNpb24gJHtCVUlMRF9OQU1FfWApO1xuICBjb25zdCB1cGxvYWRaaXBVcmwgPSBgJHtCSU5UUkFZX1VSTH0vY29udGVudC8ke0JJTlRSQVlfU1VCSkVDVH0vJHtCSU5UUkFZX1JFUE99LyR7QklOVFJBWV9QQUNLQUdFfS8ke0JVSUxEX05BTUV9L2FwcGl1bS0ke0JVSUxEX05BTUV9LnppcD9wdWJsaXNoPTEmb3ZlcnJpZGU9MWA7XG4gIGxvZy5pbmZvKGBVc2luZyBCaW50cmF5IFJFU1QgQVBJIHVwbG9hZCBlbmRwb2ludCAke3VwbG9hZFppcFVybH1gKTtcbiAgdHJ5IHtcbiAgICBhd2FpdCByZXF1ZXN0LnB1dCh1cGxvYWRaaXBVcmwsIHtcbiAgICAgIGZvcm1EYXRhOiB7XG4gICAgICAgIGZpbGU6IHtcbiAgICAgICAgICB2YWx1ZTogZnMuY3JlYXRlUmVhZFN0cmVhbShwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnYXBwaXVtLnppcCcpKSxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBmaWxlbmFtZTogJ2FwcGl1bS56aXAnLFxuICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgYXV0aDoge1xuICAgICAgICB1c2VyOiBCSU5UUkFZX1VTRVJOQU1FLFxuICAgICAgICBwYXNzOiBCSU5UUkFZX0FQSV9LRVksXG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoZS5zdGF0dXNDb2RlICE9PSA0MDkpIHtcbiAgICAgIC8vIERvZXNuJ3QgZmFpbCBvbiA0MDkgYmVjYXVzZSBzb21ldGltZXMgNDA5IG1lYW5zIHRoYXQgdGhlIGFzc2V0IHdhcyBhbHJlYWR5IHB1Ymxpc2hlZFxuICAgICAgLy8gYW5kIGlmIHRoYXQncyB0aGUgY2FzZSwgd2UgZG9uJ3Qgd2FudCBpdCB0byBmYWlsXG4gICAgICBsb2cuZXJyb3IoYERpZG4ndCBwdWJsaXNoIHVwbG9hZC4gVXBsb2FkIGlzIGFscmVhZHkgYXZhaWxhYmxlLiBSZWFzb246YCwgZS5tZXNzYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmVycm9yKGBGYWlsZWQgdG8gcHVibGlzaCAnYXBwaXVtLnppcCcgdG8gJHtCVUlMRF9OQU1FfS4gUmVhc29uOiAke0pTT04uc3RyaW5naWZ5KGUpfWApO1xuICAgICAgcHJvY2Vzcy5leGl0KC0xKTtcbiAgICB9XG4gIH1cbiAgbG9nLmluZm8oYERvbmUgcHVibGlzaGluZyAnYXBwaXVtLnppcCcgdG8gJHtCVUlMRF9OQU1FfWApO1xuXG59KSgpOyJdLCJzb3VyY2VSb290IjoiLi4vLi4vLi4ifQ==
