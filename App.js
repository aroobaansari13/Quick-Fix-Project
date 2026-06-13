import React, { useState } from 'react';
import { View } from 'react-native';
import SplashScreen from './src/screens/splash/SplashScreen';
import UserSelection from './src/screens/auth/UserSelection';
import CustomerSignUp from './src/screens/auth/customer/CustomerSignUp';
import CustomerHome from './src/screens/customer/CustomerHome';
import SignIn from './src/screens/SignIn';

const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('selection');

  if (isShowSplash) {
  return <SplashScreen onFinish={() => setIsShowSplash(false)} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
     {currentScreen === 'selection' && (
      <UserSelection onCustomerPress={() => setCurrentScreen('customerSignUp')} 
      onSignInPress={() => setCurrentScreen('signIn')} />
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
     {currentScreen === 'customerHome' && (
      <CustomerHome />
     )}
   </View>
 );
};
export default App;

