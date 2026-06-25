const sendBtn = document.getElementById("send-btn");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

async function sendMessage() {

    const userMessage = input.value.trim();

    if (!userMessage) return;

    chatBox.innerHTML += `
    <div class="user-message">
        ${userMessage}
    </div>
    `;

    input.value = "";

    try {

        chatBox.innerHTML += `
        <div class="ai-message" id="typing">
            AI is typing...
        </div>
        `;

        const response = await fetch("https://ai-chatbot-backend-ae34.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: userMessage
            })
        });

        const data = await response.json();

        console.log("Backend Response:", data);

        document.getElementById("typing")?.remove();

        let aiReply = "No response received.";

        if (data.choices &&
            data.choices[0] &&
            data.choices[0].message) {

            aiReply = data.choices[0].message.content;
        }

        aiReply = aiReply
    .replace(/\*\*/g, "")
    .replace(/###/g, "")
    .replace(/##/g, "")
    .replace(/#/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`/g, "")
    .replace(/\|/g, "")
    .replace(/---+/g, "")
    .replace(/\n{3,}/g, "\n\n");

        chatBox.innerHTML += `
        <div class="ai-message">
            <strong>AI:</strong><br>
            ${aiReply.replace(/\n/g, "<br>")}
        </div>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {

        console.error(error);

        document.getElementById("typing")?.remove();

        chatBox.innerHTML += `
        <div class="ai-message">
            Error connecting to backend.
        </div>
        `;
    }
}