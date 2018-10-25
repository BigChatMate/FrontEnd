import React from 'react';
import { View, ListView, StyleSheet, Text, Image, AsyncStorage, FlatList, TouchableOpacity, TextInput, Button } from 'react-native';

class Chat extends React.Component {

    state = {

        isFetching: true,
        messages: [],
        text: "",

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
            return null;
        }
    }


    componentWillMount() {

        this._retrieveMessages();

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
                this.setState(
                    {
                        isFetching: false,
                        messages: messages.messages
                    });

                this.render();

            });

        } catch (exp) {

            this.setState(
                {
                    isFetching: false,
                    messages: []
                });

            this.render();

        }

        });

        

    }

    _sendMessage = async(message) => {

        if(message == "" || message == null)
            return;

        this._retrieveData("userData").then((userData) => {
            userData = JSON.parse(userData);

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
                    console.log(messages);
    
                    messages = JSON.parse(messages);
                    console.log(messages);
                    this.setState(
                        {
                            isFetching: false,
                            messages: messages.messages
                        });
    
    
                    console.log(this.state);
                    console.log("thestate...");
    
    
                    this.render();
    
    
                });

            } catch (exception) {
                
            this.setState(
                {
                    isFetching: false,
                    messages: []
                });

            this.render();

            }

            });

        } catch (exp) {


        }

        });




    }

    render() {
        console.log("rendering...");
        console.log(this.state.chats);

        if (this.state.isFetching)
            return (

                <View style={{ flex: 1 }} >
                    <View style={styles.toolbar}>
                        <Text style={styles.toolbarTitle}>Chat</Text>
                    </View>

                </View>

            );
        else {
            return (
                <View style={{ flex: 1 }} >
                    <View style={styles.toolbar}>
                        <Text style={styles.toolbarTitle}>Chat</Text>
                    </View>
                    <FlatList 
                        inverted={true}
                        onRefresh={() => {
                            this._retrieveMessages();
                        }}
                        refreshing={this.state.isFetching}                    
                        data={this.state.messages}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) =>
                            <View style={styles.flatview}>
                                    <Text style={styles.name}>{item.user_email}</Text>
                                    <Text style={styles.message}>{item.message}</Text>
                            </View>
                        }
                        keyExtractor={item => item.message}
                    />

                    <View>
                        <TextInput
                        ref={input => { this.textInput = input }}
                        placeholder="Type Message Here..."
                        onChangeText={(text) => {
                            this.setState({text})
                        }}
                        />
                        <Button 
                        title="Send"
                        onPress= {() => {
                            this._sendMessage(this.state.text);
                            this.textInput.clear();
                            
                            }} />
                    </View>
                </View>
            );
        }
    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: 50,
        // justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#F5FCFF',
      },
    message: {
        color: 'blue',
        alignItems: 'center',

    },
    name: {
        fontFamily: 'Verdana',
        fontSize: 18,
        alignItems: 'center',

    },
    flatview: {
        // justifyContent: 'center',
        paddingTop: 15,
        borderRadius: 2,
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
    },
    toolbar: {
        backgroundColor: '#81c04d',
        paddingTop: 30,
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
        fontSize: 20,
        flex: 1
    }
});

export default Chat;