// 
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzMryDz3RtYMAv6GpxDzOBTVWTpJpY358",
  authDomain: "teachfeedanalyzer.firebaseapp.com",
  projectId: "teachfeedanalyzer",
  storageBucket: "teachfeedanalyzer.appspot.com",
  messagingSenderId: "815115897094",
  appId: "1:815115897094:web:773d2fd81a27871a67b687",
  measurementId: "G-Z8EC4L6RLP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn("Offline persistence can only be enabled in one tab at a time.");
  } else if (err.code === 'unimplemented') {
    console.warn("The current browser does not support offline persistence.");
  }
});

export { auth, db };