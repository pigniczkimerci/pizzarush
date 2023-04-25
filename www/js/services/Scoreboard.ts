import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { FieldValue, getFirestore, addDoc, setDoc, Firestore, doc, getDoc, DocumentSnapshot, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { firebaseConfig } from "./FirebaseConfig";

const tp = document.getElementById("tppont") ;
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let tppont = sessionStorage.getItem("gameover")
let user = sessionStorage.getItem("user")
if(tppont){
    addDataToFirebase()
}

getDataFromFirebase();

function addDataToFirebase() {
    if(user == undefined){
        user = "Vendég"
    }
    if(tp){
        tp.innerText = tppont!;
    }
    addDoc(collection(db, "users"), {name: user, points: Number(tppont)})
    sessionStorage.removeItem("gameover")
}

async function getDataFromFirebase(){
    const db = getFirestore();
    const colRef = collection(db, "users");
    const docsSnap = await getDocs(query(colRef, orderBy("points","desc"), limit(10)));
    docsSnap.forEach(doc => {
        let data = doc.data();
        let row  = `<tr> <td>${data.name}</td><td>${data.points}</td> </tr>`;
        let table = document.getElementById('table')
        table!.innerHTML += row
    })
}