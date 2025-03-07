// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDii3nNu4Y2-I3X3xTmN-vhyFPCQCwMIVA",
  authDomain: "fir-57f56.firebaseapp.com",
  projectId: "fir-57f56",
  storageBucket: "fir-57f56.firebasestorage.app",
  messagingSenderId: "346339667165",
  appId: "1:346339667165:web:eb9ae21f6aa5baddcd7f34",
  measurementId: "G-YRB4HQQD1F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
export default auth;
