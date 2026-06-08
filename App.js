import React, { useState } from 'react';
import SplashScreen from './src/screens/splash/SplashScreen';
import UserSelection from './src/screens/auth/UserSelection';

const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);

  return (
    <>
      {isShowSplash ? (
        <SplashScreen onFinish={() => setIsShowSplash(false)} />
      ) : (
        <UserSelection />
      )}
    </>
  );
};

export default App;

