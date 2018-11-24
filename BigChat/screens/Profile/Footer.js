import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,AsyncStorage } from 'react-native';
// import FBLoginManager from 'react-native-fbsdk';
import {GoogleSignin} from 'react-native-google-signin';
import {LoginManager} from 'react-native-fbsdk';
// import {AsyncStorage} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderColor: '#8E8E8E',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  text: {
    color: '#8E8E8E',
  },
});

const Footer = (props) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.button} onPress={this._logOut}>
      <Text style={styles.text}>LogOut</Text>
    </TouchableOpacity>
  </View>
);

_logOut = async () => {
  // var authType = this._retrieveData("userData").authType;
  // var userData = await this._retrieveData("userData");
  // //   userData = JSON.parse(userData);
  //   alert(userData)
  //   var authType = JSON.parse(userData).authType;
  //   alert(authType);
  // // authType = JSON.parse(authType);
  // // authType = authType.authType;
  // // alert(authType);
  // if (authType === "facebook") {

  //   // Facebook logout
  //   alert("facebook logging out");

  //   LoginManager.logOut();

  //   this.props.navigation.navigate("Login");


  // } else if (authType === "google") {
  //   try {
  //     await GoogleSignin.revokeAccess();
  //     await GoogleSignin.signOut();
  //     var data = {
  //       name: "", // Name
  //       email: "", // Email Address
  //       user_id: "",   // User's Name
  //       app_id: "", // app_id (FB or Google)
  //       token: "", // Authentication Token
  //       authType: "",   // Token issuer (FB or Google)
  //     }
  //     // Clearing AsyncStorage
  //     this._storeData("userData", JSON.stringify(data));
  //     this._storeData("logInStatus", "false");
  //     this.props.navigation.navigate("Login");

  //   } catch (error) {
  //     console.error(error);
  //   }

  // } else {

  //   console.log("Not logged into either facebook or google...");

  // }
  this._retrieveData("userData").then((userData) => {
    alert(userData)
    userData = JSON.parse(userData);
    alert(userData)

    // alert(message);
    // alert(userData.email);
    // userData.token = "Token1"; //CHANGE THIS

//     var chatId = this.props.navigation.state.params.chatId;
    
//     try {
//     let req = fetch("http://40.118.225.183:8000/chat/MessageHistory/?token="+userData.token+"&chatId=" + chatId + "&message=" + message + "&type="+type+"&email=" + userData.email+"&media="+media, {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//         },
//     })
// } catch (exp) {
//     this.setState(
//         {
//             isFetching: false,
//             messages: []
//         });
//     // this.render();
// }
// });
});

};

_storeData = async (key, value) => {
  try {
    console.log("Storing data...");
    console.log(value);
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
}

_retrieveData = async (key) => {
  if(this._isMounted)
  {try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
          // We have data!!
          // console.log("Retrieving data...");
          // console.log(data);
          return value;
      }
  } catch (error) {
      alert(error);
      return null;
  }}
}

export default Footer;