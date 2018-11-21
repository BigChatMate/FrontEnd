import React, {Component} from 'react';
import { View, AsyncStorage, ListView, StyleSheet, Text,Image, TextInput, Button, FlatList, TouchableOpacity, SectionList } from 'react-native';

class AddFriends extends React.Component {


    state = {
        isFetching: true,
        friendRequests: [],
        friendSent: [],
        emailToAdd: "",
        emailToRemove: ""
    }

    _addEmail = async(email) => {
        // TODO: Implement this...

        console.log("adding..." + email);

        this._retrieveData("userData").then((userData) => {

            console.log("data recieved: " + userData);
            userData = JSON.parse(userData);

            if (email === userData.email) {
                alert("You can't add yourself...");
                return;
            }

            try {
             console.log("adding... " + email);
            //  let req = fetch("http://40.118.225.183:8000/addFriends/FriendRequests/?token=Token2&email=harmin@hotmail.ca&friendEmail=" + email, {

            let req = fetch("http://40.118.225.183:8000/addFriends/FriendRequests/?token="+ userData.token+ "&email=" + userData.email +"&friendEmail=" + email, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => {

                friendRequests = response._bodyText;

                friendRequests = JSON.parse(friendRequests);

                console.log(friendRequests);

            });

        } catch (exp) {
            alert("Failed to send add friend request.");
        }
        });

    }

