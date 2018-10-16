import React, { Component } from 'react';
import {AppRegistry, StyleSheet, Text, View, Image} from 'react-native';
import { createStackNavigator } from 'react-navigation';

var FBLoginButton = require('./FBLoginButton');
var GoogleLoginButton = require('./GoogleLoginButton');


class Login extends Component {

  _loginSuccess = async (data) => {

    console.log("Inside _loginSuccess");
    console.log(data);
    // try {
    // let req = await fetch('http://168.62.4.43:8000/auth/authenticate/?user_id='
    // + data.user_id + '&token=' + data.token + '&app_id=' + data.app_id + '&authType=' + data.authType, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });

    // if(req.error != "") {
    //   throw req.error
    // }
  // } catch (exception) {
  //   alert("Unable to log into BigChat." + exception)
  // }


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
      <Image resizeMode="contain" style={styles.logo} source={require('./BigChatLogo.png')} />        
      <Text style={styles.label1}>Log into BigChat</Text>
        <Text style={styles.label2}>using either Facebook or Google!</Text>
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
    backgroundColor: '#81c04d',
  },
  label1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  label2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black'
  },
  loginButtons: {
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 20,
    width: "100%",
  },
  logo: {
    width: 300,
    height: 100
}
});

export default Login;