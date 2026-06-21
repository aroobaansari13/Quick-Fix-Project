import React, { useState } from 'react';
import { View } from 'react-native';
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
import FuelStationSignUpStep1 from './src/screens/auth/provider/FuelStationSignUpStep1';
import FuelStationSignUpStep2 from './src/screens/auth/provider/FuelStationSignUpStep2';
import FuelStationHome from './src/screens/provider/FuelStationHome';

const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('selection');

  if (isShowSplash) {
  return <SplashScreen onFinish={() => setIsShowSplash(false)} />;
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
     {/* 4. SignIn screen ki condition add ki */}
      {currentScreen === 'signIn' && (
        <SignIn 
          onAdminLoginSuccess={() => setCurrentScreen('adminDashboard')}
          onBack={() => setCurrentScreen('selection')} 
          onSignInSuccess={() => setCurrentScreen('customerHome')}
        />
      )}
      {currentScreen === 'providerSelection' && (
        <ProviderSelection 
          onMechanicPress={() => setCurrentScreen('mechanicFlow')}
          onFuelPress={() => setCurrentScreen('fuelStationSignUpStep1')}
          onSignInPress={() => setCurrentScreen('signIn')}
        />
      )}
      {currentScreen === 'mechanicFlow' && (
        <MechanicSignUpContainer 
          onBackToSelection={() => setCurrentScreen('providerSelection')} 
          onSignInPress={() => setCurrentScreen('signIn')}
          onSignUpSuccess={() => setCurrentScreen('mechanicHome')} // 🟢 Direct Dynamic Navigation on Success!
        />
      )}
      {/* --- Step 2 --- */}
      {currentScreen === 'mechanicSignUpStep2' && (
        <MechanicSignUpStep2 
          onBack={() => setCurrentScreen('mechanicSignUpStep1')} // Wapis Step 1 par jane ke liye
          onSignUpFinish={() => setCurrentScreen('mechanicHome')} // Registration ke baad Login par le jayein
          onSignInPress={() => setCurrentScreen('signIn')}
        />
      )}
      {currentScreen === 'mechanicHome' && (
        <MechanicHome />
      )}
      {currentScreen === 'fuelStationSignUpStep1' && (
        <FuelStationSignUpStep1
          onNext={() => setCurrentScreen( 'fuelStationSignUpStep2')}
          onSignInPress={() => setCurrentScreen( 'signIn')}
          />
      ) }
      {currentScreen === 'fuelStationSignUpStep2' && ( 
        <FuelStationSignUpStep2
          onBack={() => setCurrentScreen('fuelStationSignUpStep1')} // Wapis Step 1 par jane ke liye
          onSignUpFinish={() => setCurrentScreen('fuelStationHome')} // Registration ke baad Login par le jayein
          onSignInPress={() => setCurrentScreen('signIn')}
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
export default App;


