import React from 'react';
import { View, ListView,AsyncStorage, StyleSheet, Text, Image,TouchableOpacity} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons';
import Footer from './Footer';
import Button from 'apsl-react-native-button';



const styles = StyleSheet.create({
    buttonStyle1: {
        borderColor: '#d35400',
        backgroundColor: '#e98b39'
      },
      buttonStyle2: {
        borderColor: '#c0392b',
        backgroundColor: '#e74c3c'
      },
    buttonStyle3: {
        borderColor: '#16a085',
        backgroundColor: '#1abc9c'
    },
    buttonStyle4: {
        borderColor: '#27ae60',
        backgroundColor: '#2ecc71'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
    },
    textStyle: {
        color: 'white'
    },
    username: {
        marginTop: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        flex: 1,
    },
    text: {
        textAlign: 'center',
        fontSize: 20,
      //  color: '#00bfff'
    },
    profilephoto: {
        alignSelf: 'center',
        height: 200,
        width: 200,
        borderWidth: 1,
        borderRadius: 100,
    },
    toolbar: {
        backgroundColor: '#00bfff',
        paddingTop: 30,
        paddingBottom: 10,
        flexDirection: 'row'
    },
    toolbarTitle: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        flex: 1
    }
});

const Udata = {
    name: "Bill Gates",
    picture: "https://randomuser.me/api/portraits/men/4.jpg",
    googleAccount: "BillGates@google.com",
    UserId: "123456",
};

export default class Profile extends React.Component {
    static navigationOptions  = {
        //tabBarVisible = false,
       header : null
    };
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            isFetching:true,
            avatarSource: null,
            videoSource: null,
            userData: null,
            imgBase64: '',
            picture:'',
        };
    }
    componentDidMount() {

        this._retrieveAvatar();

      }
    render() {
        if(this.state.isFetching){
            return (
                    <View style={{ flex: 1 }}>
                        <View style={styles.toolbar}>
                            <Ionicons name='ios-arrow-back' size={25} style={{color:'#fff', marginLeft:5}}/>
                            <Text style={styles.toolbarTitle}>Profile</Text>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name='ios-arrow-back' size={25} style={{color:'#fff', marginLeft:5}}/>
                            <Image source={{ uri: 'data:image/jpeg;base64,'+this.state.picture }} style={styles.profilephoto} resizeMode="stretch" />
                        </TouchableOpacity>
                        <Text style={styles.username}> {this.props.name} </Text>
                        <View style={styles.container}>
                        </View>
                        <Footer />
                    </View>
            );
        }
        else 
        {return (
            <View style={{ flex: 1 }}>
                <View style={styles.toolbar}>
                    <Text style={styles.toolbarTitle}>Profile</Text>
                </View>
                <TouchableOpacity>
                        <Image source={{ uri: 'data:image/jpeg;base64,'+this.state.picture }} style={styles.profilephoto} resizeMode="stretch" />
                </TouchableOpacity>
                <Text style={styles.username}> {this.props.name} </Text>
                <View style={styles.container}>
                </View>
                <Footer />
            </View>

        );}
    }


    _retrieveData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                return value;
            }
        } catch (error) {
            alert(error);
            return null;
        }}

    _retrieveAvatar = () => {
        alert(this.props.email);
        alert(this.props.name);
        this._retrieveData("userData").then((userData) => {
        userData = JSON.parse(userData);
        //userData.token = "Token1"; //CHANGE THIS
        try {
        let req = fetch("http://40.118.225.183:8000/Contact/Profile/?email="+this.props.email , {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        }).then((response) => {

            let avatar = response._bodyText;
            avatar = JSON.parse(avatar);

            //userData.name = userData.email;
            this.setState(
                {
                    picture:avatar,
                    user_name: userData.name,
                    isFetching:false,
                });

        });

    } catch (exp) {
        alert("nonononoo");
    }

    });
    }


}

