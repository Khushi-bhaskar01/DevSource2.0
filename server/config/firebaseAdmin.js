import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!firebaseConfig.projectId || !firebaseConfig.privateKey || !firebaseConfig.clientEmail) {
    console.error("❌ CRITICAL: Firebase Admin credentials missing from .env");
}

const serviceAccount = {
    type: "service_account",
    project_id: firebaseConfig.projectId,
    private_key: firebaseConfig.privateKey?.replace(/["']/g, "").replace(/\\n/g, '\n'),
    client_email: firebaseConfig.clientEmail,
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

export default admin;
