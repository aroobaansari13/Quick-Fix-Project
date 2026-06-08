import React, { useEffect } from 'react';
import { Animated, StatusBar, View } from 'react-native';
import { styles } from './SplashScreen.styles';

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, [fadeAnim, onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={styles.container.backgroundColor} barStyle="light-content" />
      
      <Animated.Image
        source={require('../../assets/logo.png')}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="cover"
      />
    </View>
  );
};

export default SplashScreen;