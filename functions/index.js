const { onInit } = require('firebase-functions/v2/core');
const { onCall } = require('firebase-functions/v2/https');
const { onDocumentDeleted, onDocumentUpdated, onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');

admin.initializeApp();

// ✅ Helper — FCM token fetch karke notification bhejo
async function sendNotification(userId, title, body) {
  try {
    const tokenDoc = await admin.firestore()
      .collection('Notifications')
      .doc(userId)
      .get();

    if (!tokenDoc.exists) return;
    const token = tokenDoc.data()?.fcmToken;
    if (!token) return;

    await admin.messaging().send({
      token,
      notification: { title, body },
      android: { priority: 'high' },
      apns: { payload: { aps: { sound: 'default' } } },
    });

    console.log(`Notification sent to ${userId}`);
  } catch (error) {
    console.log('Notification error:', error);
  }
}

// ✅ 1. Naya ServiceRequest aaya — Provider ko notify karo
exports.onNewRequest = onDocumentCreated('ServiceRequests/{requestId}', async (event) => {
  const data = event.data?.data();
  if (!data) return;

  await sendNotification(
    data.providerId,
    '🔧 New Service Request!',
    `${data.customerName} is requesting for service.`
  );
});

// ✅ 2. Request status change — Customer ko notify karo
exports.onRequestStatusChanged = onDocumentUpdated('ServiceRequests/{requestId}', async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();

  if (before.status === after.status) return; // Status change nahi hua

  if (after.status === 'accepted') {
    await sendNotification(
      after.customerId,
      '✅ Request Accepted!',
      `${after.providerName} has accepted your request.`
    );
  } else if (after.status === 'completed') {
    await sendNotification(
      after.customerId,
      '🎉 Service Completed!',
      `${after.providerName} has completed the service. Give valuable feedback!`
    );
  } else if (after.status === 'rejected') {
    await sendNotification(
      after.customerId,
      '❌ Request Rejected',
      `${after.providerName} rejected your request. Choose another provider.`
    );
  }
});

// ✅ 3. Admin disable kare — User ko notify karo
exports.onUserDisabled = onCall(async (request) => {
  const { uid } = request.data;
  try {
    await admin.auth().updateUser(uid, { disabled: true });
    await sendNotification(
      uid,
      '⚠️ Account Disabled',
      'Admin  has been disabled your account.'
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Customer delete karne ke liye
exports.deleteUser = onCall(async (request) => {
  const { uid, collectionName } = request.data;
  try {
    // Notification bhejo pehle delete se pehle
    await sendNotification(
      uid,
      '🗑️ Account Deleted',
      'Admin  has been deleted your account permanently.'
    );
    await admin.auth().deleteUser(uid);
    await admin.firestore().collection(collectionName).doc(uid).delete();
    await admin.firestore().collection('Notifications').doc(uid).delete();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Customer disable karne ke liye — onUserDisabled use karo ab
exports.disableUser = onCall(async (request) => {
  const { uid } = request.data;
  try {
    await admin.auth().updateUser(uid, { disabled: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Login par notification bhejne ke liye
exports.onUserLoginNotification = onDocumentCreated('Notifications/{userId}', async (event) => {
  const userId = event.params.userId;
  const data = event.data?.data();
  
  // Agar token naya update hua hai ya create hua hai
  if (!data || !data.fcmToken) return;

  await sendNotification(
    userId,
    '🔐 Successfully Logged In!',
    'You have successfully signed in to QuickFix.'
  );
});

// Document delete hone par Auth se bhi delete karo
exports.clouddelauth = onDocumentDeleted("{collectionName}/{userId}", async (event) => {
  const collectionName = event.params.collectionName;
  const userId = event.params.userId;

  if (["Customers", "Mechanics", "FuelStations"].includes(collectionName)) {
    try {
      await admin.auth().deleteUser(userId);
      console.log(`Deleted ${userId} from Auth`);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
});