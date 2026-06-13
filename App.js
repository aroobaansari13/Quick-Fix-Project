import React, { useState } from 'react';
import { View } from 'react-native';
import SplashScreen from './src/screens/splash/SplashScreen';
import UserSelection from './src/screens/auth/UserSelection';
import CustomerSignUp from './src/screens/auth/customer/CustomerSignUp';
import CustomerHome from './src/screens/customer/CustomerHome';
import SignIn from './src/screens/SignIn';
import ProviderSelection from './src/screens/auth/provider/ProviderSelection';

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
          onBack={() => setCurrentScreen('selection')} 
          onSignInSuccess={() => setCurrentScreen('customerHome')}
        />
      )}
      {currentScreen === 'providerSelection' && (
        <ProviderSelection 
          onMechanicPress={() => alert('Mechanic SignUp coming soon!')}
          onFuelPress={() => alert('Fuel Station SignUp coming soon!')}
          onSignInPress={() => setCurrentScreen('signIn')}
        />
      )}
     {currentScreen === 'customerHome' && (
      <CustomerHome />
     )}
   </View>
 );
};
export default App;


