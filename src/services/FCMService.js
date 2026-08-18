// src/services/FCMService.js
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const FCMService = {

  // Permission maango aur token save karo
  async initializeFCM() {
    try {
      // 1. Permission request karo
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('FCM permission denied');
        return null;
      }

      // 2. Token lo
      const token = await messaging().getToken();
      console.log('FCM Token:', token);

      // 3. Token save karo
      await FCMService.saveToken(token);

      // 4. Token refresh listener
      messaging().onTokenRefresh(async (newToken) => {
        await FCMService.saveToken(newToken);
      });

      return token;
    } catch (error) {
      console.log('FCM init error:', error);
      return null;
    }
  },

  // Token Firestore mein save karo
  async saveToken(token) {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) return;

      await firestore()
        .collection('Notifications')
        .doc(currentUser.uid)
        .set({
          fcmToken: token,
          userId: currentUser.uid,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

      console.log('FCM token saved for:', currentUser.uid);
    } catch (error) {
      console.log('Token save error:', error);
    }
  },

  // Token delete karo logout par
  async deleteToken() {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) return;

      await messaging().deleteToken();
      await firestore()
        .collection('Notifications')
        .doc(currentUser.uid)
        .update({
          fcmToken: null,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log('FCM token deleted');
    } catch (error) {
      console.log('Token delete error:', error);
    }
  },

  // Foreground messages handle karo
  onForegroundMessage(callback) {
    return messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message:', remoteMessage);
      callback(remoteMessage);
    });
  },

  // Background/Quit messages handle karo
  setBackgroundHandler() {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background message:', remoteMessage);
    });
  },
};