import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';

export const ProviderLocationService = {

  startTracking(providerId, collectionName = 'Mechanics') { // ✅ collectionName parameter add kiya
    if (!providerId) return null;

    const watchId = Geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          await firestore()
            .collection(collectionName) // ✅ Dynamic collection
            .doc(providerId)
            .set(
              {
                currentLocation: { latitude, longitude },
                locationUpdatedAt: firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          console.log(`Provider location updated in ${collectionName}:`, { latitude, longitude });
        } catch (error) {
          console.log('Provider location update error:', error);
        }
      },
      (error) => {
        console.log('Provider location error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 5000,
        fastestInterval: 3000,
        forceRequestLocation: true,
      }
    );

    return watchId;
  },

  stopTracking(watchId) {
    if (watchId !== null && watchId !== undefined) {
      Geolocation.clearWatch(watchId);
      console.log('Provider location tracking stopped');
    }
  },
};