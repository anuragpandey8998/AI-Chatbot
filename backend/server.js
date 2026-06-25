const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables FIRST
dotenv.config({
    path: path.join(__dirname, ".env")
});

// Debug (Do NOT print the full API key)
console.log("=================================");
console.log("API Key exists:", !!process.env.OPENROUTER_API_KEY);
console.log("API Key length:", process.env.OPENROUTER_API_KEY?.length);
console.log("=================================");

const app = express();

// CORS
app.use(cors({
    origin: "https://personal-chat-bot18.netlify.app",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    res.send("✅ Backend Running Successfully");
});

// Chat Route
app.post("/chat", async (req, res) => {

    console.log("POST /chat");
    console.log(req.body);

    try {

        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        console.log("Calling OpenRouter...");

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-oss-20b:free",
                messages: [
                    {
                        role: "user",
                        content: userMessage
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("OpenRouter Success");

        res.json(response.data);

    } catch (error) {

        console.error("========== OpenRouter Error ==========");

        if (error.response) {
            console.error("Status:", error.response.status);
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

        console.error("======================================");

        res.status(500).json({
            choices: [
                {
                    message: {
                        content: "API Error. Check Render Logs."
                    }
                }
            ]
        });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running on Port ${PORT}`);
});