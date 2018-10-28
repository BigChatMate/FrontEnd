import React from 'react';
import { View, ListView, StyleSheet,TouchableOpacity, Text, Image, AsyncStorage } from 'react-native';
import Row from './Row';
// import chats from './data';


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
        paddingTop: 40,
        paddingBottom: 10,
        flexDirection: 'row'
    },
    toolbarButton: {
        width: 50,
        color: '#fff',
        textAlign: 'center',
        fontSize: 15,
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
        //tabBarVisible = false,
       header : null
    };

    constructor(props) {

        super(props);
        this._retrieveData = this._retrieveData.bind(this);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
         chats:[],
         isFetching : true,
         dataSource: ds,
     };  
    }

    componentDidMount() {
        this._retrieveData("userData").then((userData) => {

            console.log("In ChatList");
            console.log("userData: " + userData);
            userData = JSON.parse(userData);
            console.log(userData);
            console.log(userData.email);
            // return this._retrieveChatList(userData);


            try {

            let req = fetch("http://40.118.225.183:8000/chat/chatlist/?token=Token2", {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => {

                console.log("Inside fetching chatlist....");
                chatlist = response._bodyText;
                chatlist = JSON.parse(chatlist);

                this.setState(
                    {
                        isFetching: false,
                        chats: chatlist.chats
                    });
                console.log(this.state);
                console.log("thestate...");


                // alert(this.isFetching);
                // alert("isFetching");
                
            });
        } catch (exp) {

            this.setState(
                {
                    isFetching: false,
                    chats: null
                });

            this.render();

        }

        }).then(()=>{
            this._interval = setInterval(() => {
                
                this.refresh();
                // this._isMounted = false;
    
                // alert("time out");
            }, 1000);
        });


    }



    _retrieveData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                // We have data!!
                console.log("Retrieving data...");
                console.log(data);
                return value;
            }
        } catch (error) {
            console.log(error);
        }
    }

    // _goToChat = (chatId) => {

    //     ;

    // }
    
    

    render() {
        var {navigate} = this.props.navigation;
        if(this.state.isFetching === true){
        return(<View style={{ flex: 1 }} >
            <View style={styles.toolbar}>
                <Text style={styles.toolbarButton}>Add</Text>
                <Text style={styles.toolbarTitle}>All Chats</Text>
                <Text style={styles.toolbarButton}>Like</Text>
            </View>             
        </View>);}
        else{

        console.log("rendering...");

        return (
            <View style={{ flex: 1 }} >
                <View style={styles.toolbar}>
                    <Text style={styles.toolbarButton}>Add</Text>
                    <Text style={styles.toolbarTitle}>All Chats</Text>
                    <Text style={styles.toolbarButton}>Like</Text>
                </View>
                <ListView
                  //  dataSource={this.state.dataSource}
                  data = {this.state.chats}
                  dataSource = {this.state.dataSource.cloneWithRows(this.state.chats)}
                  renderRow={(data)=> this._renderRow(data,navigate)}
                    //renderRow={(data) => <Row {...data} />}
                 renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                />
            </View>
        );}
    }
    refresh(){
        this.setState({
            isFetching:false,
        })
        this._retrieveData("userData").then((userData) => {
            console.log("In ChatList");
            console.log("userData: " + userData);
            userData = JSON.parse(userData);
            console.log(userData);
            console.log(userData.email);
            // return this._retrieveChatList(userData);


            let req = fetch("http://40.118.225.183:8000/chat/chatlist/?token=Token1", {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => {
                chatlist = response._bodyText;
                chatlist = JSON.parse(chatlist);
                // alert(JSON.stringify(chatlist));

                this.setState(
                    {
                        isFetching: false,
                        chats: chatlist.chats,
                        //dataSource : ds.cloneWithRows(chats),
                    });
            });

        });

    }

    componentWillUnmount() {
        clearInterval(this._interval);
    }

    _renderRow(chats,navigate) {
        return (
          <TouchableOpacity onPress = {
            ()=>navigate("Chat",{chatId:chats.chatId,name: chats.name, onGoBack: ()=>this.refresh()})
          }>
            <Row {...chats}/>
            {/* <Text >{chats.name}</Text>
            <Text >{chats.message}</Text> */}
          </TouchableOpacity>
        );
      }
}



export default ChatList;