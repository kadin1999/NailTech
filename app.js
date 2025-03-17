// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAkTlU5o7Ifb7gbc7WQtQhO3EBYKCe-YcQ",
    authDomain: "nailtechbooking-ee9ca.firebaseapp.com",
    projectId: "nailtechbooking-ee9ca",
    storageBucket: "nailtechbooking-ee9ca.appspot.com",
    messagingSenderId: "16044376383",
    appId: "1:16044376383:web:80d924dfc1424273f6d38a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Reference to "appointments" collection
const appointmentsRef = collection(db, "appointments");

// ✅ Handle form submission (only if booking form exists)
document.addEventListener("DOMContentLoaded", function () {
    const bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
        bookingForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const name = document.getElementById("clientName").value;
            const service = document.getElementById("service").value;
            const time = document.getElementById("appointmentTime").value;

            try {
                await addDoc(appointmentsRef, { name, service, time });
                console.log("Appointment added!");
                e.target.reset();
            } catch (error) {
                console.error("Error booking appointment:", error);
            }
        });
    }
});

// ✅ Real-time updates for main page
const appointmentsList = document.getElementById("appointmentsList");
if (appointmentsList) {
    onSnapshot(appointmentsRef, (snapshot) => {
        appointmentsList.innerHTML = ""; 
        snapshot.forEach((doc) => {
            const data = doc.data();
            const li = document.createElement("li");
            li.textContent = `${data.name} - ${data.service} at ${data.time}`;
            appointmentsList.appendChild(li);
        });
    });
}

// ✅ Login function
window.login = function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            console.log("Login successful");
            window.location.href = "appointments.html"; // Redirect to appointments page
        })
        .catch(error => console.error("Login failed:", error.message));
};

// ✅ Logout function
window.logout = function () {
    signOut(auth).then(() => {
        console.log("Logged out");
        window.location.href = "index.html"; // Redirect to login page
    });
};

// ✅ Authentication check (only on `appointments.html`)
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("appointments.html")) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                loadAppointments();
            } else {
                window.location.href = "index.html"; // Redirect if not logged in
            }
        });
    }
});

// ✅ Load booked appointments (for appointments page)
async function loadAppointments() {
    const appointmentList = document.getElementById("appointment-list");
    if (!appointmentList) return;

    const querySnapshot = await getDocs(appointmentsRef);
    appointmentList.innerHTML = ""; 

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const listItem = document.createElement("li");
        listItem.textContent = `${data.name} - ${data.service} at ${data.time}`;
        appointmentList.appendChild(listItem);
    });
}
