import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8rU85L7E1yodFtHRakrTGZdR96ZLwk0I",
  authDomain: "level-up-ebf38.firebaseapp.com",
  projectId: "level-up-ebf38",
  storageBucket: "level-up-ebf38.firebasestorage.app",
  messagingSenderId: "436960955895",
  appId: "1:436960955895:web:06f32cabde63a87761f2f2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager()
  })
});
