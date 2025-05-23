import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {

    apiKey: "AIzaSyArItvfNyGHezLSzLHe9SMdDoRayBTICQk",
  
    authDomain: "testdeliverysystem-fbi69.firebaseapp.com",
  
    databaseURL: "https://testdeliverysystem-fbi69-default-rtdb.europe-west1.firebasedatabase.app",
  
    projectId: "testdeliverysystem-fbi69",
  
    storageBucket: "testdeliverysystem-fbi69.firebasestorage.app",
  
    messagingSenderId: "779236076367",
  
    appId: "1:779236076367:web:2ee3ab1070a6aabef2b33a"
  
  };
  

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);