    _retrieveData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                // We have data!!
                console.log("Data for:" + key);
                console.log(value);
                return value;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }


    componentWillMount() {

        this._retrieveRequests();

    }

    _retrieveRequests = () => {

        console.log("Retrieving data...");
        this._retrieveData("userData").then((userData) => {

            console.log("data recieved " + userData);
            userData = JSON.parse(userData);
            console.log(userData.token);
            try {

            // let req = fetch("http://40.118.225.183:8000/addFriends/FriendRequests/?token=Token2", {

            let req = fetch("http://40.118.225.183:8000/addFriends/FriendRequests/?token=" + userData.token, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => {

                console.log("In here...");
                friendRequests = response._bodyText;

                friendRequests = JSON.parse(friendRequests);

                console.log(friendRequests);

                this.setState(
                    {
                        isFetching: false,
                        friendRequests: friendRequests.recieved,
                        friendSent: friendRequests.sent
                    });

                this.render();

            });

        } catch (exp) {
            console.log(exp);
            this.setState(
                {
                    isFetching: false,
                    friendRequests: [],
                    friendSent: []
                });

            this.render();

        }
        });
    }

    _accept = async(email) => {

        this._retrieveData("userData").then((userData) => {

            userData = JSON.parse(userData);

            if (email === userData.email) {
                alert("You can't add yourself...");
                return;
            }

            try {

            // let req = fetch("http://40.118.225.183:8000/addFriends/FriendRequests/?token=Token2&email=harmin@hotmail.ca&friendEmail=" + email, {

            let req = fetch("http://40.118.225.183:8000/addFriends/FriendRequests/?token="+ userData.token+ "&email=" + userData.email +"&friendEmail=" + email, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => {

                friendRequests = response._bodyText;

                friendRequests = JSON.parse(friendRequests);

                console.log(friendRequests);

            });

        } catch (exp) {
            alert("Failed to add friend.");
        }
        });

    }

    _decline = async(email) => {

        console.log("Declining..." + email);

        this._retrieveData("userData").then((userData) => {

            userData = JSON.parse(userData);

            try {
            // let req = fetch("http://40.118.225.183:8000/addFriends/FriendRequests/?token=Token2&email=harmin@hotmail.ca&friendEmail=" + email, {
            let req = fetch("http://40.118.225.183:8000/addFriends/FriendRequests/?token="+ userData.token+ "&email=" + userData.email +"&friendEmail=" + email, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                },
            }).then((response) => {

                friendRequests = response._bodyText;

                friendRequests = JSON.parse(friendRequests);

                console.log(friendRequests);

            });

        } catch (exp) {
            alert("Failed to decline friend.");
        }
        });

    }


     renderRequests = ({ item, index, section: { title, data } }) => {
        return (
            <View style={styles.flatview}>
            <View style={styles.email}>
                <Text style={styles.textSize}>{item}</Text>
            </View>
            <View style={styles.optionButtons}>
                <TouchableOpacity 
                    style={styles.buttonPadding} 
                    onPress= {() => {
                        this._accept(item);
                    }} 
                ><Text style={styles.textSize}>Yes</Text></TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonPadding} 
                    onPress= {() => {
                        this._decline(item);
                    }} 
                    ><Text style={styles.textSize}>No</Text></TouchableOpacity> 
            </View>   
        </View>
        );
     };

    render() {

         if (this.state.isFetching) {
            return (

                <View style = {{flex: 1}} >
                    <View style={styles.toolbar}>
                            <Text style={styles.toolbarTitle}>Add Friends</Text>
                    </View>

                    <View style={styles.addFriendsBar}>
                        <TextInput
                            style={styles.input}
                            ref={input => { this.textInput = input }}
                            placeholder="Enter Email"
                            onChangeText={(emailToAdd) => {
                                    this.setState({emailToAdd})
                            }}
                        />
                        
                        <Button 
                            title="Add"
                            onPress= {() => {
                                this._addEmail(this.state.emailToAdd);
                                this.textInput.clear();
                            }} 
                        />

                    </View>

                    <View style={styles.addFriendsBar}>
                        <TextInput
                            style={styles.input}
                            ref={input => { this.textInputRemove = input }}
                            placeholder="Enter Email"
                            onChangeText={(emailToRemove) => {
                                    this.setState({emailToRemove})
                            }}
                        />
                        
                        <Button 
                            title="Remove"
                            onPress= {() => {
                                this._decline(this.state.emailToRemove);
                                this.textInputRemove.clear();
                            }} 
                        />

                    </View>

                </View>

            );
         } else {

             return (
             <View style = {{flex: 1}} >
                 <View style={styles.toolbar}>
                        <Text style={styles.toolbarTitle}>Add Friends</Text>
                 </View>

                 <View style={styles.addFriendsBar}>
                    <TextInput
                        style={styles.input}
                        ref={input => { this.textInput = input }}
                        placeholder="Enter Email"
                        onChangeText={(email) => {
                                this.setState({email})
                        }}
                    />
                    
                    <Button 
                        title="Add"
                        onPress= {() => {
                            this._addEmail(this.state.email);
                            this.textInput.clear();
                        }} 
                    />
                 </View>

                 <View style={styles.addFriendsBar}>
                        <TextInput
                            style={styles.input}
                            ref={input => { this.textInputRemove = input }}
                            placeholder="Enter Email"
                            onChangeText={(emailToRemove) => {
                                    this.setState({emailToRemove})
                            }}
                        />
                        
                        <Button 
                            title="Remove"
                            onPress= {() => {
                                this._decline(this.state.emailToRemove);
                                this.textInputRemove.clear();
                            }} 
                        />

                    </View>


                 {/* <FlatList 
                        // inverted={true}
                        onRefresh={() => {
                            this._retrieveRequests();
                        }}
                        refreshing={this.state.isFetching}                    
                        data={this.state.friendRequests}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) =>
                             <View style={styles.flatview}>
                                    <View style={styles.email}>
                                        <Text style={styles.textSize}>{item}</Text>
                                    </View>
                                    <View style={styles.optionButtons}>
                                        <TouchableOpacity 
                                            style={styles.buttonPadding} 
                                            onPress= {() => {
                                                this._accept(item);
                                            }} 
                                        ><Text style={styles.textSize}>Yes</Text></TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.buttonPadding} 
                                            onPress= {() => {
                                                this._decline(item);
                                            }} 
                                            ><Text style={styles.textSize}>No</Text></TouchableOpacity> 
                                    </View>   
                             </View>
                        }
                        keyExtractor={item => item}
                 /> */}

                <SectionList
                  onRefresh={() => {
                            this._retrieveRequests();
                  }}
                  refreshing={this.state.isFetching}               
                  renderItem={({item, index, section}) => 
                    <View style={styles.flatview}>
                        <View style={styles.email}>
                            <Text style={styles.textSize}>{item}</Text>
                        </View>
                        <View style={styles.optionButtons}>
                            <View style={styles.email}>
                                <Text style={styles.textSize}>Pending</Text>
                            </View>
                        </View>   
                    </View>
                  }
                  renderSectionHeader={({section: {title}}) => (
                    <Text style={{fontWeight: 'bold'}}>{title}</Text>
                  )}
                //   renderSectionFooter = {({section: {title}}) => (
                //     <Text>End Of Section</Text>
                //   )}
                  sections={[
                    {title: 'Requests', data: this.state.friendRequests, renderItem: this.renderRequests},
                    {title: 'Pending', data: this.state.friendSent}
                  ]}
                  keyExtractor={(item, index) => item + index}
                />

             </View>
             );
         }
    }
}

const styles = StyleSheet.create({
  buttonPadding: {
    marginRight: 15,
  },
  textSize: {
    fontSize: 17
  },
  optionButtons: {
    width: 100,
    justifyContent: "flex-end",
    paddingRight: 10,
    // backgroundColor: 'blue',
    borderRadius: 2,
    flexDirection:'row'
  },
  email: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 8,
    // backgroundColor: 'purple',
    borderRadius: 2,
    flexDirection:'row'
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  toolbar:{
    backgroundColor:'#81c04d',
    paddingTop:30,
    paddingBottom:10,
    flexDirection:'row'
},
addFriendsBar:{
    flexDirection:'row'    
},
input: {
    // height: 30,
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
toolbarTitle:{
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 20,
    flex:1
},
flatview: {
    // justifyContent: 'center',
    paddingTop: 15,
    paddingLeft: 15,
    height: 50,
    borderRadius: 2,
    flexDirection:'row' 
}
});

export default AddFriends;
