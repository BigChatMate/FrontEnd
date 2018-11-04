import React, {Component} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';


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
        uuid:[], 
        isFetching: true,
        messageLength: 0,
    };
    constructor(props) {
        super(props);
        this._isMounted = false;
    }
 
    backAndRefresh(){
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
    }
    render(){
        var imageURI = "";
        // var base64Icon = 'data:image/png;base64,' + base64Data;
        var {navigate} = this.props.navigation;
        var {goBack} = this.props.navigation;
        if(this.state.isFetching){
            return(<View style = {{flex: 1}} >
                <View style={styles.toolbar}>
                <Ionicons
                    name='ios-arrow-back'
                    size={25}
                    style={{color:'#fff', marginLeft:5}}/>

                    <Text onPress = {
                        ()=>goBack()
                    }
                    style={styles.toolbarButton} >Back</Text>

                    <Text style={styles.toolbarTitle}>{`${this.props.navigation.state.params.name}`}</Text>

                    <Text onPress = {
                         ()=>navigate("ChatMenu",{})
                    }
                    style={styles.toolbarButton} >More</Text>
                </View>
            </View>);
        }
        else
        return(
            <View style = {{flex: 1}} >
                <View style={styles.toolbar}>
                <Ionicons
                    name='ios-arrow-back'
                    size={25}
                    style={{color:'#fff', marginLeft:5}}/>
                    <Text onPress = {
                       ()=> this.backAndRefresh()
                    }
                    style={styles.toolbarButton} >Back</Text>

                    <Text style={styles.toolbarTitle}>{`${this.props.navigation.state.params.name}`}</Text>

                    <Text onPress = {
                         ()=>navigate("ChatMenu",{returnData: this.returnData.bind(this)})
                    }
                    style={styles.toolbarButton} >More</Text>
                </View>
                <GiftedChat
                messages = {this.state.messages}
                onSend = {(text)=>{
                    this._sendMessage(text,"text");
                    // this.imageMessageTest();
                }}
                alwaysShowSend = {true}
                user = {{name: this.state.user_name, _id: this.state.user_name}}/>
            </View>
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
        userData = JSON.parse(userData);
        userData.token = "Token1"; //CHANGE THIS
        var chatId = this.props.navigation.state.params.chatId;
        try {
        let req = fetch("http://40.118.225.183:8000/chat/MessageHistory/?token="+userData.token+"&chatId=" + chatId , {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        }).then((response) => {

            messages = response._bodyText;
            messages = JSON.parse(messages);
            var check = 1;
            for(i = 0; i<messages.messages.length;i++){
                messages.messages[i].user._id = messages.messages[i].user.user_email;
                if(messages.messages[i].type === 1)
                    messages.messages[i].text = messages.messages[i].message;
                else if (messages.messages[i].type === 3){
                    messages.messages[i].image = 'data:image/jpeg;base64,'+messages.messages[i].media;
                }
                messages.messages[i].createdAt = new Date(messages.messages[i].time);
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
            // alert(this.state.messages[0].image);
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
        const user = {name: this.state.user_name, _id: this.state.user_name};
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
            userData = JSON.parse(userData);
            // alert(message);
            // alert(userData.email);
            userData.token = "Token1"; //CHANGE THIS

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
}

  

