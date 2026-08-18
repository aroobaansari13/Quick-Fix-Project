import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const registerUserInFirebase = async (email, password, name, additionalData = {}, role = '') => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email.trim(),
      password
    );
    const uid = userCredential.user.uid; 
    
    // Normalize role string to handle capital letters or extra spaces
    const normalizedRole = role ? role.toLowerCase().trim() : '';

    // Default status details for provider accounts
    const defaultProviderData = {
      isOnline: true,
      isAvailable: true,
      availabilityStatus: 'online',
      services: additionalData?.services || [],
    };

    if (normalizedRole === 'customer') {
      await firestore().collection('Customers').doc(uid).set({
        uid,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: 'customer',
        ...additionalData,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    } 
    else if (normalizedRole === 'mechanic' || normalizedRole === 'provider') {
      const mechanicPayload = {
        uid,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: 'mechanic',
        status: 'pending',
        ...additionalData,
        ...defaultProviderData, // Put defaultProviderData AFTER additionalData so it is NEVER overwritten
        shopDetails: {
          isOnline: true,
          isAvailable: true,
          ...(additionalData?.shopDetails || {}),
        },
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      // 1. Primary collection write
      await firestore().collection('Mechanics').doc(uid).set(mechanicPayload);

      // 2. Mirror entry in main 'users' collection
      await firestore().collection('users').doc(uid).set(mechanicPayload, { merge: true });
    } 
    else if (normalizedRole === 'fuelstation' || normalizedRole === 'fuel_station') {
      const fuelPayload = {
        uid,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: 'fuelStation',
        status: 'pending',
        ...additionalData,
        ...defaultProviderData,
        stationDetails: {
          isOnline: true,
          isAvailable: true,
          ...(additionalData?.stationDetails || {}),
        },
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      // 1. Primary collection write
      await firestore().collection('FuelStations').doc(uid).set(fuelPayload);

      // 2. Mirror entry in main 'users' collection
      await firestore().collection('users').doc(uid).set(fuelPayload, { merge: true });
    } 
    else {
      // Fallback if role is passed differently
      await firestore().collection('users').doc(uid).set({
        uid,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: role || 'user',
        ...defaultProviderData,
        ...additionalData,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    }

    console.log(`User registered as ${role} successfully inside primary collection!`);
    return { success: true, uid };

  } catch (error) {
    console.error("Firebase Signup Error:", error);
    let errorMessage = "Something went wrong. Please try again.";
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'That email is already in use!';
        break;
      case 'auth/invalid-email':
        errorMessage = 'That email address is invalid!';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password too weak (min 6 characters)!';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Check your connection!';
        break;
    }
    return { success: false, error: errorMessage };
  }
};