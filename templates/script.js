
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;


recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById('message').value = transcript;
    sendMessage();  
};

recognition.onerror = function(event) {
    console.error("Speech recognition error:", event.error);
};


function startVoiceRecognition() {
    recognition.start();
}


async function sendMessage() {
    const userInput = document.getElementById('message').value.trim();
    if (!userInput) return; 

    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<div class="message user">User: ${userInput}</div>`;

    
    const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
    });
    const data = await response.json();

   
    messagesDiv.innerHTML += `<div class="message bot">Bot: ${data.response}</div>`;
    document.getElementById('message').value = '';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    
    speakResponse(data.response);
}


function speakResponse(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
}


function checkEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}