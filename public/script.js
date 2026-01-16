const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('messageInput');
const recipientInput = document.getElementById('recipientInput');
const sendBtn = document.getElementById('sendBtn');
const imageInput = document.getElementById('imageInput');

// Remember username using localStorage
let username = localStorage.getItem('username');
if (!username) {
username = prompt('Enter your username:');
localStorage.setItem('username', username);
}

// Fetch and display messages for this user
async function fetchMessages() {
const res = await fetch(`/messages/${username}`);
const data = await res.json();
chatContainer.innerHTML = '';
data.forEach(msg => {
const msgDiv = document.createElement('div');
msgDiv.classList.add('message');
msgDiv.classList.add(msg.username === username ? 'self' : 'other');
msgDiv.innerHTML = `<strong>${msg.username}:</strong> ${msg.text || ''}`;
if (msg.image) {
const img = document.createElement('img');
img.src = msg.image;
msgDiv.appendChild(img);
}
chatContainer.appendChild(msgDiv);
});
chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send message with recipient
sendBtn.addEventListener('click', async () => {
const text = messageInput.value;
const recipient = recipientInput.value.trim();
const file = imageInput.files[0];

```
if (!text && !file) return;
if (!recipient) {
    alert('Please enter a recipient username.');
    return;
}

if (file) {
    const reader = new FileReader();
    reader.onload = async function(e) {
        const imageData = e.target.result;
        await sendMessage({ username, recipient, text, image: imageData });
    };
    reader.readAsDataURL(file);
} else {
    await sendMessage({ username, recipient, text });
}

messageInput.value = '';
imageInput.value = '';
```

});

async function sendMessage(msg) {
await fetch('/messages', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(msg)
});
fetchMessages();
}

// Poll messages every 2 seconds
setInterval(fetchMessages, 2000);
fetchMessages();
