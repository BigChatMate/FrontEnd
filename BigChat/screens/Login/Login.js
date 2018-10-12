import React, { Component, PropTypes } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import LoginForm from './LoginForm';

import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

// GoogleSignin.configure();

class Login extends Component {


  _fbAuth() {
    LoginManager.logInWithReadPermissions(['public_profile']).then(function (result) {
      if (result.isCancelled) {
        Alert.alert("Login Cancelled");
      } else {
        Alert.alert("Login Success permission granted:" + result.grantedPermissions);
      }
    }, function (error) {
      Alert.alert("some error occurred!!");
    })
  }

  // Somewhere in your code
  signIn = async () => {
    try {
      Alert.alert("SIGNING IN...");

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        Alert.alert("SIGN IN CANCLED");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
        Alert.alert("SIGN IN IN_PROGRESS");

      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Alert.alert("SIGN PLAY_SERVICES_NOT_AVAILABLE");

      } else {
        // some other error happened
        Alert.alert("SIGN IN ERROR OTHER");

      }
    }
  };


  render() {
    return (
      <View>
        <LoginButton
          publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    alert(data.accessToken.toString())
                  }
                )
              }
            }
          }
          onLogoutFinished={() => alert("logout.")} />
       
        <GoogleSigninButton
          style={{ width: 48, height: 48 }}
          size={GoogleSigninButton.Size.Icon}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.signIn}
          // disabled={this.state.isSigninInProgress} 
          />

          
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  loginContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center'
  },
  logo: {
    position: 'absolute',
    width: 300,
    height: 100
  }
});

export default Login;