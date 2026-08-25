import React, { useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MechanicSignUpStep1 from './MechanicSignUpStep1';
import MechanicSignUpStep2 from './MechanicSignUpStep2';

const MechanicSignUpContainer = ({ onBackToSelection, onSignInPress, onSignUpSuccess }) => {
  const [mechanicData, setMechanicData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleSignUpFinish = () => {
    if (onSignUpSuccess) {
      onSignUpSuccess('pendingReview');
    }
  };

  if (currentStep === 1) {
    return (
      <MechanicSignUpStep1 
        onBack={onBackToSelection}
        onNext={(data) => {
          setMechanicData(data); 
          setCurrentStep(2);   
        }}
        onSignInPress={onSignInPress}
      />
    );
  }

  if (currentStep === 2) {
    return (
      <MechanicSignUpStep2 
        step1Data={mechanicData} 
        onBack={() => setCurrentStep(1)}
        onSignInPress={onSignInPress}
        onSignUpFinish={handleSignUpFinish}
      />
    );
  }

  return null;
};
export default MechanicSignUpContainer;