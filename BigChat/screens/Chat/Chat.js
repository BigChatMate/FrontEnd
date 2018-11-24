import React, {Component} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo';
import IconF from 'react-native-vector-icons/Foundation';
import {Menu,MenuOption,MenuTrigger,MenuOptions,MenuProvider,opened, renderers} from 'react-native-popup-menu';
import ImagePicker from 'react-native-image-picker';
import { Buffer } from 'buffer';
import Permissions from 'react-native-permissions';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';
import dismissKeyboard from 'dismissKeyboard';
import{View,Text,Keyboard,StyleSheet,Image,Button,AsyncStorage,}from 'react-native';

const styles = StyleSheet.create({
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
      },
      toolbar:{
        backgroundColor:'#00bfff',
        paddingTop:30,
        paddingBottom:10,
        flexDirection:'row'    //Step 1
    },
  toolbarButton:{
      width: 50,            //Step 2
      color:'#fff',
      textAlign:'center',
      fontSize: 17,
  },
  toolbarTitle:{
      color:'#fff',
      textAlign:'center',
      fontWeight:'bold',
      fontSize: 25,
      flex:1                //Step 3
  },
  });


export default class Chat extends Component{
    static navigationOptions  = {
       header : null
    };
    state = {
        imageSource:"",
        user_name:"",
        messages: [],
        userData:[],
        isFetching: true,
        messageLength: 0,
        opened: false,
        visible: false,
        videoSource: null,
        audioFile: '',
        recording: false,
        loaded: false,
        paused: true,
        audioStop: false,
    };
    constructor(props) {
        super(props);
        this._isMounted = false;
    }
 
    backAndRefresh(){
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
    }

    onBackdropPress() {
        this.setState({ opened: false });
      }
      onTriggerPress() {
        // GiftedChat.onKeyboardWillHide();
        dismissKeyboard();
        this.setState({ opened: true });
      }

