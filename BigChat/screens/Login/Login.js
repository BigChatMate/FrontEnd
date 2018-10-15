import React, { Component } from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';

var FBLoginButton = require('./FBLoginButton');
var GoogleLoginButton = require('./GoogleLoginButton');


class Login extends Component {

  _loginSuccess = (data) => {

    console.log("Inside _loginSuccess");
    console.log(data);

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Log into BigChat using either Facebook or Google!</Text>
          <FBLoginButton style={styles.loginButtons} onLogin={this._loginSuccess}/>
          <GoogleLoginButton style={styles.loginButtons} onLogin={this._loginSuccess}/>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  label: {
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 48,
  },
  loginButtons: {
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 20,
    width: "100%",
  }
});

export default Login;