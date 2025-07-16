// // Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
// // import { getAnalytics } from 'firebase/analytics';
// import { getAuth } from 'firebase/auth';
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);






// ################################################################################################################





import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBEU6pw22r_OUTEdjhfj1G8uISIuGE0VEA",
  authDomain: "sheetsway-23ef6.firebaseapp.com",
  projectId: "sheetsway-23ef6",
  storageBucket: "sheetsway-23ef6.firebasestorage.app",
  messagingSenderId: "167397766634",
  appId: "1:167397766634:web:c03889ecfff951c9e1ae93",
  measurementId: "G-41WDB478CP"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
