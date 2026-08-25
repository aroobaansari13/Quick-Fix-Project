import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { FCMService } from './FCMService';

// 1. Poori App ki Session Initialization logic
export const initializeAppSession = async () => {
  try {
    const userRole = await AsyncStorage.getItem('userRole');
    const lastActiveStr = await AsyncStorage.getItem('lastActive');
    const currentUser = auth().currentUser;

    if (userRole && lastActiveStr && currentUser) {
      const lastActiveTime = parseInt(lastActiveStr, 10);
      const currentTime = Date.now();
      
      // 1 Mahina = 30 din * 24 ghante * 60 mint * 60 sec * 1000 milliseconds
      const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000; 

      if (currentTime - lastActiveTime > oneMonthInMillis) {
        // ⏳ 1 mahina guzar gaya -> Session expire
        await AsyncStorage.multiRemove(['userRole', 'lastActive']);
        await auth().signOut();
        return { isLoggedIn: false, screen: 'selection' };
      } else {
        // ✅ Session valid hai -> Last active update karein aur FCM initialize karein
        await AsyncStorage.setItem('lastActive', currentTime.toString());
        await FCMService.initializeFCM();

        let targetScreen = 'selection';
        if (userRole === 'customer') targetScreen = 'customerHome';
        else if (userRole === 'mechanic') targetScreen = 'mechanicHome';
        else if (userRole === 'fuel' || userRole === 'fuel_station') targetScreen = 'fuelStationHome';

        console.log('SESSION ROLE:', userRole);
        console.log('SESSION TARGET SCREEN:', targetScreen);

        return { isLoggedIn: true, role: userRole, screen: targetScreen };
      }
    } else {
      return { isLoggedIn: false, screen: 'selection' };
    }
  } catch (error) {
    console.log('App initialization error:', error);
    return { isLoggedIn: false, screen: 'selection' };
  }
};

// 2. Session Save karne ke liye
export const saveUserSession = async (role) => {
  try {
    await AsyncStorage.setItem('userRole', role);
    await AsyncStorage.setItem('lastActive', Date.now().toString());
  } catch (error) {
    console.log('Error saving session:', error);
  }
};

// 3. Logout / Clear Session ke liye
export const clearUserSession = async () => {
  try {
    await AsyncStorage.multiRemove(['userRole', 'lastActive']);
    await auth().signOut();
  } catch (error) {
    console.log('Error clearing session:', error);
  }
};