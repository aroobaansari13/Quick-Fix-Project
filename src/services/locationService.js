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
      // Agar permission nahi mili toh request karein
      const requestStatus = await request(permissionLocation);
      if (requestStatus !== RESULTS.GRANTED) {
        Alert.alert("Permission Required", "App chalanay k liye location permission zaroori hai.");
        return false;
      }
    } else if (status === RESULTS.BLOCKED) {
      Alert.alert("Permission Blocked", "Kindly settings mein ja kar location permission allow karein.");
      return false;
    }

    // 2. Agar permission GRANTED hai, toh ab check karein ke Phone ki GPS Location "ON" hai ya nahi
    if (Platform.OS === 'android') {
      try {
        // Yeh line Android par check karegi, agar GPS off hua toh automatically system dialog kholegi
        const result = await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        });
        // Agar user 'OK' click karega toh result 'already-enabled' ya 'enabled' aayega
        return result === 'already-enabled' || result === 'enabled';
      } catch (err) {
        // Agar user cancel kar de
        console.log("Android location enable cancelled", err);
        return false;
      }
    } else {
      // iOS par jab hum core-location call karte hain, agar GPS off ho toh iOS automatically popup dikha deta hai
      return true;
    }
  } catch (error) {
    console.log("Location Helper Error:", error);
    return false;
  }
};