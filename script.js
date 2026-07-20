const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');
hamburgerBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('active'));
});
const colorPalette = ["#7289da","#f04747","#43b581","#faa61a","#b749d9","#3498db","#e91e63","#2ecc71","#e67e22","#9b59b6"];
function getColorFromUser(name){
    let sum = 0;
    for(let i=0;i<name.length;i++) sum += name.charCodeAt(i);
    return colorPalette[sum % colorPalette.length];
}
function getChatData(){
    return JSON.parse(localStorage.getItem("mcChat")) || [];
}
function saveChatData(arr){
    localStorage.setItem("mcChat", JSON.stringify(arr));
}
function renderChat(){
    const windowEl = document.getElementById("chatWindow");
    const chatList = getChatData();
    let html = "";
    chatList.forEach(item => {
        const bgColor = getColorFromUser(item.user);
        const initial = item.user.charAt(0).toUpperCase();
        html += `<div class="chat-message"><div class="avatar" style="background:${bgColor}">${initial}</div><div class="msg-text">[${item.time}] ${item.user}: ${item.text}</div></div>`;
    });
    windowEl.innerHTML = html;
    windowEl.scrollTop = windowEl.scrollHeight;
}
renderChat();
const sendBtn = document.getElementById("sendChat");
const input = document.getElementById("chatInput");
sendBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if(text === "") return;
    const currentUser = localStorage.getItem("currentUser") || "Guest Player";
    const chatArr = getChatData();
    chatArr.push({
        time: new Date().toLocaleString(),
        user: currentUser,
        text: text
    });
    saveChatData(chatArr);
    input.value = "";
    renderChat();
});
input.addEventListener('keydown', (e) => {
    if(e.key === "Enter") sendBtn.click();
});
