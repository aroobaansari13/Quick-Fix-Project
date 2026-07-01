// src/services/ProviderSearchService.js
import firestore from '@react-native-firebase/firestore';
import { calculateDistance } from '../utils/distanceHelper';

export const searchNearbyServices = async (searchQuery, customerLat, customerLon) => {
  try {
    const servicesSnapshot = await firestore()
      .collection('ProviderServices')
      .where('title', '>=', searchQuery)
      .where('title', '<=', searchQuery + '\uf8ff')
      .get();

    const results = [];

    for (const doc of servicesSnapshot.docs) {
      const serviceData = doc.data();
      const { providerId, providerRole } = serviceData;

      // 1. Provider Profile fetch
      const collectionName = providerRole === 'fuel_station' ? 'FuelStations' : 'Mechanics';
      const providerDoc = await firestore().collection(collectionName).doc(providerId).get();

      if (providerDoc.exists) {
        const pData = providerDoc.data();
        
        // 2. Safely access location data
        const details = providerRole === 'fuel_station' ? pData.stationDetails : pData.shopDetails;

        if (details && typeof details.latitude !== 'undefined' && typeof details.longitude !== 'undefined') {
          const lat = parseFloat(details.latitude);
          const lng = parseFloat(details.longitude);

          console.log("Customer:", customerLat, customerLon);
          console.log("Provider:", lat, lng);
          console.log("Distance:", calculateDistance(customerLat, customerLon, lat, lng));
          
          const dist = calculateDistance(customerLat, customerLon, lat, lng);

          if (dist <= 7) {
            results.push({
              ...serviceData,
              providerName: pData.name || "Unknown",
              businessName: details.shopName || details.stationName || "No Business Name",
              address: details.address || "No Address",
              distance: dist.toFixed(1)
            });
          }
        } else {
          console.warn(`Provider ${providerId} missing location fields.`);
        }
      }
    }
    return results;
  } catch (error) {
  console.log("============== SEARCH ERROR ==============");
  console.log(error);
  console.log(error.code);
  console.log(error.message);
  console.log("=========================================");
  throw error;
}
};