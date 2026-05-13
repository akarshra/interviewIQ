import axios from "axios"

export const askAi = async (messages) => {
    try {
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error("Messages array is empty.");
        }

        const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("Missing AI API key (set OPENROUTER_API_KEY or OPENAI_API_KEY)");
        }

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "google/gemini-2.5-flash-lite",
                messages,
                temperature: 0.7,
                max_tokens: 800,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const content = response?.data?.choices?.[0]?.message?.content;
        if (!content || !content.trim()) {
            throw new Error("AI returned empty response.");
        }

        return content;
    } catch (error) {
        console.error("OpenRouter Error:", error.response?.data || error.message);
        throw new Error("AI service is unavailable right now. Please try again later.");
    }
}