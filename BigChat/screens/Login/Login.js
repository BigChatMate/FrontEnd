import React, { Component } from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';

var FBLoginButton = require('./FBLoginButton');
var GoogleLoginButton = require('./GoogleLoginButton');


class Login extends Component {

  _loginSuccess = (data) => {

    console.log("Inside _loginSuccess");
    console.log(data);
    try {
    let req = await fetch('http://localhost:8000/auth/authenticate/?user_id='
    + data.user_id + '&token=' + data.token + '&app_id=' + data.app_id + '&authType=' + data.authType, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if(req.error != "") {
      throw req.error
    }
  } catch (exception) {
    alert("Unable to log into BigChat." + exception)
  }


  }

  // var req = fetch('https://mywebsite.com/endpoint/', {
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     firstParam: 'yourValue',
  //     secondParam: 'yourOtherValue',
  //   }),
  // });

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