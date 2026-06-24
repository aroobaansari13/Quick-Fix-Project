import React, { useState } from 'react';
import MechanicSignUpStep1 from './MechanicSignUpStep1';
import MechanicSignUpStep2 from './MechanicSignUpStep2';

const MechanicSignUpContainer = ({ onBackToSelection, onSignInPress, onSignUpSuccess }) => {
  const [mechanicData, setMechanicData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  if (currentStep === 1) {
    return (
      <MechanicSignUpStep1 
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
        onSignUpFinish={() => {
          if (onSignUpSuccess) {
            onSignUpSuccess('pendingReview'); 
          }
        }} 
      />
    );
  }
  return null;
};
export default MechanicSignUpContainer;