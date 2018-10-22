import React from 'react';
import { View, ListView, StyleSheet, Text, Image, AsyncStorage, FlatList, TouchableOpacity } from 'react-native';
import Row from './Row';
import data from './data';

class ChatList extends React.Component {


    state = {
        isFetching: true,
        chats: null,

    }
    constructor(props) {


        super(props);

    }


    componentWillMount() {

        this._retrieveData("userData").then((userData) => {

            console.log("In ChatList");
            console.log("userData: " + userData);
            userData = JSON.parse(userData);
            console.log(userData);
            console.log(userData.email);


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


                this.render();


            });

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


    render() {
        console.log("rendering...");
        console.log(this.state.chats);

        if (this.state.isFetching)
            return (

                <View style={{ flex: 1 }} >
                    <View style={styles.toolbar}>
                        <Text style={styles.toolbarTitle}>All Chats</Text>
                    </View>

                </View>

            );
        else {
            return (
                <View style={{ flex: 1 }} >
                    <View style={styles.toolbar}>
                        <Text style={styles.toolbarTitle}>All Chats</Text>
                    </View>
                    <FlatList
                        data={this.state.chats}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) =>
                            <View style={styles.flatview}>
                                <TouchableOpacity>
                                    <Text style={styles.chatId}>{item.chatId}</Text>
                                    <Text style={styles.message}>{item.message}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        keyExtractor={item => item.message}
                    />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    chatId: {
        color: 'blue'
    },
    message: {
        fontFamily: 'Verdana',
        fontSize: 18
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

export default ChatList;