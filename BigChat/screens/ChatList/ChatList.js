import React from 'react';
import { View, ListView, StyleSheet,RefreshControl,TouchableOpacity, Text, Image, AsyncStorage } from 'react-native';
import Row from './Row';
import Ionicons from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
    message: {
        color: 'blue',
        alignItems: 'center',
    },
    name: {
        fontFamily: 'Verdana',
        fontSize: 18,
        alignItems: 'center',
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
    },
    toolbar: {
        backgroundColor: '#00bfff',
        paddingTop: 30,
        paddingBottom: 10,
        flexDirection: 'row'
    },
    toolbarButton: {
        width: 50,
        color: '#fff',
        textAlign: 'center',
        fontSize: 17,
    },
    toolbarTitle: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        flex: 1
    }
});

class ChatList extends React.Component {
    static navigationOptions  = {
       header : null
    };

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
         chats:[],
         isFetching : true,
         dataSource: ds,
     };  
    }

    componentDidMount() {
        
        try {this._retrieveData("userData").then((userData) => {
            userData = JSON.parse(userData);
            this.setState({
            userData:userData,
        })
        this.refresh();
        this._interval = setInterval(() => {
                
                    this.refresh();
                }, 1000);
    });} catch (error){
        alert(error);
    }

    }



    _retrieveData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                return value;
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    

    render() {
        var {navigate} = this.props.navigation;
        if(this.state.isFetching === true){
        return(<View style={{ flex: 1 }} >
            <View style={styles.toolbar}>
                <Ionicons style={{color:'#fff',marginLeft:10,width:50}} name='md-add' size={28} onPress = {()=>this.gotoAdd(navigate)}/>                
                <Text style={styles.toolbarTitle}>All Chats</Text>
                <Text style={styles.toolbarButton}></Text>
            </View>             
        </View>);}
        else{

        return (
            <View style={{ flex: 1 }} >
                <View style={styles.toolbar}>
                    <Ionicons style={{color:'#fff',marginLeft:10,width:50}} name='md-add' size={28} onPress = {()=>this.gotoAdd(navigate)}/>
                    <Text style={styles.toolbarTitle}>All Chats</Text>
                    <Text style={styles.toolbarButton}></Text>
                </View>
                <ListView
                enableEmptySections={true}
                   dataSource={this.state.dataSource}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.isFetching}
                      onRefresh={this.refresh}
                    />
                  }
                  data = {this.state.chats}
                  dataSource = {this.state.dataSource.cloneWithRows(this.state.chats)}
                  renderRow={(data)=> this._renderRow(data,navigate)}
                 renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                />
            </View>
        );}
    }
    refresh=()=>{
        this.setState({
            isFetching:false,
        })
            try
            {let req = fetch("http://40.118.225.183:8000/chat/chatlist/?token="+this.state.userData.token, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => {
                chatlist = response._bodyText;
                // alert(chatlist);
                chatlist = JSON.parse(chatlist);

                this.setState(
                    {
                        isFetching: false,
                        chats: chatlist.chats,
                    });
            });
                }catch (exp) {

                        this.setState(
                            {
                                isFetching: false,
                                chats: null
                            });
                        alert(exp);

                        this.render();

                    }

    }
    comeBack(){
        this._retrieveData("userData").then((userData) => {
            userData = JSON.parse(userData);
            this.setState({
            userData:userData,
        })
        this.refresh();
        this._interval = setInterval(() => {
                
                    this.refresh();
                }, 1000);
    });
    }

    componentWillUnmount() {
        clearInterval(this._interval);
    }

    _renderRow(chats,navigate) {
        return (
          <TouchableOpacity onPress = {
            ()=>this.gotochat(chats,navigate)
          }>
            <Row {...chats}/>
            {/* <Text >{chats.name}</Text>
            <Text >{chats.message}</Text> */}
          </TouchableOpacity>
        );
      }

      gotoAdd(navigate){
        navigate("AddFriends",{onGoBack: ()=>this.comeBack()});
        clearInterval(this._interval);
      }

      gotochat(chats,navigate){
        navigate("Chat",{chatId:chats.chatId,name: chats.name,chatList_interval:this._interval, onGoBack: ()=>this.comeBack()});
        clearInterval(this._interval);
      }
}



export default ChatList;