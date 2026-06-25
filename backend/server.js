const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env")
});
console.log("API Key:", process.env.OPENROUTER_API_KEY);
console.log(process.cwd());
console.log("API Key:", process.env.OPENROUTER_API_KEY);
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {

    try {

        const userMessage = req.body.message;

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

        console.log(response.data);

        res.json(response.data);

    } catch (error) {

        console.error(
            error.response?.data || error.message
        );

        res.status(500).json({
            choices: [
                {
                    message: {
                        content: "API Error. Check server logs."
                    }
                }
            ]
        });
    }
});

app.listen(3000, () => {
    console.log("🚀 Server Running on Port 3000");
});