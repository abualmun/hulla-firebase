import { async } from "@firebase/util";
import express, { json } from "express";
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, getDocs,
    addDoc, deleteDoc, updateDoc,
    query, where, doc, orderBy,
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
app.use(express.json())
const port = process.env.PORT || 5000

// Databases
const db = getFirestore();
const teachersRef = collection(db, 'teachers');
const studentsRef = collection(db, 'students');
const recordsRef = collection(db, 'records');

//called when try to register
app.post('/abualmun/register/students', function (req, res) {
    const data = req.body
    addDoc(studentsRef, {
        username: data.username,
        name: data.name,
        teacher: data.teacher,
    }).then(() => {
        res.send("success")
    }).catch(() => {
        res.send("somthing went wrong")
    })

})

//called when try to register
app.post('/abualmun/register/teachers', function async(req, res) {

    const data = req.body
    addDoc(teachersRef, {
        username: data.username,
        name: data.name,
        isAdmin: data.isAdmin,
    }).then(() => {
        res.send("success")
    }).catch(() => {
        res.send("somthing went wrong")
    })

})


//called when user tries to login.
app.post('/login/students', async (req, res) => {
    const username = req.body.username
    const q = query(studentsRef, where("username", "==", username))
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
            res.send(doc.data())
        })
        console.log("success")
    } else {
        res.send("ERROR")
        console.log("bruh..")
    }
})


//called when user tries to login.
app.post('/login/teachers', async (req, res) => {
    const username = req.body.username
    const q = query(teachersRef, where("username", "==", username))
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const q = query(studentsRef, where("teacher", "==", username))
        const queryStudents = await getDocs(q);
        studentsList = []
        queryStudents.docs.forEach((d)=>{studentsList.push(d)})
        res.send({...querySnapshot.docs[0].data(),"studentsList":studentsList});
        console.log("success")
    } else {
        res.send("can't find a teacher with this username.")
        console.log("bruh..")
    }
})




//called when requesting records
app.post('/records', async (req, res) => {

    const data = req.body
    const returnedQuery = []
    const q = query(recordsRef, where("username", "==", data.username), where("date", ">=", data.start), where("date", "<=", data.end), orderBy("date", "desc"))
    const querySnapshot = await getDocs(q);
    try {
        querySnapshot.docs.forEach((doc) => {
            returnedQuery.push({ id: doc.id, ...doc.data() })
        })
        console.log("success")
        return res.send(returnedQuery)
    } catch {

        return res.send("something went wrong")
    }
})

//called when adding a new record
app.post('/records/add', async (req, res) => {
    const data = req.body
    try {
        const doc = await addDoc(recordsRef, {
            username: data.username,
            start: data.start,
            end: data.end,
            grade: data.grade,
            sura: data.sura,
            date: data.date
        })
        console.log("success")
        res.send(doc.id)
    } catch {
        res.status(400).send("something went wrong")
    }
})


//called when deleting record
app.post('/records/delete', async (req, res) => {
    const data = req.body
    const docRef = doc(db, "records", data.id)
    try {
        await deleteDoc(docRef)
        console.log("success")
        res.send("success")
    } catch (err) {
        res.status(400).send(err)
        console.log(err)
    }
})

//called when editing record
app.post('/records/edit', async (req, res) => {
    const data = req.body
    const docRef = doc(db, "records", data.id)
    try {
        await updateDoc(docRef, {

            username: data.username,
            start: data.start,
            end: data.end,
            grade: data.grade,
            sura: data.sura,
            date: data.date

        })
        res.send("success")
        console.log("success")

    } catch (err) {
        console.log(err)

        res.status(400).send(err)
    }


})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))


