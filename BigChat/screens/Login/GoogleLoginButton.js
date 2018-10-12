import React, { Component } from 'react';
import { Alert, View, Button } from 'react-native';

import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

GoogleSignin.configure();

export default class GoogleLoginButton extends Component {

  // Somewhere in your code
  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo });

      // Contains user info (email, name, picture (if null, use stock))
      console.log(userInfo);

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        // Alert.alert("SIGN IN CANCLED");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
        // Alert.alert("SIGN IN IN_PROGRESS");

      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        // Alert.alert("SIGN PLAY_SERVICES_NOT_AVAILABLE");

      } else {
        // some other error happened
        Alert.alert("SIGN IN ERROR OTHER");

      }
    }
  };


  render() {
    return (
      <View>

       {/* <Button
          onPress={this.signIn}
          title="Login With Google"
          color={GoogleSigninButton.Color.Dark}
      /> */}

        <GoogleSigninButton
          style={{width: 195, height: 40 }}
          size={GoogleSigninButton.Size.Icon}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.signIn}
          // disabled={this.state.isSigninInProgress} 
          />
          
      </View>
    );
  }
}

module.exports = GoogleLoginButton;