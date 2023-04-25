import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { FieldValue, getFirestore, addDoc, setDoc, Firestore, doc, getDoc, DocumentSnapshot, collection } from "firebase/firestore";
import { firebaseConfig } from "./FirebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const button = document.getElementById("registerbtn") as HTMLInputElement;
const button2 = document.getElementById("signupbtn") as HTMLInputElement;
const error_s = document.getElementById("password_s") as HTMLInputElement;
const error_rp = document.getElementById("password") as HTMLInputElement;
const error_re = document.getElementById("email") as HTMLInputElement;

//regisztráció gomb
button?.addEventListener("click", () => {
    register();
})
//bejelentkezés gomb
button2?.addEventListener("click", () => {
    signup();
})

function register() {
    var email = document.getElementById("email") as HTMLInputElement;
    const email_value = email?.value;
    var password = document.getElementById("password") as HTMLInputElement;
    const password_value = password?.value;

    createUserWithEmailAndPassword(auth, email_value, password_value)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("sikeres regisztráció")
            window.location.replace("../game.html");
        })
        .catch((error) => {
            switch (error.code) {
                case "auth/email-already-exists":
                    {
                        error_re.setCustomValidity("E-mail cím már foglalt!");
                        error_re.reportValidity();
                        break;
                    }
                case "auth/invalid-password":
                    {
                        error_rp.setCustomValidity("Nem megfelelő jelszó: legalább 6 karakter.");
                        error_rp.reportValidity();
                        break;
                    }
                default:
                    {
                        error_rp.setCustomValidity("Email cím már foglalt, vagy nem megfelelő jelszó!");
                        error_rp.reportValidity();
                        break;
                    }
            }
        });
}

function signup() {
    var email_s = document.getElementById("email_s") as HTMLInputElement;
    const email_svalue = email_s?.value;
    var password_s = document.getElementById("password_s") as HTMLInputElement;
    const password_svalue = password_s?.value;
    signInWithEmailAndPassword(auth, email_svalue, password_svalue)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            sessionStorage.setItem("user", user.email!)
            window.location.replace("../game.html");
        })
        .catch((error) => {
            switch (error.code) {
                case "auth/invalid-email":
                case "auth/wrong-password":
                case "auth/user-not-found":
                    {
                        error_s.setCustomValidity("Nem megfelelő jelszó/felhasználónév");
                        error_s.reportValidity();
                        break;
                    }
                default:
                    {
                        error_s.setCustomValidity("Váratlan hiba törlént!");
                        error_s.reportValidity();
                        break;
                    }
            }
        });
}

