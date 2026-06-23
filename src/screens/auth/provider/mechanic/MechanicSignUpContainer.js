import React, { useState } from 'react';
import MechanicSignUpStep1 from './MechanicSignUpStep1';
import MechanicSignUpStep2 from './MechanicSignUpStep2';

const MechanicSignUpContainer = ({ onBackToSelection, onSignInPress, onSignUpSuccess }) => {
  const [mechanicData, setMechanicData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // Shuruat Step 1 se hogi

  // 🔢 Agar currentStep 1 hai, toh Step 1 ki screen dikhao
  if (currentStep === 1) {
    return (
      <MechanicSignUpStep1 
        onNext={(data) => {
          setMechanicData(data); // Step 1 ka data yahan save ho gaya
          setCurrentStep(2);     // Screen automatic Step 2 par switch ho gayi
        }}
        onSignInPress={onSignInPress}
      />
    );
  }

  // 🔢 Agar currentStep 2 hai, toh Step 2 ki screen dikhao
  if (currentStep === 2) {
    return (
      <MechanicSignUpStep2 
        step1Data={mechanicData} // Step 1 ka data prop ke zariye Step 2 ko bhej diya
        onBack={() => setCurrentStep(1)} // Wapis jana ho toh step 1 par le jao
        onSignInPress={onSignInPress}
        onSignUpFinish={onSignUpSuccess} // Final signup success callback
      />
    );
  }

  return null;
};

export default MechanicSignUpContainer;
