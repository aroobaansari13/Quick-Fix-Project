import React, { useState } from 'react';
import SplashScreen from './src/screens/splash/SplashScreen';
import RegisterScreen from './src/screens/RegisterScreen'; 

const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);

  return (
    <>
      {isShowSplash ? (
        <SplashScreen onFinish={() => setIsShowSplash(false)} />
      ) : (
        <RegisterScreen />
      )}
    </>
  );
};

export default App;

