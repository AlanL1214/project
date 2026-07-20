const firebaseConfig = {
  apiKey: "AIzaSyCkznF4oeEhgxMNxUmOMBCfzBnKYtidpvg",
  authDomain: "minecrafthubchat.firebaseapp.com",
  projectId: "minecrafthubchat",
  storageBucket: "minecrafthubchat.firebasestorage.app",
  messagingSenderId: "541407077005",
  appId: "1:541407077005:web:ba110135f89b83f5c3b8c4",
  measurementId: "G-BJ378DDSNH"
};
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const globalChatRef = ref(db, "globalChat");

async function loadLocalJsonFile(filePath) {
    const res = await fetch(filePath);
    return await res.json();
}
function saveLocalStorageData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
function readLocalStorageData(key) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
}
async function getDefaultBaseUsers() {
    return await loadLocalJsonFile("users.json");
}
function getAllLocalUsers() {
    const stored = readLocalStorageData("users.json");
    if (!stored) return null;
    return stored;
}
function setAllLocalUsers(userArray) {
    saveLocalStorageData("users.json", userArray);
}
function getSavedContactMessages() {
    return readLocalStorageData("contactMessages") || [];
}
function setSavedContactMessages(msgArray) {
    saveLocalStorageData("contactMessages", msgArray);
}
function toggleMobileNav() {
    const navMenu = document.getElementById("navMenu");
    navMenu.classList.toggle("active");
}
function closeNavOnLinkClick() {
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            document.getElementById("navMenu").classList.remove("active");
        });
    });
}
const avatarColorPool = ["#7289da","#f04747","#43b581","#faa61a","#b749d9","#3498db","#e91e63","#2ecc71","#e67e22","#9b59b6"];
function getUniqueUserColor(username) {
    let charSum = 0;
    for (let i = 0; i < username.length; i++) charSum += username.charCodeAt(i);
    return avatarColorPool[charSum % avatarColorPool.length];
}
function formatFirebaseTime(timestamp) {
    if (!timestamp) return new Date().toLocaleString();
    return new Date(timestamp).toLocaleString();
}
function renderGlobalChat(messageList) {
    const chatWindow = document.getElementById("chatWindow");
    if (!chatWindow) return;
    let chatHtml = "";
    messageList.forEach(msg => {
        const userColor = getUniqueUserColor(msg.user);
        const userInitial = msg.user.charAt(0).toUpperCase();
        chatHtml += `<div class="chat-message"><div class="avatar" style="background:${userColor}">${userInitial}</div><div class="msg-text">[${formatFirebaseTime(msg.time)}] ${msg.user}: ${msg.text}</div></div>`;
    });
    chatWindow.innerHTML = chatHtml;
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
async function initChatPage() {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    hamburgerBtn.addEventListener("click", toggleMobileNav);
    closeNavOnLinkClick();
    onValue(globalChatRef, (snapshot) => {
        const rawData = snapshot.val() || {};
        const liveChatMessages = Object.values(rawData);
        renderGlobalChat(liveChatMessages);
    });
    const sendBtn = document.getElementById("sendChat");
    const chatInput = document.getElementById("chatInput");
    sendBtn.addEventListener("click", () => {
        const textContent = chatInput.value.trim();
        if (textContent === "") return;
        const activeUser = localStorage.getItem("activeUser") || "Guest Player";
        push(globalChatRef, {
            user: activeUser,
            text: textContent,
            time: serverTimestamp()
        });
        chatInput.value = "";
    });
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendBtn.click();
    });
}
async function initAdminPage() {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    hamburgerBtn.addEventListener("click", toggleMobileNav);
    closeNavOnLinkClick();
    let localUserDB = getAllLocalUsers();
    if (!localUserDB) {
        const defaultUsers = await getDefaultBaseUsers();
        setAllLocalUsers(defaultUsers);
    }
    const loginForm = document.getElementById("loginForm");
    const loginErrorText = document.getElementById("loginErr");
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        loginErrorText.textContent = "";
        const inputUser = document.getElementById("loginUser").value.trim();
        const inputPass = document.getElementById("loginPass").value.trim();
        const userList = getAllLocalUsers();
        const matchedAccount = userList.find(account => account.username === inputUser && account.password === inputPass);
        if (matchedAccount) {
            localStorage.setItem("activeUser", inputUser);
            alert("Login complete, your name will appear in global shared chat");
        } else {
            loginErrorText.textContent = "Wrong username or password";
        }
    });
    const registerForm = document.getElementById("regForm");
    const regError = document.getElementById("regErr");
    const regSuccess = document.getElementById("regSuccess");
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        regError.textContent = "";
        regSuccess.textContent = "";
        const newUser = document.getElementById("regUser").value.trim();
        const pass1 = document.getElementById("regPass").value.trim();
        const pass2 = document.getElementById("regPass2").value.trim();
        const userDB = getAllLocalUsers();
        if (newUser === "" || pass1 === "") {
            regError.textContent = "Username and password cannot be blank";
            return;
        }
        if (pass1 !== pass2) {
            regError.textContent = "Passwords do not match";
            return;
        }
        if (userDB.find(u => u.username === newUser)) {
            regError.textContent = "This username already exists";
            return;
        }
        userDB.push({username: newUser, password: pass1});
        setAllLocalUsers(userDB);
        regSuccess.textContent = "Account registered successfully";
        registerForm.reset();
    });
    const changePassForm = document.getElementById("passForm");
    const passError = document.getElementById("passErr");
    const passSuccess = document.getElementById("passSuccess");
    changePassForm.addEventListener("submit", (e) => {
        e.preventDefault();
        passError.textContent = "";
        passSuccess.textContent = "";
        const currUser = document.getElementById("currUser").value.trim();
        const currPass = document.getElementById("currPass").value.trim();
        const newPass = document.getElementById("newPass").value.trim();
        const userDB = getAllLocalUsers();
        const targetAccount = userDB.find(u => u.username === currUser && u.password === currPass);
        if (!targetAccount) {
            passError.textContent = "Invalid username or password";
            return;
        }
        targetAccount.password = newPass;
        setAllLocalUsers(userDB);
        passSuccess.textContent = "Password updated";
        changePassForm.reset();
    });
    function renderRegisteredUsers() {
        const userListBox = document.getElementById("userList");
        const userDB = getAllLocalUsers();
        let html = "";
        if(userDB.length === 0) html = "<p>No accounts registered</p>";
        userDB.forEach(u => html += `<p>Username: ${u.username}</p>`);
        userListBox.innerHTML = html;
    }
    function renderMessages() {
        const msgList = document.getElementById("messageList");
        const messages = getSavedContactMessages();
        let html = "";
        if(messages.length === 0) html = "<p>No submissions</p>";
        messages.forEach(m => html += `<div class="msg-item">Time: ${m.time}\nName: ${m.name}\nEmail: ${m.email}\nMessage: ${m.text}</div>`);
        msgList.innerHTML = html;
    }
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("show"));
            btn.classList.add("active");
            const tabId = btn.dataset.tab;
            document.getElementById(tabId).classList.add("show");
            if(tabId === "messageTab") renderMessages();
            if(tabId === "accountTab") renderRegisteredUsers();
        });
    });
    document.getElementById("clearMsgBtn").addEventListener("click", () => {
        if(confirm("Delete all messages?")) {
            setSavedContactMessages([]);
            renderMessages();
        }
    });
}
function initBaseNav() {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    hamburgerBtn.addEventListener("click", toggleMobileNav);
    closeNavOnLinkClick();
}
