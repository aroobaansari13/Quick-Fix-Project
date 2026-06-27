import React, { useState } from 'react';
import FuelStationSignUpStep1 from './FuelStationSignUpStep1'; 
import FuelStationSignUpStep2 from './FuelStationSignUpStep2';

const FuelStationSignUpContainer = ({ onBackToSelection, onSignInPress, onSignUpSuccess }) => {
  const [fuelData, setFuelData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  if (currentStep === 1) {
    return (
      <FuelStationSignUpStep1 
        onNext={(data) => {
          setFuelData(data); 
          setCurrentStep(2);   
        }}
        onSignInPress={onSignInPress}
      />
    );
  }
  if (currentStep === 2) {
    return (
      <FuelStationSignUpStep2 
        step1Data={fuelData} 
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
export default FuelStationSignUpContainer;