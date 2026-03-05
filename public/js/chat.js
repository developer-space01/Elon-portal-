const socket = io();

// Get or create username
let username = localStorage.getItem('username');
if (!username) {
    username = 'fan_' + Math.floor(Math.random() * 10000);
    localStorage.setItem('username', username);
}

socket.emit('register', username);

// Load chat history
fetch(`/api/history/${username}`)
    .then(res => res.json())
    .then(messages => {
        messages.forEach(msg => {
            displayMessage(msg.message, msg.is_from_user);
        });
    });

// Listen for admin messages
socket.on('admin message', (data) => {
    displayMessage(data.message, false);
    // Optionally speak
    if (document.getElementById('voiceBtn').classList.contains('active')) {
        speak(data.message);
    }
});

// DOM elements
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const chatToggle = document.getElementById('chatToggle');
const chatWidget = document.getElementById('chatWidget');
const closeBtn = document.querySelector('#chatControls .close');
const minimizeBtn = document.querySelector('#chatControls .minimize');

// Send message
sendBtn.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (text) {
        socket.emit('chat message', { username, message: text });
        displayMessage(text, true);
        chatInput.value = '';
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

// Toggle chat
chatToggle.addEventListener('click', () => {
    chatWidget.classList.toggle('chat-closed');
});

closeBtn.addEventListener('click', () => {
    chatWidget.classList.add('chat-closed');
});

minimizeBtn.addEventListener('click', () => {
    // Simple minimize: reduce height
    if (chatWidget.style.height === '40px') {
        chatWidget.style.height = '400px';
    } else {
        chatWidget.style.height = '40px';
    }
});

// Voice output
let speakingEnabled = false;
voiceBtn.addEventListener('click', () => {
    speakingEnabled = !speakingEnabled;
    voiceBtn.style.backgroundColor = speakingEnabled ? 'green' : '';
});

function speak(text) {
    if (!speakingEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to select a male voice (approximation of Elon)
    const voices = speechSynthesis.getVoices();
    const maleVoice = voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('Daniel'));
    if (maleVoice) utterance.voice = maleVoice;
    speechSynthesis.speak(utterance);
}

// Drag functionality (simple)
let offsetX, offsetY, isDragging = false;
chatWidget.addEventListener('mousedown', (e) => {
    if (e.target.closest('#chatHeader')) {
        isDragging = true;
        offsetX = e.clientX - chatWidget.offsetLeft;
        offsetY = e.clientY - chatWidget.offsetTop;
    }
});
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        chatWidget.style.left = (e.clientX - offsetX) + 'px';
        chatWidget.style.top = (e.clientY - offsetY) + 'px';
        chatWidget.style.bottom = 'auto';
        chatWidget.style.right = 'auto';
    }
});
document.addEventListener('mouseup', () => {
    isDragging = false;
});

function displayMessage(text, isUser) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', isUser ? 'user-message' : 'admin-message');
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
