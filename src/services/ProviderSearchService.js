// src/services/ProviderSearchService.js
import firestore from '@react-native-firebase/firestore';
import { calculateDistance } from '../utils/distanceHelper';

export const searchNearbyServices = async (searchQuery, customerLat, customerLon) => {
  try {
    // 1. Fetch all provider services from Firestore
    const servicesSnapshot = await firestore().collection('ProviderServices').get();

    const formattedQuery = searchQuery ? searchQuery.trim().toLowerCase() : '';
    const results = [];

    for (const doc of servicesSnapshot.docs) {
      const serviceData = doc.data();
      const { providerId, providerRole, title } = serviceData;

      if (!providerId) continue;

      // 🔍 Flexible Case-Insensitive Search Match (e.g., "tyre" matches "Tyre repair")
      if (formattedQuery !== '') {
        const serviceTitle = (title || '').toLowerCase();
        const serviceCategory = (serviceData.category || '').toLowerCase();
        
        const isMatch = serviceTitle.includes(formattedQuery) || serviceCategory.includes(formattedQuery);
        if (!isMatch) continue;
      }

      // 2. Correct Role Check ('fuelStation' & 'fuel_station' support)
      const isFuel = providerRole === 'fuelStation' || providerRole === 'fuel_station';
      const collectionName = isFuel ? 'FuelStations' : 'Mechanics';

      // First check in specific collection, then fallback to 'users' collection
      let providerDoc = await firestore().collection(collectionName).doc(providerId).get();
      
      if (!providerDoc.exists) {
        providerDoc = await firestore().collection('users').doc(providerId).get();
      }

      if (providerDoc.exists) {
        const pData = providerDoc.data();
        
        const details = isFuel 
          ? (pData.stationDetails || pData) 
          : (pData.shopDetails || pData);

        // 🟢 FIXED SAFE AVAILABILITY FILTER
        // Agar top-level par isOnline true hai, toh usay Online hi mana jaye
        const isOnline = pData.isOnline === true || (pData.isOnline !== false && details?.isOnline === true);
        const isAvailable = pData.isAvailable !== false && pData.availabilityStatus !== 'offline';

        if (!isOnline || !isAvailable) {
          console.log(`Skipping provider ${providerId} as they are offline.`);
          continue; 
        }

        // 3. Safely access location data
        const lat = parseFloat(details?.latitude || pData?.latitude);
        const lng = parseFloat(details?.longitude || pData?.longitude);

        if (!isNaN(lat) && !isNaN(lng) && customerLat && customerLon) {
          const dist = calculateDistance(customerLat, customerLon, lat, lng);

          // Distance threshold (7 KM)
          if (dist <= 7) {
            results.push({
              id: doc.id,
              ...serviceData,
              providerName: pData.name || "Unknown",
              businessName: details?.shopName || details?.stationName || pData.businessName || "No Business Name",
              address: details?.address || pData.address || "No Address",
              distance: dist.toFixed(1),
              providerType: providerRole,
              providerId: providerId,     
            });
          }
        } else {
          console.warn(`Provider ${providerId} missing valid location coordinates.`);
        }
      }
    }

    return results;

  } catch (error) {
    console.log("============== SEARCH ERROR ==============");
    console.log(error);
    console.log("=========================================");
    throw error;
  }
};