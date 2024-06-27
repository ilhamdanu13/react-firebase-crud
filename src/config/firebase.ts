import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBb9xCi4SWp188p8jsOhVmJAOcwO13eliQ",
  authDomain: "react-crud-718fc.firebaseapp.com",
  projectId: "react-crud-718fc",
  storageBucket: "react-crud-718fc.appspot.com",
  messagingSenderId: "487851359460",
  appId: "1:487851359460:web:5ee34b2afffce5d122c0f1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, googleProvider, db, storage };
