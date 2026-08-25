import firestore from '@react-native-firebase/firestore';

export const ServiceManager = {
  // Real-time listener for provider's services
  subscribeToServices: (providerId, callback) => {
    if (!providerId) return () => {};

    return firestore()
      .collection('ProviderServices')
      .where('providerId', '==', providerId)
      .onSnapshot(
        snapshot => {
          if (!snapshot) {
            callback([]);
            return;
          }

          const services = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          callback(services);
        },
        error => {
          console.error("Error subscribing to services:", error);
          callback([]);
        }
      );
  },

  // Add a new service with initial online status and profile sync
  addService: async (serviceData) => {
    try {
      const { providerId, providerRole, title } = serviceData;

      if (!providerId) {
        throw new Error("Provider ID is required to add a service.");
      }

      // 1. Add new service document to 'ProviderServices' collection
      const newServiceRef = await firestore().collection('ProviderServices').add({
        ...serviceData,
        isOnline: true,
        isAvailable: true,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // 2. Sync service title into provider's main profile document
      if (providerRole && title) {
        const isFuel =
          providerRole === 'fuelStation' ||
          providerRole === 'fuel_station';

        const primaryCollection = isFuel
          ? 'FuelStations'
          : 'Mechanics';

        // Update primary collection (Mechanics or FuelStations)
        await firestore()
          .collection(primaryCollection)
          .doc(providerId)
          .set({
            services: firestore.FieldValue.arrayUnion(title),
            isOnline: true,
            isAvailable: true,
            availabilityStatus: 'online',
          }, { merge: true });
      }

      return newServiceRef;

    } catch (error) {
      console.error("Error adding service:", error);
      throw error;
    }
  },

  // Update existing service
  updateService: async (serviceId, updateData) => {
    try {
      return await firestore()
        .collection('ProviderServices')
        .doc(serviceId)
        .update({
          ...updateData,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error("Error updating service:", error);
      throw error;
    }
  },

  // Delete service
  deleteService: async (serviceId) => {
    try {
      return await firestore()
        .collection('ProviderServices')
        .doc(serviceId)
        .delete();
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  }
};