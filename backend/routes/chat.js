const express = require('express');
const router = express.Router();
const Mobile = require('../models/Mobile');
const Groq = require('groq-sdk');

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
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `You are MobileAssist AI, an expert mobile phone analyst based in India.
All prices should be in Indian Rupees (INR ₹).
Analyze this phone image and provide:
1. Mobile brand and model (if visible)
2. Color and design
3. Camera setup
4. Display type
5. Estimated category (budget/midrange/flagship)
6. Estimated price in INR ₹
User Question: ${message || "Please analyze this phone image."}
Respond naturally in a chat-like format.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.2-11b-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: image } }
          ]
        }
      ],
      max_tokens: 1024
    });

    const reply = response.choices[0]?.message?.content || "No response generated.";
    return res.json({ type: "ai_vision", reply });

  } catch (aiError) {
    console.error("Groq Vision Error:", aiError);
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
// GROQ AI (Multilingual)
// ---------------------------
try {
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const response = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "system",
      content: `You are MobileAssist AI, a smart mobile phone assistant based in India.
Important Rules:
- Always use Indian Rupees (INR ₹) for all prices
- When user says a number like "20000", assume it is ₹20000 INR
- Suggest phones available in India
- Compare phones with Indian market prices
- Detect the user's language and reply in the same language`
    },
    {
      role: "user",
      content: message
    }
  ],
  max_tokens: 1024
});

const reply = response.choices[0]?.message?.content || "No response generated.";
return res.json({ type: "ai", reply });

} catch (aiError) {
console.error("Groq Error:", aiError);
return res.json({
type: "ai",
reply: "⚠ AI service temporarily unavailable. Please try again later."
});
}
} catch (error) {
console.error("Chat Error:", error);
res.status(500).json({ error: "Server error" });
}
});

module.exports = router;