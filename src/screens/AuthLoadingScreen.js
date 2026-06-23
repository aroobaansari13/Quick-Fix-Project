import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // 1. Check karein kya Firebase mein user already logged-in hai?
        const currentUser = auth().currentUser;

        // 2. Local storage se User ka Role aur Last Active time nikalein
        const userRole = await AsyncStorage.getItem('userRole');
        const lastActiveStr = await AsyncStorage.getItem('lastActive');

        // Condition A: Agar user login hai aur local data bhi majood hai
        if (currentUser && userRole && lastActiveStr) {
          const lastActive = parseInt(lastActiveStr, 10);
          const currentTime = Date.now();
          
          // ⏳ 1 Month ki duration milliseconds mein calculation:
          // 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
          const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000; 

          // Check B: Kya user ne 1 month se app open nahi ki?
          if (currentTime - lastActive > ONE_MONTH_MS) {
            console.log("Session expired! 1 month limit crossed.");

            // Auto Logout triggered: Firebase aur Local Storage clear karein
            await auth().signOut();
            await AsyncStorage.multiRemove(['userRole', 'lastActive']);
            
            // Seedha Sign In screen par bhejein
            navigation.replace('SignIn'); 
          } else {
            // ✅ User active hai! Last active timestamp ko aaj ke waqt se update karein
            await AsyncStorage.setItem('lastActive', currentTime.toString());
            
            // User ke role ke mutabik direct sahi home screen par replace karein
            if (userRole === 'customer') {
              navigation.replace('CustomerHome');
            } else if (userRole === 'mechanic') {
              navigation.replace('MechanicHome');
            } else if (userRole === 'fuel') {
              navigation.replace('FuelHome');
            } else {
              navigation.replace('SignIn'); // Safe fallback
            }
          }
        } else {
          // Condition C: Agar user login nahi hai ya local data miss hai -> Sign In screen
          navigation.replace('SignIn');
        }
      } catch (error) {
        console.log("Error checking authentication session:", error);
        navigation.replace('SignIn');
      }
    };
    // Firebase configuration initialize hone ke liye 1.5 seconds ka buffer wait
    const timer = setTimeout(() => {
      checkUserSession();
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <View style={styles.container}>
      {/* Aap yahan apna App Logo bhi laga sakti hain */}
      <ActivityIndicator size="large" color="#10B981" />
      <Text style={styles.loadingText}>Loading App Context...</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  }
});

export default AuthLoadingScreen;