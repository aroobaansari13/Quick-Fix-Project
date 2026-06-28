import { Platform, Alert } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

export const checkAndEnableLocation = async () => {
  try {
    // 1. check for device permission
    const permissionLocation = Platform.OS === 'ios' 
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const status = await check(permissionLocation);

    if (status === RESULTS.DENIED) {
     
      const requestStatus = await request(permissionLocation);
      if (requestStatus !== RESULTS.GRANTED) {
        Alert.alert("Permission Required", "App chalanay k liye location permission zaroori hai.");
        return false;
      }
    } else if (status === RESULTS.BLOCKED) {
      Alert.alert("Permission Blocked", "Kindly settings mein ja kar location permission allow karein.");
      return false;
    }
    if (Platform.OS === 'android') {
      try {
        const result = await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        });
        return result === 'already-enabled' || result === 'enabled';
      } catch (err) {
        console.log("Android location enable cancelled", err);
        return false;
      }
    } else {
      return true;
    }
  } catch (error) {
    console.log("Location Helper Error:", error);
    return false;
  }
};