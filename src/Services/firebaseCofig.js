import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDdCPyxUmGfl3FUQmmZIY1LR3uooJkYPj4",
    authDomain: "proyecto--int-web.firebaseapp.com",
    projectId: "proyecto--int-web",
    storageBucket: "proyecto--int-web.appspot.com",
    messagingSenderId: "508494395041",
    appId: "1:508494395041:web:243e156e1365fde615a2e0",
    measurementId: "G-SNK2JCTFFQ"
  };

  const app = initializeApp(firebaseConfig);

  export const auth = getAuth(app);
  export const db = getFirestore(app);