    render(){
        const { recording, paused, audioFile } = this.state;
        var imageURI = "";
        // var base64Icon = 'data:image/png;base64,' + base64Data;
        var {navigate} = this.props.navigation;
        var {goBack} = this.props.navigation;
        if(this.state.isFetching){
            return(<View style = {{flex: 1}} >
                <View style={styles.toolbar}>
                <Ionicons name='ios-arrow-back' size={25} style={{color:'#fff', marginLeft:5}}/>
                    <Text onPress = {()=>goBack()} style={styles.toolbarButton} >Back</Text>
                    <Text style={styles.toolbarTitle}>{`${this.props.navigation.state.params.name}`}   </Text>
                    <Text onPress = {()=>navigate("ChatMenu",{})} style={styles.toolbarButton} >More</Text>
                </View>
            </View>);
        }
        else
        return(
            <MenuProvider style={{ flex: 1 }} >
                <View style={styles.toolbar}>
                    <Ionicons name='ios-arrow-back' size={25} style={{color:'#fff', marginLeft:5}}/>
                    <Text onPress = {()=> this.backAndRefresh()} style={styles.toolbarButton} >Back</Text>
                    <Text style={styles.toolbarTitle}>{`${this.props.navigation.state.params.name}`}</Text>
                    <Menu opened={this.state.opened} renderer={renderers.SlideInMenu} style = {{marginBottom: 10}}>
                            <MenuTrigger onPress={() => this.onTriggerPress()}>
                                <Text style={styles.toolbarButton}>More</Text>
                                {/* <Ionicons name='md-more' size={30} style={styles.toolbarButton}/> */}
                            </MenuTrigger>
                            <MenuOptions>
                                <View style = {{flexDirection:'row', justifyContent: 'space-evenly'}}>
                                    <MenuOption onSelect={this.selectPhotoTapped.bind(this)}>
                                        <Ionicons name='ios-image' size={25} style={{color:'grey',marginLeft:10}}/> 
                                        <Text style = {{textAlign: 'center',fontSize: 17}}>Image</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={this.selectVideoTapped.bind(this)}>
                                        <Ionicons name='md-videocam' size={25} style={{color:'grey',marginLeft:10}}/> 
                                        <Text style = {{textAlign: 'center',fontSize: 17,}}>Video</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => this.record()}>
                                        <Ionicons name='md-microphone' size={25} style={{color:'grey',marginLeft:10}}/> 
                                        <Text style = {{textAlign: 'center',fontSize: 17,}}>Audio</Text>
                                    </MenuOption>
                               </View>
                               <View style = {{flexDirection:'row',justifyContent: 'space-evenly',marginBottom: 20}}>
                                    <MenuOption> 
                                        <Icon name='location' size={25} style={{color:'grey',marginLeft:15}}/> 
                                        <Text style = {{textAlign: 'center',fontSize: 17,}}>Location</Text>
                                    </MenuOption>
                                    <MenuOption >
                                        <Ionicons name='logo-snapchat' size={25} style={{color:'grey',marginLeft:15}}/> 
                                        <Text style = {{textAlign: 'center',fontSize: 16,}}>SnapChat</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => this.onBackdropPress()} >
                                        <Ionicons name='ios-close' size={25} style={{color:'grey',marginLeft:20}}/> 
                                        <Text style = {{textAlign: 'center',fontSize: 17,marginLeft: 5}}>Cancel</Text>
                                    </MenuOption>
                               </View>
                            </MenuOptions>
                    </Menu>
                    <Menu opened = {this.state.visible} renderer={renderers.SlideInMenu}>
                        <MenuTrigger />
                        <MenuOptions style = {{flexDirection:'row', justifyContent: 'space-evenly',marginBottom: 20}}>
                            {!this.state.audioStop ? (<MenuOption onSelect={this.start} disabled={recording}>
                                <IconF name = 'record' size={25} style={this.state.recording ? {color:'red',marginLeft:15}
                                    : {color:'grey',marginLeft:15}}/>
                                <Text style = {this.state.recording ? {textAlign: 'center',fontSize: 17,color: 'red'} : 
                                    {textAlign: 'center',fontSize: 17}}>Record</Text>
                             </MenuOption>) 
                            : (<MenuOption> 
                                <Ionicons name = 'ios-send' size={25} style={{color:'grey',marginLeft:15}}/>
                                <Text style = {{textAlign: 'center',fontSize: 17,}}>Send</Text>
                            </MenuOption>)} 
                            {!this.state.audioStop ? (<MenuOption onSelect={this.stop} disabled={!recording}>
                                <IconF name = 'stop' size={25} style={{color:'grey',marginLeft:15}}/>
                                <Text style = {{textAlign: 'center',fontSize: 17,}}>Stop</Text>
                             </MenuOption>) 
                            : (<MenuOption onSelect={this.play} disabled={!audioFile}> 
                                <IconF name = 'play' size={25} style={{color:'grey',marginLeft:15}}/>
                                <Text style = {{textAlign: 'center',fontSize: 17,}}>Play</Text>
                            </MenuOption>)}
                            <MenuOption onSelect={() => this.setState({ visible: false,audioStop:false })}> 
                               <Ionicons name='ios-close' size={25} style={{color:'grey',marginLeft:20}}/> 
                               <Text style = {{textAlign: 'center',fontSize: 17,}}>Cancel</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>
                <GiftedChat
                keyboardShouldPersistTaps={'handled'}
                messages = {this.state.messages}
                onSend = {(text)=>{
                    this._sendMessage(text,"text");
                    // this.imageMessageTest();
                }}
                alwaysShowSend = {true}
                user = {{name: this.state.user_name, _id: this.state.user_name}}/>
            </MenuProvider>
        );
    }

    

    returnData = async (imageURI)=> {
        if(this._isMounted)
        try{
            this.setState({imageSource:imageURI})
            // alert(this.state.imageSource);
            await this._sendMessage(imageURI,"image");
        }catch (error) {
            alert(error);
            return null;
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

    _retrieveMessages = () => {
        if(this._isMounted)
    {this._retrieveData("userData").then((userData) => {
        // alert(typeof(userData));

        userData = JSON.parse(userData);
        // userData.token = "Token1"; //CHANGE THIS
        var chatId = this.props.navigation.state.params.chatId;
        try {
        let req = fetch("http://40.118.225.183:8000/chat/MessageHistory/?token="+userData.token+"&chatId=" + chatId , {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        }).then((response) => {

            messages = response._bodyText;
            // alert(messages);
            messages = JSON.parse(messages);
            var check = 1;
            
            for(i = 0; i<messages.messages.length;i++){
                messages.messages[i].user._id = messages.messages[i].user.user_email;
                messages.messages[i].user.name = messages.messages[i].user.user_email;
                messages.messages[i].user.avatar = 'data:image/jpeg;base64,'+messages.userData.image;
                if(messages.messages[i].type === 1)
                    messages.messages[i].text = messages.messages[i].message;
                else if (messages.messages[i].type === 3){
                    messages.messages[i].image = 'data:image/jpeg;base64,'+messages.messages[i].media;
                }
                messages.messages[i].createdAt = new Date(messages.messages[i].time);
                // messages.messages[i].user.name = userData.name;
        }
            newMessageArray=this.state.messages;
            for(i = this.state.messageLength;i<messages.messages.length;i++){
                newMessageArray = GiftedChat.append(newMessageArray,messages.messages[i])
            }
            if(this._isMounted)
            this.setState(
                {
                    user_name: userData.email,
                    isFetching: false,
                    messages:messages.messages,
                    messageLength:messages.messages.length,
                });
            // alert(JSON.stringify(this.state.messages[0]));
            // alert(this.state.user_name)
            // this._isMounted=true;
            
        });

    } catch (exp) {
        alert("nonononoo");
        this.setState(
            {
                isFetching: false,
                messages: []
            });
    }

    });}
    }

    _sendMessage = async(message,messageType) => {
        // alert(messageType);
        const user = {name: this.state.user_name, _id: this.state.user_email};
        // const user = {name: "harmin@hotmail.ca", _id: "harmin@hotmail.ca"};
        var new_message = {};var type = 1;
        var media = "no media";
       if(messageType === "text") 
       { new_message = message[0];
        message = message[0].text;
        if(message === "" || message === null)
            return;}
        else if(messageType === "image"){
            // alert("image");
            type = 3;
            message = "[image]";
            media = encodeURIComponent(this.state.imageSource);
            new_message.image='data:image/jpeg;base64,'+this.state.imageSource;
            // alert(this.state.imageSource);
        }
        new_message.user = user;
        // alert(message);
        this._retrieveData("userData").then((userData) => {
            // alert(userData)
            userData = JSON.parse(userData);
            // alert(message);
            // alert(userData.email);
            // userData.token = "Token1"; //CHANGE THIS

            var chatId = this.props.navigation.state.params.chatId;
            
            try {
            let req = fetch("http://40.118.225.183:8000/chat/MessageHistory/?token="+userData.token+"&chatId=" + chatId + "&message=" + message + "&type="+type+"&email=" + userData.email+"&media="+media, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            })
        } catch (exp) {
            this.setState(
                {
                    isFetching: false,
                    messages: []
                });
            // this.render();
        }
        });

    }

    componentDidMount() {
        // this._retrieveMessages();
        this._isMounted = true;
        this._retrieveMessages();

        this._interval = setInterval(() => {
            if(this._isMounted){
            this._retrieveMessages();
            // this._isMounted = false;

            // alert("time out");
        }
          }, 1000);
      }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this._interval);
    }
    //audio record setup 
    record = async () =>{
        await this.checkPermission(); 
        const options = {
          sampleRate: 16000,
          channels: 1,
          bitsPerSample: 16,
          wavFile: 'test.wav'
        };
    
        AudioRecord.init(options);
    
        AudioRecord.on('data', data => {
          const chunk = Buffer.from(data, 'base64');
          // do something with audio chunk
        });
        this.setState({ visible: true,opened:false })
      }
    
      checkPermission = async () => {
        const p = await Permissions.check('microphone');
        console.log('permission check', p);
        if (p === 'authorized') return;
        this.requestPermission();
      };
    
      requestPermission = async () => {
        const p = await Permissions.request('microphone');
        console.log('permission request', p);
      };
    //start recording 
      start = () => {
        console.log('start record');
        this.setState({ audioFile: '', recording: true, loaded: false});
        AudioRecord.start();
      };
    //stop recording 
      stop = async () => {
        if (!this.state.recording) return;
        console.log('stop record');
        let audioFile = await AudioRecord.stop();
        console.log('audioFile', audioFile);
        this.setState({ audioFile, recording: false,audioStop:true });
      };
    
      load = () => {
        return new Promise((resolve, reject) => {
          if (!this.state.audioFile) {
            return reject('file path is empty');
          }
    
          this.sound = new Sound(this.state.audioFile, '', error => {
            if (error) {
              console.log('failed to load the file', error);
              return reject(error);
            }
            this.setState({ loaded: true });
            return resolve();
          });
        });
      };
      //play audio 
      play = async () => {
        if (!this.state.loaded) {
          try {
            await this.load();
          } catch (error) {
            console.log(error);
          }
        }
    
        this.setState({ paused: false });
        Sound.setCategory('Playback');
    
        this.sound.play(success => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
          this.setState({ paused: true });
           this.sound.release();
        });
      };
    
      pause = () => {
        this.sound.pause();
        this.setState({ paused: true });
      };

    //Choose picture 
    selectPhotoTapped() {
        const options = {
            title: 'Choose Photos',
            cancelButtonTitle: 'Cancel',
            takePhotoButtonTitle: 'Take Photos',
            chooseFromLibraryButtonTitle: 'Choose Image from Photo Library',
            cameraType: 'back',
            mediaType: 'photo',
            videoQuality: 'high',
            durationLimit: 10,
            maxWidth: 300,
            maxHeight: 300,
            quality: 0.8,
            angle: 0,
            allowsEditing: false,
            noData: false,
            storageOptions: {
                skipBackup: true,
                path: 'imagess',
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                
                this.returnData(response.data);
                this.onBackdropPress();
            }
        });
    }

    //Choose video 
    selectVideoTapped() {
        const options = {
            title: 'Choose Video',
            cancelButtonTitle: 'Cancel',
            takePhotoButtonTitle: 'Record Video',
            chooseFromLibraryButtonTitle: 'Choose Video',
            mediaType: 'video',
            videoQuality: 'medium'
        };


        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled video picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                this.setState({
                    videoSource: response.uri
                });
            }
        });
    }
}