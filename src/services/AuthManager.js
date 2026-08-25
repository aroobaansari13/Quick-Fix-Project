import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AuthManager = {
  loginAndGetRole: async (email, password) => {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    const collections = ['Mechanics', 'FuelStations', 'Customers'];
    
    for (const col of collections) {
      const docSnapshot = await firestore().collection(col).doc(uid).get();
       console.log(`Checking ${col}:`, docSnapshot.exists);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data(); 
           console.log(`Data in ${col}:`, data); // ✅ Add karo
    console.log(`Status:`, data?.status);
        if (data?.status === 'disabled' || data?.isBlocked === true || data?.status === 'blocked') {
          await auth().signOut();
          const error = new Error("Your account has been disabled by admin");
          error.code = 'auth/user-disabled'; // Custom error code taaki UI par asani se catch ho
          throw error;
        }

        if (col === 'Mechanics' || col === 'FuelStations') {
          if (data?.status !== 'approved') {
            await auth().signOut();
            throw new Error("Your application is still under review.");
          }
          return col === 'Mechanics' ? 'mechanicHome' : 'fuelStationHome';
        }
        return 'customerHome';
      }
    }

    await auth().signOut();
    throw new Error("No account profile found.");
  }
};