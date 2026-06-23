import React, { useState } from 'react';
import FuelStationSignUpStep1 from '../fuel/FuelStationSignUpStep1';
import FuelStationSignUpStep2 from '../fuel/FuelStationSignUpStep2';

const FuelStationSignUpContainer = ({ onBackToSelection, onSignInPress, onSignUpSuccess }) => {
  const [fuelStationData, setFuelStationData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  // 🔢 STEP 1: Basic Details
  if (currentStep === 1) {
    return (
      <FuelStationSignUpStep1 
        onNext={(data) => {
          setFuelStationData(data); // Step 1 ka validated data save kiya
          setCurrentStep(2);        // Step 2 par switch kiya
        }}
        onSignInPress={onSignInPress}
      />
    );
  }

  // 🔢 STEP 2: Station Commercial Details
  if (currentStep === 2) {
    return (
      <FuelStationSignUpStep2 
        step1Data={fuelStationData} // Step 1 ka data prop ke zariye forward kiya
        onBack={() => setCurrentStep(1)} 
        onSignInPress={onSignInPress}
        onSignUpFinish={onSignUpSuccess} // Final signup success callback
      />
    );
  }

  return null;
};

export default FuelStationSignUpContainer;