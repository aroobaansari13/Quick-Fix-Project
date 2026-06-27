import firestore from '@react-native-firebase/firestore';

export const ServiceManager = {
  subscribeToServices: (providerId, callback) => {
    return firestore()
      .collection('ProviderServices')
      .where('providerId', '==', providerId)
      .onSnapshot(snapshot => {
        const services = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(services);
      });
  },
  addService: async (serviceData) => {
    return await firestore().collection('ProviderServices').add({
      ...serviceData,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  },
  updateService: async (serviceId, updateData) => {
    return await firestore().collection('ProviderServices').doc(serviceId).update({
      ...updateData,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  },
  deleteService: async (serviceId) => {
    return await firestore().collection('ProviderServices').doc(serviceId).delete();
  }
};
