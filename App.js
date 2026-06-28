import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, Alert } from 'react-native';
import SplashScreen from './src/screens/splash/SplashScreen';
import UserSelection from './src/screens/auth/UserSelection';
import CustomerSignUp from './src/screens/auth/customer/CustomerSignUp';
import CustomerHome from './src/screens/customer/CustomerHome';
import ManageProfile from './src/screens/customer/ManageProfile'; // 🌟 Nayi screen import ki
import SignIn from './src/screens/SignIn';
import ProviderSelection from './src/screens/auth/provider/ProviderSelection';
import MechanicSignUpContainer from './src/screens/auth/provider/mechanic/MechanicSignUpContainer';
import AdminDashboard from './src/screens/admin/AdminDashboard';
import PendingReviewScreen from './src/screens/auth/provider/PendingReviewScreen';
import MechanicHome from './src/screens/provider/mechanic/MechanicHome';
import FuelStationSignUpContainer from './src/screens/auth/provider/fuel/FuelStationSignUpContainer';
import FuelStationHome from './src/screens/provider/fuel/FuelStationHome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; 
import AdminPendingApplications from './src/screens/admin/AdminPendingApplications';

const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [isSessionChecking, setIsSessionChecking] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('selection');
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const [customerActiveTab, setCustomerActiveTab] = useState('home');

  useEffect(() => {
<<<<<<< HEAD
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
              
              if (userRole === 'customer') {
                setCustomerActiveTab('home'); // Login par default map (home) khule
                setCurrentScreen('customerHome');
              }
              else if (userRole === 'mechanic') setCurrentScreen('mechanicHome');
              else if (userRole === 'fuel' || userRole === 'fuel_station') setCurrentScreen('fuelStationHome');
              else if (userRole === 'admin') setCurrentScreen('adminDashboard');
              else setCurrentScreen('selection');
            }
          } else {
            const currentTime = Date.now();
            await AsyncStorage.setItem('lastActive', currentTime.toString());
            
            if (userRole === 'customer') setCurrentScreen('customerHome');
            else if (userRole === 'mechanic') setCurrentScreen('mechanicHome');
            else if (userRole === 'fuel' || userRole === 'fuel_station') setCurrentScreen('fuelStationHome');
            else setCurrentScreen('selection');
          }
        } catch (error) {
          console.log("Session Error:", error);
          setCurrentScreen('selection');
        } finally {
          setIsSessionChecking(false);
        }
=======
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (isShowSplash) return;
      if (!user) {
        setCurrentScreen('selection');
>>>>>>> 2bcb4fd8c332bb79a5d3418194bb4cfcccbbb925
      }
      setIsSessionChecking(false);
    });
    return () => unsubscribe();
  }, [isShowSplash]);
  if (isShowSplash) {
    return <SplashScreen onFinish={() => setIsShowSplash(false)} />;
  }
  
  if (isSessionChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{ marginTop: 10, color: '#64748B', fontWeight: '500' }}>Verifying Identity Securely...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {currentScreen === 'selection' && (
        <UserSelection 
          onCustomerPress={() => setCurrentScreen('customerSignUp')} 
          onSignInPress={() => setCurrentScreen('signIn')} 
          onProviderPress={() => setCurrentScreen('providerSelection')} 
        />
      )}

      {currentScreen === 'customerSignUp' && (
        <CustomerSignUp 
          onBack={() => setCurrentScreen('selection')}
          onSignUpSuccess={() => {
            setCustomerActiveTab('home');
            setCurrentScreen('customerHome');
          }}
          onSignInPress={() => setCurrentScreen('signIn')}
        />
      )}

      {currentScreen === 'signIn' && (
        <SignIn 
          onAdminLoginSuccess={() => setCurrentScreen('adminDashboard')}
          onBack={() => setCurrentScreen('selection')} 
          onSignInSuccess={(screenName) => {
          // AuthManager jo string return karega (e.g., 'mechanicHome'), 
          // ye seedha yahan mil jayega aur screen update ho jayegi
          setCurrentScreen(screenName);
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
          onSignUpSuccess={(targetScreen) => {
            if (targetScreen === 'pendingReview') {
               setCurrentScreen('pendingReview');
            } else {
                setCurrentScreen('mechanicHome');
            }
          }}
        />
      )}

      {currentScreen === 'mechanicHome' && (
        <MechanicHome onLogout={() => setCurrentScreen('signIn')} />
      )}

      {currentScreen === 'fuelStationFlow' && (
        <FuelStationSignUpContainer 
          onBackToSelection={() => setCurrentScreen('providerSelection')} 
          onSignInPress={() => setCurrentScreen('signIn')}
          onSignUpSuccess={(targetScreen) => {
            if (targetScreen === 'pendingReview') {
              setCurrentScreen('pendingReview'); 
            } else {
              setCurrentScreen('fuelStationHome'); 
            }
          }} 
        />
      )}

      {currentScreen === 'fuelStationHome' && (
        <FuelStationHome onLogout={() => setCurrentScreen('signIn')} />
      )}

      {currentScreen === 'pendingReview' && (
        <PendingReviewScreen 
          onBackToSignIn={async () => {
            try {
              await auth().signOut(); 
              await AsyncStorage.multiRemove(['userRole', 'lastActive']);
            } catch (e) { console.log(e); }
            setCurrentScreen('signIn');
          }} 
        />
      )}

      {currentScreen === 'adminDashboard' && (
        <AdminDashboard 
          onPendingApplicationsPress={() => setCurrentScreen('pendingAppsList')}
        />
      )}
      {currentScreen === 'pendingAppsList' && (
        <AdminPendingApplications 
          onBack={() => setCurrentScreen('adminDashboard')} 
        />
      )}

<<<<<<< HEAD
      {/* 🟢 Customer Home (Isme tab profile tracker callback add kiya hai navigation ke liye) */}
=======
>>>>>>> 2bcb4fd8c332bb79a5d3418194bb4cfcccbbb925
      {currentScreen === 'customerHome' && (
        <CustomerHome 
          onLogout={() => setCurrentScreen('signIn')} 
          initialTab={customerActiveTab} 
          profileImage={profileImage}
          onEditProfilePress={(newImage) => {
<<<<<<< HEAD
            setProfileImage(newImage);
          }}
          // 🌟 Jab user Manage Profile click kare, tab direct custom state transition ho
          onManageProfilePress={() => {
            setCurrentScreen('manageProfile');
          }}
        />
      )}

      {/* 🟢 7. Nayi Manage Profile Screen Render Execution Block */}
      {currentScreen === 'manageProfile' && (
        <ManageProfile 
          // Custom structural navigation handle karne ke liye parameters mock karein
          navigation={{
            goBack: () => {
              setCustomerActiveTab('profile'); // Back aate hi bottom tabs mein Profile tab open dikhe
              setCurrentScreen('customerHome');
            }
=======
            setProfileImage(newImage); 
>>>>>>> 2bcb4fd8c332bb79a5d3418194bb4cfcccbbb925
          }}
        />
      )}
    </View>
  );
};

export default App;