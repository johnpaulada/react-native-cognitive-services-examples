import { StackNavigator } from 'react-navigation';
import MainScreen from './screens/MainScreen'
import CameraScreen from './screens/CameraScreen'

const AppNavigator = StackNavigator({
  Main: {
    screen: MainScreen,
    navigationOptions: {
      headerTitle: 'Mood Tracker',
    },
  },
  Camera: {
    screen: CameraScreen,
    navigationOptions: {
      headerTitle: 'Take a Photo',
    },
  }
});

export default AppNavigator;