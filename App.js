import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import SplashScreen from './src/screens/splash/SplashScreen';
import UserSelection from './src/screens/auth/UserSelection';
import CustomerSignUp from './src/screens/auth/customer/CustomerSignUp';
import CustomerHome from './src/screens/customer/CustomerHome';
import SignIn from './src/screens/SignIn';
import ProviderSelection from './src/screens/auth/provider/ProviderSelection';
import MechanicSignUpContainer from './src/screens/auth/provider/MechanicSignUpContainer';
import AdminDashboard from './src/screens/admin/AdminDashboard';
import PendingReviewScreen from './src/screens/auth/provider/PendingReviewScreen';
import MechanicHome from './src/screens/provider/MechanicHome';
import FuelStationSignUpContainer from './src/screens/auth/provider/FuelStationSignUpContainer';
import FuelStationHome from './src/screens/provider/FuelStationHome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [isSessionChecking, setIsSessionChecking] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('selection');

  useEffect(() => {
  // Firebase ka apna state listener
  const unsubscribe = auth().onAuthStateChanged(async (currentUser) => {
    if (!isShowSplash) {
      try {
        const userRole = await AsyncStorage.getItem('userRole');
        const lastActiveStr = await AsyncStorage.getItem('lastActive');

        if (currentUser && userRole && lastActiveStr) {
          const lastActive = parseInt(lastActiveStr, 10);
          const currentTime = Date.now();
          const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

          if (currentTime - lastActive > ONE_MONTH_MS) {
            await auth().signOut();
            await AsyncStorage.multiRemove(['userRole', 'lastActive']);
            setCurrentScreen('signIn');
          } else {
            await AsyncStorage.setItem('lastActive', currentTime.toString());
            
            if (userRole === 'customer') setCurrentScreen('customerHome');
            else if (userRole === 'mechanic') setCurrentScreen('mechanicHome');
            else if (userRole === 'fuel' || userRole === 'fuel_station') setCurrentScreen('fuelStationHome');
            else if (userRole === 'admin') setCurrentScreen('adminDashboard');
            else setCurrentScreen('selection');
          }
        } else {
          setCurrentScreen('selection');
        }
      } catch (error) {
        console.log("Session Error:", error);
        setCurrentScreen('selection');
      } finally {
        setIsSessionChecking(false);
      }
    }
  });

  return () => unsubscribe(); // clean up listener
  }, [isShowSplash]);

  if (isShowSplash) {
  return <SplashScreen onFinish={() => setIsShowSplash(false)} />;
  }

  if (isSessionChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{ marginTop: 10, color: '#64748B', fontWeight: '500' }}>Configuring profile context...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
     {currentScreen === 'selection' && (
      <UserSelection 
      onCustomerPress={() => setCurrentScreen('customerSignUp')} 
      onSignInPress={() => setCurrentScreen('signIn')} 
      onProviderPress={() => setCurrentScreen('providerSelection')} />
     )}

     {currentScreen === 'customerSignUp' && (
      <CustomerSignUp 
      onBack={() => setCurrentScreen('selection')}
      onSignUpSuccess={() => setCurrentScreen('customerHome')}
      onSignInPress={() => setCurrentScreen('signIn')}
      />
     )}
     {/* 3. General SignIn Screen */}
      {currentScreen === 'signIn' && (
        <SignIn 
          onAdminLoginSuccess={() => setCurrentScreen('adminDashboard')}
          onBack={() => setCurrentScreen('selection')} 
          
          onSignInSuccess={(role) => {
            if (role === 'customer') {
              setCurrentScreen('customerHome');
            } else if (role === 'mechanic') {
              setCurrentScreen('mechanicHome');
            } else if (role === 'fuel_station') {
              setCurrentScreen('fuelStationHome');
            } else if (role === 'admin') {
              setCurrentScreen('adminDashboard');
            } else {
              setCurrentScreen('selection'); // Fallback safe switch
            }
          }}
        />
      )}
      {currentScreen === 'providerSelection' && (
        <ProviderSelection 
          onMechanicPress={() => setCurrentScreen('mechanicFlow')}
          onFuelPress={() => setCurrentScreen('fuelStationFlow')}
          onSignInPress={() => setCurrentScreen('signIn')}
        />
      )}
      {currentScreen === 'mechanicFlow' && (
        <MechanicSignUpContainer 
          onBackToSelection={() => setCurrentScreen('providerSelection')} 
          onSignInPress={() => setCurrentScreen('signIn')}
          onSignUpSuccess={() => setCurrentScreen('mechanicHome')}
        />
      )}
      {currentScreen === 'mechanicHome' && (
        <MechanicHome />
      )}
      {/* 6. Fuel Station Multi-Step Container Flow */}
      {currentScreen === 'fuelStationFlow' && (
        <FuelStationSignUpContainer 
          onBackToSelection={() => setCurrentScreen('providerSelection')} 
          onSignInPress={() => setCurrentScreen('signIn')}
          onSignUpSuccess={() => setCurrentScreen('fuelStationHome')} 
        />
      )}
      {currentScreen === 'fuelStationHome' && (
        <FuelStationHome />
      )}
      {currentScreen === 'pendingReview' && (
        <PendingReviewScreen 
          onBackToSignIn={() => setCurrentScreen('signIn')} 
        />
      )}
      {currentScreen === 'adminDashboard' && (
        <AdminDashboard 
         onLogout={() => setCurrentScreen('signIn')} 
        />
      )}
     {currentScreen === 'customerHome' && (
      <CustomerHome />
     )}
   </View>
 );
};
export default App