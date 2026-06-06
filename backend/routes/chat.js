const express = require('express');
const router = express.Router();
const Mobile = require('../models/Mobile');
const { GoogleGenAI } = require('@google/genai');

router.post('/', async (req, res) => {
try {
const { message, image } = req.body;
if (!message && !image) {
return res.status(400).json({ error: "Message or image is required" });
}
console.log("User message:", message);
const lowerMessage = (message || "").toLowerCase();

// ---------------------------
// 🖼 VISION AI LOGIC
// ---------------------------
if (image) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Invalid image format" });
    }
    
    const mimeType = matches[1];
    const base64Data = matches[2];

    const prompt = `
You are MobileAssist AI, an expert mobile phone analyst based in India.
All prices should be in Indian Rupees (INR ₹).
The user has uploaded an image of a mobile phone. Please analyze it and provide a detailed response.

Analyze the following:
1. Detect mobile brand (if possible)
2. Detect model (if possible)
3. Detect color/design
4. Detect camera setup
5. Detect display type/notch
6. Detect condition/damage if visible
7. Describe phone appearance
8. Give estimated category (budget/midrange/flagship)
9. Give possible specifications if recognizable
10. Give estimated price in Indian Rupees (INR ₹)

User Question:
${message || "Please analyze this phone image."}

Respond naturally in a chat-like format.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { data: base64Data, mimeType: mimeType } }
          ]
        }
      ]
    });

    const reply = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    return res.json({ type: "ai_vision", reply });

  } catch (aiError) {
    console.error("Gemini Vision Error:", aiError);
    return res.json({ type: "ai", reply: "⚠ AI Vision service temporarily unavailable. Please try again later." });
  }
}

// Get all phones from DB
const phones = await Mobile.find();

// ---------------------------
// ⚖ PHONE COMPARISON LOGIC
// ---------------------------
const matchedPhones = phones.filter(phone =>
lowerMessage.includes(phone.model_name.toLowerCase())
);
const uniquePhones = [
...new Map(matchedPhones.map(phone => [phone.model_name, phone])).values()
];
if (uniquePhones.length >= 2) {
const comparisonText = uniquePhones.map(phone => `
 Model: ${phone.model_name}
 Price: ₹${phone.price}
⚙ Processor: ${phone.processor}
 RAM/Storage: ${phone.ram_internal_memory}
 Battery: ${phone.battery}
 Display: ${phone.display}
 Rear Camera: ${phone.rear_cameras}
 Front Camera: ${phone.front_cameras}
 Features: ${phone.additional_features}
`).join("\n----------------------\n");
return res.json({
type: "comparison",
phones: uniquePhones,
reply: `⚖ Phone Comparison\n${comparisonText}`
});
}

// ---------------------------
// SINGLE PHONE SEARCH
// ---------------------------
const phone = phones.find(p =>
lowerMessage.includes(p.model_name.toLowerCase())
);
if (phone) {
const phoneText = `
 Model: ${phone.model_name}
 Price: ₹${phone.price}
⚙ Processor: ${phone.processor}
 RAM / Storage: ${phone.ram_internal_memory}
 Battery: ${phone.battery}
 Display: ${phone.display}
 Rear Camera: ${phone.rear_cameras}
 Front Camera: ${phone.front_cameras}
 Features: ${phone.additional_features}
`;
return res.json({
type: "phone",
phone: phone,
reply: phoneText
});
}

// ---------------------------
// GEMINI AI (Multilingual)
// ---------------------------
try {
const ai = new GoogleGenAI({
apiKey: process.env.GEMINI_API_KEY
});
const prompt = `
You are MobileAssist AI, a smart mobile phone assistant based in India.
Important Rules:
- Always use Indian Rupees (INR ₹) for all prices
- When user says a number like "20000", assume it is ₹20000 INR
- Suggest phones available in India
- Compare phones with Indian market prices
- Detect the user's language and reply in the same language

User Question:
${message}
`;
const response = await ai.models.generateContent({
model: "gemini-1.5-flash-latest",
contents: prompt
});
const reply =
response?.candidates?.[0]?.content?.parts?.[0]?.text ||
"No response generated.";
return res.json({
type: "ai",
reply
});
} catch (aiError) {
console.error("Gemini Error:", aiError);
return res.json({
type: "ai",
reply: "⚠ AI service temporarily unavailable. Please try again later."
});
}
} catch (error) {
console.error("Chat Error:", error);
res.status(500).json({
error: "Server error"
});
}
});

module.exports = router;