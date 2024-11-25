import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin with service account
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export const sendNotification = async ({ token, title, body }) => {
  try {
    if (!token) {
      console.log('No FCM token available for user');
      return;
    }

    const message = {
      notification: {
        title,
        body,
      },
      token,
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent notification:', response);
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

export const sendOrderDeliveredNotification = async (user, orderId) => {
  if (!user.fcmToken) return;

  return sendNotification({
    token: user.fcmToken,
    title: 'Order Delivered',
    body: `Your order #${orderId} has been delivered!`,
  });
};
