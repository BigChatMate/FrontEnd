import React, {Component} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import Backend from './backend';
//import ChatList from '../ChatList'
// const util = require ('util');
import UUIDGenerator from 'react-native-uuid-generator';

import{
    View,
    Text,
    StyleSheet,
    Image,
    Button,
    AsyncStorage,
} from 'react-native';

const styles = StyleSheet.create({
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
      },
      toolbar:{
        backgroundColor:'#00bfff',
        paddingTop:40,
        paddingBottom:10,
        flexDirection:'row'    //Step 1
    },
  toolbarButton:{
      width: 50,            //Step 2
      color:'#fff',
      textAlign:'center',
      fontSize: 16,
  },
  toolbarTitle:{
      color:'#fff',
      textAlign:'center',
      fontWeight:'bold',
      fontSize: 25,
      flex:1                //Step 3
  }
  });


export default class Chat extends Component{
    static navigationOptions  = {
       header : null
    };
    state = {
        user_name:"",
        messages: [],
        uuid:[], 
        isFetching: true,
        messageLength: 0,
    };
    constructor(props) {
        super(props);
        this._isMounted = false;
    }
    componentWillMount() {
        
    }
    backAndRefresh(){
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
    }
    render(){
        var {navigate} = this.props.navigation;
        var {goBack} = this.props.navigation;
        if(this.state.isFetching){
            return(<View style = {{flex: 1}} >
                <View style={styles.toolbar}>
                    <Text onPress = {
                        ()=>goBack()
                    }
                    style={styles.toolbarButton} >Back</Text>

                    <Text style={styles.toolbarTitle}>{`${this.props.navigation.state.params.name}`}</Text>

                    <Text onPress = {
                         ()=>navigate("Profile",{})
                    }
                    style={styles.toolbarButton} >Profile</Text>
                </View>
                   
            </View>);
        }
        else
        return(
            <View style = {{flex: 1}} >
                <View style={styles.toolbar}>
                    <Text onPress = {
                       ()=> this.backAndRefresh()
                    }
                    style={styles.toolbarButton} >Back</Text>

                    <Text style={styles.toolbarTitle}>{`${this.props.navigation.state.params.name}`}</Text>

                    <Text onPress = {
                         ()=>navigate("Profile",{})
                    }
                    style={styles.toolbarButton} >Profile</Text>
                </View>
                <GiftedChat
                
                messages = {this.state.messages}
                onSend = {(text)=>{
                    this._sendMessage(text);
                }}
                user = {{name: this.state.user_name, _id: this.state.user_name}}/>
            </View>
            );
    }


    _retrieveData = async (key) => {
        try {
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
        }
    }

    _retrieveMessages = () => {
        this._retrieveData("userData").then((userData) => {
            userData = JSON.parse(userData);
            var chatId = this.props.navigation.state.params.chatId;
            try {
            let req = fetch("http://40.118.225.183:8000/chat/MessageHistory/?token=Token1&chatId=" + chatId , {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => {

                messages = response._bodyText;
                messages = JSON.parse(messages);
                
                for(i = 0; i<messages.messages.length;i++){
                    messages.messages[i].user._id = messages.messages[i].user.user_email;
                    messages.messages[i].text = messages.messages[i].message;
                    messages.messages[i].createdAt = new Date(messages.messages[i].time);
            }
                newMessageArray=this.state.messages;
                for(i = this.state.messageLength;i<messages.messages.length;i++){
                    newMessageArray = GiftedChat.append(newMessageArray,messages.messages[i])
                }
                this.setState(
                    {
                        user_name: userData.email,
                        isFetching: false,
                        messages:messages.messages,
                        messageLength:messages.messages.length,
                    });
                    
                // this._setUUID().then();
                // alert(JSON.stringify(this.state.messages))
                this._isMounted=true;
                // this.render();
            });

        } catch (exp) {
            alert("nonononoo");
            this.setState(
                {
                    isFetching: false,
                    messages: []
                });
        }

        });
    }

    _sendMessage = async(message) => {

        var new_message = message[0];
        message = message[0].text;
        if(message === "" || message === null)
            return;
        // alert(message);
        this._retrieveData("userData").then((userData) => {
            userData = JSON.parse(userData);
            // alert(message);
            // alert(userData.email);

            var chatId = this.props.navigation.state.params.chatId;
            try {
            let req = fetch("http://40.118.225.183:8000/chat/MessageHistory/?token=Token1&chatId=" + chatId + "&message=" + message + "&type=1&email=" + userData.email, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => {
                try {
                let req = fetch("http://40.118.225.183:8000/chat/MessageHistory/?token=Token1&chatId=" + chatId , {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                }).then((response) => {
                    console.log("Inside fetching chatlist....");
                    messages = response._bodyText;
                    messages = JSON.parse(messages);
                    this.setState(
                        {
                            isFetching: false,
                            // messages: messages,
                            messageLength: this.state.messageLength+1,
                            messages: GiftedChat.append(this.state.messages,new_message),

                        });   
    
                });
                // this.render();
            } catch (exception) {
            this.setState(
                {
                    isFetching: false,
                    messages: []
                });
            // this.render();
            }
            });
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
          }, 2000);
      }

    componentWillUnmount() {
        clearInterval(this._interval);
    }
}

  

