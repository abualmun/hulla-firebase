import { async } from "@firebase/util";
import express, { json } from "express";
import cors from "cors";
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
app.use(cors(
    { origin: "*" }
))
const port = process.env.PORT || 5000

// Databases
const db = getFirestore();
const teachersRef = collection(db, 'teachers');
const studentsRef = collection(db, 'students');
const recordsRef = collection(db, 'records');

//called when try to register
app.post('/abualmun/register/students', cors(), function (req, res) {
    try {
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
    } catch (err) {
        res.statusCode(400).send(err)
    }
})

//called when try to register
app.post('/abualmun/register/teachers', cors(), function async(req, res) {
    try {
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
    } catch (err) {
        res.statusCode(400).send(err)
    }
})


//called when user tries to login.
app.post('/login/students', cors(), async (req, res) => {
    try {
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
    } catch (err) {
        res.statusCode(400).send(err)
    }
})


//called when user tries to login.
app.post('/login/teachers', async (req, res) => {
    try {
        const username = req.body.username
        const q = query(teachersRef, where("username", "==", username))
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {

            const q = query(studentsRef, (querySnapshot.docs[0].data().isAdmin) ? where('teacher', "!=", "Bob") : where("teacher", "==", username))
            const queryStudents = await getDocs(q);
            var studentsList = []
            queryStudents.docs.forEach((d) => { studentsList.push(d.data()) })
            res.send({ ...querySnapshot.docs[0].data(), "studentsList": studentsList });
            console.log("success")
        } else {
            res.send("can't find a teacher with this username.")
            console.log("bruh..")
        }
    } catch (err) {
        res.statusCode(400).send(err)
    }
})




//called when requesting records
app.post('/records', cors(), async (req, res) => {
    try {
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
    } catch (err) {
        res.status(400).send(err)
    }
})

//called when adding a new record
app.post('/records/add', cors(), async (req, res) => {
    try {
        const data = req.body

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
app.post('/records/delete', cors(), async (req, res) => {

    try {
        const data = req.body
        const docRef = doc(db, "records", data.id)
        await deleteDoc(docRef)
        console.log("success")
        res.send("success")
    } catch (err) {
        res.status(400).send(err)
        console.log(err)
    }
})

//called when editing record
app.post('/records/edit', cors(), async (req, res) => {

    try {
        const data = req.body
        const docRef = doc(db, "records", data.id)
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


