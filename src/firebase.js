import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCGSfpPcf2CXicGSV-Rhrh565xZKq05sA",
  authDomain: "test-scopious.firebaseapp.com",
  projectId: "test-scopious",
  storageBucket: "test-scopious.firebasestorage.app",
  messagingSenderId: "356950590687",
  appId: "1:356950590687:web:82ebc8c776ff557d5c956a",
  measurementId: "G-D4QDN1LQJE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
