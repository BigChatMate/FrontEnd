import PropTypes from 'prop-types';
import React from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
} from 'react-native';
import MapView,{PROVIDER_GOOGLE}from 'react-native-maps';
import Marker from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Video from 'react-native-video';


export default class CustomView extends React.Component {
  constructor(props) {
    super(props);
}
  render() {
    // const { navigate } = this.props.navigation;
    if (this.props.currentMessage.location) {
      return (
        <TouchableOpacity style={[styles.container, this.props.containerStyle]} onPress={() => {
          const url = Platform.select({
            ios: `http://maps.apple.com/?ll=${this.props.currentMessage.location.latitude},${this.props.currentMessage.location.longitude}`,
            ios: `http://maps.google.com/?q=${this.props.currentMessage.location.latitude},${this.props.currentMessage.location.longitude}`
          });
          Linking.canOpenURL(url).then(supported => {
            if (supported) {
              return Linking.openURL(url);
            }
          }).catch(err => {
            console.error('An error occurred', err);
          });
        }}>
          <MapView
          provider = {PROVIDER_GOOGLE}
            style={[styles.mapView, this.props.mapViewStyle]}
            region={{
              latitude: this.props.currentMessage.location.latitude,
              longitude: this.props.currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
          <MapView.Marker 
            coordinate = {{latitude: this.props.currentMessage.location.latitude,
              longitude: this.props.currentMessage.location.longitude}}/>
          </MapView>


        </TouchableOpacity>
      );
    }

    else if(this.props.currentMessage.video){
      return(
        <TouchableOpacity style={[styles.container, this.props.containerStyle]} >
            {/* <Ionicons name='ios-play' size={25} style={{color:'#fff', marginLeft:5}}/> */}
            <Video source = {{uri: this.props.currentMessage.video.path}}
             ref={(ref) => {
              this.player = ref
            }} //// Store reference
              onEnd = {()=>this.player.seek(0)}            
            onBuffer={this.onBuffer}                // Callback when remote video is buffering
            onError={this.videoError}               // Callback when video cannot be loaded
            style={styles.videoView}  />
        </TouchableOpacity>
      );
    }
    else if(this.props.currentMessage.audio){
      return(
        <TouchableOpacity>

        </TouchableOpacity>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
  },
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
  videoView:{
    width: 150,
    height:250,
    borderRadius: 13,
    margin: 3,
  }
});

CustomView.defaultProps = {
  currentMessage: {},
  containerStyle: {},
  mapViewStyle: {},
};

CustomView.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  mapViewStyle: ViewPropTypes.style,
};