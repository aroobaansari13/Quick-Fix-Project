import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const registerUserInFirebase = async (email, password, name, additionalData, role) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email.trim(),
      password
    );
    const uid = userCredential.user.uid; 
    if (role === 'customer') {
      await firestore().collection('Customers').doc(uid).set({
        uid,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role,
        ...additionalData,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    } 

    else if (role === 'mechanic') {
      await firestore().collection('Mechanics').doc(uid).set({
        uid,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role,
        status: 'pending',
        ...additionalData,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    } 
    else if (role === 'fuelStation') {
      await firestore().collection('FuelStations').doc(uid).set({
        uid,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role,
        status: 'pending',
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