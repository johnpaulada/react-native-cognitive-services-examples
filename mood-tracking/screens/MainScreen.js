import React, { Component } from 'react';
import Layout from '../components/Layout'

class MainScreen extends Component {
  componentDidMount() {
    // TODO: Get from AsyncStorage
  }

  state = {
    moods: {
      "mood": "Happy",
      "date": new Date()
    }
  }

  render() {
    return <Layout moods={this.state.moods} {...this.props} />
    // Authorization: Client-ID YOUR_CLIENT_ID
  }
}

export default MainScreen