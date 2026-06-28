import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AuthManager = {
  loginAndGetRole: async (email, password) => {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    const collections = ['Mechanics', 'FuelStations', 'Customers'];
    
    for (const col of collections) {
      const docSnapshot = await firestore().collection(col).doc(uid).get();
      
      if (docSnapshot.exists()) {
        const data = docSnapshot.data(); 
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