const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

exports.deleteUserAuth = onCall(async (request) => {
  const uid = request.data.uid;
  if (!uid) {
    throw new Error("UID is required");
  }
  
  // Firebase Auth se user ko delete karein
  await admin.auth().deleteUser(uid);
  return { success: true };
});