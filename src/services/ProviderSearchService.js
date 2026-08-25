import firestore from '@react-native-firebase/firestore';
import { calculateDistance } from '../utils/distanceHelper';

export const searchNearbyServices = async (searchQuery, customerLat, customerLon) => {
  try {
    const servicesSnapshot = await firestore().collection('ProviderServices').get();
    const formattedQuery = searchQuery ? searchQuery.trim().toLowerCase() : '';
    const results = [];

    for (const doc of servicesSnapshot.docs) {
      const serviceData = doc.data() || {};
      const providerId = serviceData?.providerId;
      const providerRole = serviceData?.providerRole;

      if (!providerId) continue;

      const serviceTitle = typeof serviceData.title === 'string' ? serviceData.title.toLowerCase() : '';
      const serviceCategory = typeof serviceData.category === 'string' ? serviceData.category.toLowerCase() : '';

      if (formattedQuery !== '') {
        if (!serviceTitle.includes(formattedQuery) && !serviceCategory.includes(formattedQuery)) {
          continue;
        }
      }

      const isFuel = providerRole === 'fuelStation' || providerRole === 'fuel_station' || providerRole === 'fuel';
      const collectionName = isFuel ? 'FuelStations' : 'Mechanics';

      try {
        const providerDoc = await firestore().collection(collectionName).doc(providerId).get();
        
        if (!providerDoc || !providerDoc.exists) {
          console.log(`❌ Document NOT found in collection [${collectionName}] for providerId: ${providerId}`);
          continue;
        }

        const pData = providerDoc.data() || {};

        // 🔍 Debugging log for online status
        console.log(`🔍 Checking Provider [${providerId}] in [${collectionName}] | isOnline:`, pData?.isOnline);

        if (pData?.isOnline !== true) {
          console.log(`⏩ Skipped because isOnline is not true for: ${providerId}`);
          continue;
        }

        // Safe details extraction (Mechanic ke liye shopDetails check hota hai)
        const details = isFuel 
          ? (pData?.stationDetails || pData) 
          : (pData?.shopDetails || pData);

        // 🌟 Correct Priority: Pehle root level (pData.latitude) ya stationDetails ko check karein, kyunki shopDetails mein 0 save hai
        const lat = parseFloat(
          pData?.latitude ?? 
          pData?.stationDetails?.latitude ?? 
          pData?.shopDetails?.latitude ?? 
          0
        );
        
        const lng = parseFloat(
          pData?.longitude ?? 
          pData?.stationDetails?.longitude ?? 
          pData?.shopDetails?.longitude ?? 
          0
        );

        console.log(`📍 Fixed Coordinates for [${providerId}] -> Lat: ${lat}, Lng: ${lng}`);
        
        if (!isNaN(lat) && !isNaN(lng) && customerLat && customerLon) {
          const dist = calculateDistance(customerLat, customerLon, lat, lng);
          console.log(`📏 Calculated Distance: ${dist} KM (Threshold: 7 KM)`);

          if (dist <= 7) {
            results.push({
              id: doc.id,
              ...serviceData,
              title: serviceData.title || "Untitled Service",
              providerName: pData?.name || "Unknown",
              businessName: details?.shopName || details?.stationName || pData?.businessName || "No Name",
              profilePic: pData?.profilePic || null,
              distance: dist.toFixed(1),
            });
          } else {
            console.log(`⏩ Skipped because distance (${dist} KM) is greater than 7 KM.`);
          }
        } else {
          console.log(`❌ Invalid coordinates or customer location missing for provider: ${providerId}`);
        }
      } catch (innerError) {
        console.log('Skipping provider due to error:', innerError);
      }
    }
    return results;
  } catch (error) {
    console.error("Search Error:", error);
    throw error;
  }
};