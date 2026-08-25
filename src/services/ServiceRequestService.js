import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const ServiceRequestService = {
  // 1. Customer request submit karega Firestore mein
  async createServiceRequest(requestData) {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) throw new Error("No authenticated user found.");

      // Customer ka profile data fetch karna users collection se
      const userDoc = await firestore()
      .collection('Customers')
      .doc(currentUser.uid)
      .get();

      const userData = userDoc.exists ? (userDoc.data() || {}) : {};

      const customerName =
      userData?.name ||
      userData?.fullName ||
      currentUser?.displayName ||
      "Customer";

      const customerProfileImage =
      userData?.profilePicture ||
      userData?.profileImage ||
      userData?.photoURL ||
      currentUser?.photoURL ||
      "";

      const rawProviderType =
  requestData?.provider?.providerType ||
  requestData?.provider?.providerRole ||
  requestData?.provider?.type ||
  '';

const normalizedProviderType =
  rawProviderType
    .toString()
    .trim()
    .toLowerCase();

const providerType =
  normalizedProviderType === 'fuelstation' ||
  normalizedProviderType === 'fuel_station' ||
  normalizedProviderType === 'fuel station' ||
  normalizedProviderType === 'fuel'
    ? 'fuel_station'
    : 'mechanic';

      const newRequest = {
        customerId: currentUser.uid,
        customerName,
        customerProfileImage,
        providerId:
        requestData?.provider?.providerId ||
        requestData?.provider?.id ||
        "",
        providerName:
        requestData?.provider?.providerName ||
        "",

        providerType: providerType,
        
      businessName:
      requestData?.provider?.businessName ||
      "",

      selectedServices: (requestData?.selectedServicesDetails || []).map(s => ({
          serviceId: s.id || '',
          title: s.title || '',
          price: Number(s.price || 0)
        })),
        description: requestData.description || "",
        totalAmount: (requestData?.selectedServicesDetails || []).reduce(
        (sum, item) => sum + Number(item?.price || 0),
        0
        ),
        distance: requestData?.provider?.distance || 0,
        status: "pending",
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await firestore().collection('ServiceRequests').add(newRequest);
      return { success: true, requestId: docRef.id };
    } catch (error) {
      console.error("Error creating service request: ", error);
      return { success: false, error: error.message };
    }
  },

  // 2. Provider ki pending requests real-time sunne ke liye
  subscribeProviderRequests(providerId, callback) {
    return firestore()
      .collection('ServiceRequests')
      .where('providerId', '==', providerId)
      .where('status', 'in', ['pending', 'accepted'])
      .onSnapshot(
        snapshot => {
          const requests = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          callback(requests);
        },
        error => {
          console.error("Error fetching provider requests: ", error);
          callback([]);
        }
      );
  },

  async completeRequest(requestId) {
  try {
    await firestore().collection('ServiceRequests').doc(requestId).update({
      status: 'completed',
      feedbackShown: false,
      completedAt: firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
  },

  // 3. Request status update karne ke liye (accept / reject)
  async updateRequestStatus(requestId, status) {
    try {
      await firestore().collection('ServiceRequests').doc(requestId).update({
        status: status, // "accepted" ya "rejected"
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating request status: ", error);
      return { success: false, error: error.message };
    }
  },

  subscribeCustomerRequests(customerId, callback) {
    return firestore()
      .collection('ServiceRequests')
      .where('customerId', '==', customerId)
      .where('status', 'in', ['pending', 'accepted'])
      .onSnapshot(
        snapshot => {
          const requests = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          callback(requests);
        },
        error => {
          console.error("Error fetching customer requests: ", error);
          callback([]);
        }
      );
  },

  // Customer history
subscribeCustomerHistory(customerId, callback) {
  return firestore()
    .collection('ServiceRequests')
    .where('customerId', '==', customerId)
    .where('status', 'in', ['completed', 'reviewed'])
    .onSnapshot(
      snapshot => {
        const requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(requests);
      },
      error => {
        console.error("Error fetching customer history:", error);
        callback([]);
      }
    );
},

// Provider history
subscribeProviderHistory(providerId, callback) {
  return firestore()
    .collection('ServiceRequests')
    .where('providerId', '==', providerId)
    .where('status', '==', 'completed')
    .onSnapshot(
      snapshot => {
        const requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(requests);
      },
      error => {
        console.error("Error fetching provider history:", error);
        callback([]);
      }
    );
},

  // Feedback save karne ke liye
  async submitFeedback(requestId, feedbackData) {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) throw new Error("No authenticated user found.");

      // 1. Feedbacks collection mein data save karein
      await firestore().collection('Feedbacks').add({
        requestId: requestId,
        customerId: currentUser.uid,
        customerName: feedbackData.customerName || 'Customer',
        customerEmail: currentUser.email || '',
        providerId: feedbackData.providerId || '',
        providerName: feedbackData.providerName || '',
        rating: feedbackData.rating,
        feedbackText: feedbackData.feedbackText,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // 2. Request status ko 'reviewed' ya 'closed' update kar dein taaki dobara popup na aaye
      await firestore().collection('ServiceRequests').doc(requestId).update({
        feedbackShown: true,
      });

      return { success: true };
    } catch (error) {
      console.error("Error submitting feedback: ", error);
      return { success: false, error: error.message };
    }
  }
};