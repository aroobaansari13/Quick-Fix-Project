const { onInit } = require('firebase-functions/v2/core');
const { onCall } = require('firebase-functions/v2/https');
const { onDocumentDeleted } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');

let app;

onInit(() => {
  app = admin.initializeApp();
});

// Customer delete karne ke liye
exports.deleteUser = onCall(async (request) => {
  const { uid, collectionName } = request.data;
  try {
    await admin.auth().deleteUser(uid);
    await admin.firestore().collection(collectionName).doc(uid).delete();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Customer disable karne ke liye
exports.disableUser = onCall(async (request) => {
  const { uid } = request.data;
  try {
    await admin.auth().updateUser(uid, { disabled: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
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