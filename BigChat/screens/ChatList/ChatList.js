import React from 'react';
import { View, ListView, StyleSheet,TouchableOpacity, Text, Image, AsyncStorage } from 'react-native';
import Row from './Row';
import data from './data';

class ChatList extends React.Component {

    constructor(props) {


        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        
        this.state = {
            dataSource: ds.cloneWithRows(data),
        };        
        
        
        this._retrieveData("userData").then((userData) => {

            console.log("In ChatList");
            console.log("userData: "  + userData);
            userData = JSON.parse(userData);
            console.log(userData);
            console.log(userData.email);

        })


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
        var {navigate} = this.props.navigation;

        return (
            <View style={{ flex: 1 }} >
                <View style={styles.toolbar}>
                    <Text style={styles.toolbarButton}>Add</Text>
                    <Text style={styles.toolbarTitle}>All Chats</Text>
                    <Text style={styles.toolbarButton}>Like</Text>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={ (data)=> this._renderRow(data,navigate)}
                    //renderRow={(data) => <Row {...data} />}
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                />
            </View>
        );
    }

    _renderRow(data,navigate) {
        return (
          <TouchableOpacity onPress = {
            ()=>navigate("Chat",{})
       }>
            <Row {...data} />
          </TouchableOpacity>
        );
      }
}

const styles = StyleSheet.create({
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

export default ChatList;