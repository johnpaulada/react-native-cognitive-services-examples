import React, { Component } from 'react'
import { ActivityIndicator, Text, View, TouchableOpacity } from 'react-native'
import { Camera, Permissions } from 'expo'
import Config from '../config.json'

export default class CameraScreen extends Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.front,
    uploading: false
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  snap = async () => {
    if (this.camera) {
      const photo = await this.camera.takePictureAsync({quality: 0.1, base64: true});
      this.handleSnap(photo)
    } else {
      throw 'No camera.'
    }
  };

  handleSnap = async (photoData) => {
    const {navigate} = this.props.navigation
    const base64 = photoData.base64
    const moodData = await this.uploadImage(base64)
    navigate('Main', {moodData: {}}) 
  }

  uploadImage = async (base64) => {
    const uploadHeaders = new Headers()
    uploadHeaders.append('Content-Type', 'application/json')
    uploadHeaders.append('Authorization', `Client-ID ${Config.IMGUR_CLIENT_ID}`)

    const uploadConfig = {
      method: 'POST',
      headers: uploadHeaders,
      body: JSON.stringify({
        image: base64,
        type: 'base64'
      })
    }

    this.setState({uploading: true})

    console.log("Upload start.")

    const uploadRequest = new Request(Config.IMGUR_URL, uploadConfig)
    const response = await fetch(uploadRequest)
    const responseJson = await response.json()
    const link = responseJson.data.link

    console.log("Upload complete.")
    console.log("Emotion detection start.")

    const emotionHeaders = new Headers()
    emotionHeaders.append('Content-Type', 'application/json')
    emotionHeaders.append('Ocp-Apim-Subscription-Key', Config.EMOTION_API_KEY)

    const emotionConfig = {
      method: 'POST',
      headers: emotionHeaders,
      body: JSON.stringify({ url: link })
    }

    const emotionRequest = new Request(Config.EMOTION_API_URL, emotionConfig)
    const emotionResponse = await fetch(emotionRequest)
    const emotionData = await emotionResponse.json()
    const scores = emotionData[0].scores
    const topEmotion = Object.entries(scores).reduce(
      (acc, emotion) => emotion[1] > acc.score ? {emotion: emotion[0], score: emotion[1]} : acc
      , {emotion: '', score: 0})
    console.log(topEmotion)
    console.log("Emotion detection complete.")

    this.setState({uploading: false})

    // {
    //   "anger": 7.0617185E-05,
    //   "contempt": 0.000908500166,
    //   "disgust": 7.59633849E-07,
    //   "fear": 3.969399E-07,
    //   "happiness": 2.90608159E-06,
    //   "neutral": 0.998220146,
    //   "sadness": 0.000758499955,
    //   "surprise": 3.81818973E-05
    // }

    return topEmotion
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            ref={ref => { this.camera = ref; }}
            style={{ flex: 1 }}
            type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 0.9,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={this.snap}>
                {this.state.uploading ? <ActivityIndicator animating={this.state.uploading} /> : <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Snap{' '}
                </Text>}
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}