import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDZ82tUkLuhePSYumKPvUBzwyhEZs5pmWo",
    authDomain: "web-pd-53794.firebaseapp.com",
    projectId: "web-pd-53794",
    storageBucket: "web-pd-53794.appspot.com", // Đã sửa lại đúng storageBucket
    messagingSenderId: "257033724013",
    appId: "1:257033724013:web:5cb18e82bf8046fb9d9f64",
    measurementId: "G-FFK26FBVNQ"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
