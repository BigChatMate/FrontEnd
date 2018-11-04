import React, { Component } from 'react';
import { StyleSheet, View, Button,Text,Image} from 'react-native';
import { Buffer } from 'buffer';
import Permissions from 'react-native-permissions';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';

export default class VoiceRecord extends Component {
  static navigationOptions  = {
    header : null
 };
  sound = null;
  state = {
    audioFile: '',
    recording: false,
    loaded: false,
    paused: true
  };

  async componentDidMount() {
    await this.checkPermission();

    const options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: 'test.wav'
    };

    AudioRecord.init(options);

    AudioRecord.on('data', data => {
      const chunk = Buffer.from(data, 'base64');
      // do something with audio chunk
    });
  }

  checkPermission = async () => {
    const p = await Permissions.check('microphone');
    console.log('permission check', p);
    if (p === 'authorized') return;
    this.requestPermission();
  };

  requestPermission = async () => {
    const p = await Permissions.request('microphone');
    console.log('permission request', p);
  };

  start = () => {
    console.log('start record');
    this.setState({ audioFile: '', recording: true, loaded: false });
    AudioRecord.start();
  };

  stop = async () => {
    if (!this.state.recording) return;
    console.log('stop record');
    let audioFile = await AudioRecord.stop();
    console.log('audioFile', audioFile);
    this.setState({ audioFile, recording: false });
  };

  load = () => {
    return new Promise((resolve, reject) => {
      if (!this.state.audioFile) {
        return reject('file path is empty');
      }

      this.sound = new Sound(this.state.audioFile, '', error => {
        if (error) {
          console.log('failed to load the file', error);
          return reject(error);
        }
        this.setState({ loaded: true });
        return resolve();
      });
    });
  };

  play = async () => {
    if (!this.state.loaded) {
      try {
        await this.load();
      } catch (error) {
        console.log(error);
      }
    }

    this.setState({ paused: false });
    Sound.setCategory('Playback');

    this.sound.play(success => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
      this.setState({ paused: true });
      // this.sound.release();
    });
  };

  pause = () => {
    this.sound.pause();
    this.setState({ paused: true });
  };

  render() {

    const { recording, paused, audioFile } = this.state;
    return (
      <View style={styles.container}>
      <View style={styles.toolbar}>
                <Text onPress = {
                       ()=> this.props.navigation.goBack()}
                    style={styles.toolbarButton} >Cancel</Text>
                  <Text style={styles.toolbarTitle}>Audio Record</Text>
          </View>
        <View style={styles.row}>
          <Button onPress={this.start} title="Record" disabled={recording} />
          <Button onPress={this.stop} title="Stop" disabled={!recording} />
          {paused ? (
            <Button onPress={this.play} title="Play" disabled={!audioFile} />
          ) : (
            <Button onPress={this.pause} title="Pause" disabled={!audioFile} />
          )}
        </View>
        <Image source={{ uri: "https://randomuser.me/api/portraits/men/4.jpg" }} style={styles.profilephoto}
                    resizeMode="stretch" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  //  justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  toolbarButton:{
    width: 50,            //Step 2
    color:'#fff',
    textAlign:'center',
    fontSize: 16,
},
  toolbar: {
    backgroundColor: '#00bfff',
    paddingTop: 40,
    paddingBottom: 10,
    flexDirection: 'row'    //Step 1
},
toolbarTitle: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    flex: 1
},
profilephoto:{
  alignSelf: 'center',
  paddingTop: 50,
  marginTop: 200,
  height: 200,
  width: 200,
  borderWidth: 1,
  borderRadius: 100,
},
text:{
  width: 50,            //Step 2
 // color:'#fff',
  textAlign:'center',
  fontSize: 20,
},
});
