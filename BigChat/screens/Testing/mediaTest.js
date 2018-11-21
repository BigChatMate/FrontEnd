import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Image, AsyncStorage, Button } from 'react-native';


var file = require('./BigChatLogo.png');

class mediaTest extends Component {
    state = {
        gotImage: false,
        image: null
    }


    _sendImage = () => {

        try {

            var formdata = new FormData();
            formdata.append("user_id", 77);
            formdata.append("media", );
            console.log("file: " + file);

            formdata.append
            var req = fetch("http://40.118.225.183:8000/media/mediaMessage/", {
                method: 'post',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formdata
            }).then((response) => {

                alert(response._bodyText);

            });

        } catch (error) {
            console.log(error);
            alert("send image error")
        }
    }


    _getImage = () => {

        try {


            formdata.append
            var req = fetch("http://40.118.225.183:8000/media/mediaMessage?user_id=77", {
                method: 'get',
            }).then((response) => {

                console.log(response);
                var rawImage = response._bodyText;
                var b64Response = btoa(rawImage);
                this.state.image = 'data:image/png;base64,' + b64Response;
                this.state.gotImage = true;

                this.render();
            });

        } catch (error) {
            console.log(error);

            alert("send image error")
        }
    }


    render() {
        if (!this.state.gotImage) {
            return (
                <View>
                    <Button title="Send" onPress={this._sendImage}/>
                    <Button title="Get" onPress={this._getImage}/>
                </View>
            )
        } else {
            return (
                <View>
                    <Button onPress={this._sendImage}></Button>
                    <Image source={this.state.image}></Image>
                </View>
            )
        }
    }
}

export default mediaTest;