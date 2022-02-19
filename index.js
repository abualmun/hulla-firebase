import express from "express";
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, getDocs
} from "firebase/firestore"
const firebaseConfig = {
    apiKey: "AIzaSyAcUFjuSnz5uyYVwJZJoCCbuNbQEgF_lew",
    authDomain: "hulla-914e9.firebaseapp.com",
    projectId: "hulla-914e9",
    storageBucket: "hulla-914e9.appspot.com",
    messagingSenderId: "130286275406",
    appId: "1:130286275406:web:96d667700c813529ceac1f"
}
initializeApp(firebaseConfig);
const app = express()
const port = process.env.PORT || 5000
app.get('/', (req, res) => {
    getDocs(colRef)
        .then((snapshot) => {
            res.send(snapshot.docs)
        }).catch((err) => {
            res.send(err.message)
        })

})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
const db = getFirestore();

const colRef = collection(db, 'users');

