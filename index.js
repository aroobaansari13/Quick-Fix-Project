/**
 * @format
 */
import app from '@react-native-firebase/app';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['This method is deprecated']);

if (!app.apps.length) {
  app.initializeApp();
}
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
