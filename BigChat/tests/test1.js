import wd from 'wd';
import chai from 'chai';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

const {assert} = chai;
const SERVER_PORT = 4723;
const SERVER_URL = 'localhost';
const CAPABILITIES = 
{platformName: 'iOS',
deviceName: 'iPhone X',
automationName: 'XCUITest',
app: '/Users/Austin/Desktop/CPEN\ 321/FrontEnd/BigChat/ios/build/Build/Products/Release-iphonesimulator/BigChat.zip',};

const driver = wd.promiseChainRemote(SERVER_URL, SERVER_PORT);

describe('AddFriends Component', () => {
                      
  beforeAll(async () => {
    try {
      await driver.init(CAPABILITIES);
      await driver.sleep(2000); // wait for app to load
    } catch(err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    try {
      await driver.quit();
    }
    catch(err) {
      console.error(err);
    }
  });
                                            
  test('test', async () => {
    // our test actions and expectations.
    expect(await driver.hasElementByAccessibilityId('AddFriends')).toBe(true);
    const addFriendsButton = await driver.elementsByAccessibilityId('AddFriends');
    await addFriendsButton.click();
    await driver.sleep(1000); //wait addFriends screen to load
    
  });    

});