import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Firebase Config
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

// Logout Function
function logout() {
    signOut(auth).then(() => {
        window.location.href = "index.html"; // Redirect back to login page
    });
}

// Check if User is Authenticated
onAuthStateChanged(auth, (user) => {
    if (user && user.email === "your-email@example.com") {
        loadAppointments();
    } else {
        window.location.href = "index.html"; // Redirect to login if not authenticated
    }
});

// Load Appointments
async function loadAppointments() {
    const appointmentsRef = collection(db, "appointments");
    const querySnapshot = await getDocs(appointmentsRef);
    const appointmentList = document.getElementById("appointment-list");
    appointmentList.innerHTML = ""; 

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const listItem = document.createElement("li");
        listItem.textContent = `${data.name} - ${data.service} at ${data.time}`;
        appointmentList.appendChild(listItem);
    });
}

// Attach logout function to global scope
window.logout = logout;
