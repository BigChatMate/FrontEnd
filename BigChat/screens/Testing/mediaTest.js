import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Image, AsyncStorage, Button } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';
var RNFS = require('react-native-fs');

// Later on in your styles..
var styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});


// More info on all the options is below in the API Reference... just some common use cases shown here
const options = {
    title: 'Select Image',
    mediaType: 'video',
};

class mediaTest extends Component {
    state = {
        gotImage: false,
        image: null,
        avatarSource: null,
    }

    _sendImage = () => {


        /**
        * The first arg is the options object for customization (it can also be null or omitted for default options),
        * The second arg is the callback which sends object: response (more info in the API Reference)
        */
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: 'content://' + response.path };

                // const source = response.path;
                // You can also display the image using data:
                // const source = { uri: 'data:image/png;base64,' + response.uri };

                console.log("Here");
                console.log(response);
                console.log(source);
                var file = null;
                console.log("Here 2.0:")
                RNFS.readFile( 'file://'+ response.path, 'base64').then((content) => {
                    console.log(content);
                    console.log(content.length);

                    const path = 'file://' + RNFS.DocumentDirectoryPath + '/Test.mp4';
                    console.log(path);
                    RNFS.writeFile(path, content, 'base64')
                    .then(success => {
                        console.log('FILE WRITTEN: ', "Test");
                        this.setState({
                            avatarSource: source,
                            image: source,
                            gotImage: true
                        });
                    })
                    .catch(err => {
                        console.log('File Write Error: ', err.message);
                    })


                });

                // var b64Response = btoa(response.uri);
                // console.log(b64Response);
                // console.log(length(b64Response));

                // this.setState({
                //     avatarSource: source,
                //     image: source,
                //     gotImage: true
                // });


                // try {

                //     var formdata = new FormData();
                //     formdata.append("user_id", 77);
                //     formdata.append("media", {
                //         uri: this.state.avatarSource,
                //         name: 'testPhotoName'
                //     });
                //     console.log("added to form...");

                //     var req = fetch("http://40.118.225.183:8000/media/mediaMessage/", {
                //         method: 'post',
                //         headers: {
                //             'Content-Type': 'multipart/form-data',
                //         },
                //         body: formdata
                //     }).then((response) => {

                //         alert(response._bodyText);

                //     });

                // } catch (error) {
                //     console.log(error);
                //     alert("Send image error")
                // }

            }
        });
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
                this.state.image = 'data:image/jpeg;base64,' + b64Response;
                this.state.gotImage = true;

                this.render();
            });

        } catch (error) {
            console.log(error);

            alert("send image error")
        }
    }

    handleError= (meta) => {
        console.log("Something went wrong...");
        console.log(meta);
    }

    render() {
        if (!this.state.gotImage) {
            return (
                <View>
                    <Button title="Send" onPress={this._sendImage} />
                    <Button title="Get" onPress={this._getImage} />
                </View>
            )
        } else {
            return (
                <View>
                    <Button title="Send" onPress={this._sendImage} />
                    <Image style={{width: 66, height: 58}} source={{ uri: 'file://' + RNFS.DocumentDirectoryPath + '/Test.mp4'}}></Image>
                    <Video style={{width: "100%", height: 100 }}
                      source={{ uri: 'file://' + RNFS.DocumentDirectoryPath + '/Test.mp4'}} 
                      onBuffer={this.handleError}
                      onError={this.handleError}
                      resizeMode="contain"
                     />
                </View>
            )
        }
    }
}

export default mediaTest;