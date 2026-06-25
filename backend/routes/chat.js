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
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Invalid image format" });
    }
    const mimeType = matches[1];
    const base64Data = matches[2];

    const prompt = `You are MobileAssist AI, an expert mobile phone analyst based in India.
All prices should be in Indian Rupees (INR ₹). Always respond in English.
Analyze this phone image and provide:
1. Mobile brand and model (if visible)
2. Color and design
3. Camera setup
4. Display type
5. Estimated category (budget/midrange/flagship)
6. Estimated price in INR ₹
User Question: ${message || "Please analyze this phone image."}
Respond naturally in a chat-like format in English.`;

    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Data}` } }
          ]
        }
      ],
      max_tokens: 800
    });

    const reply = response.choices[0]?.message?.content || "No response generated.";
    return res.json({ type: "ai_vision", reply });

  } catch (aiError) {
    console.error("Groq Vision Error:", aiError);
    return res.json({ type: "ai", reply: "⚠ AI Vision service temporarily unavailable. Please try again later." });
  }
}

// ---------------------------
// Quick check: does message look like a phone name/budget query?
// Only fetch DB if it does — saves time for general AI questions
// ---------------------------
const looksLikePhoneQuery = /\d{4,6}|iphone|samsung|vivo|oppo|realme|redmi|xiaomi|oneplus|motorola|poco|nokia|asus|google pixel|nothing phone/i.test(lowerMessage);

let phones = [];
if (looksLikePhoneQuery) {
  phones = await Mobile.find().lean(); // .lean() = faster, returns plain JS objects
}

// ---------------------------
// ⚖ PHONE COMPARISON LOGIC
// ---------------------------
if (phones.length > 0) {
  const matchedPhones = phones.filter(phone =>
  lowerMessage.includes(phone.model_name.toLowerCase())
  );
  const uniquePhones = [
  ...new Map(matchedPhones.map(phone => [phone.model_name, phone])).values()
  ];
  if (uniquePhones.length >= 2) {
  const comparisonText = uniquePhones.map(phone => `
**${phone.model_name}**
- 💰 Price: ₹${phone.price}
- ⚙️ Processor: ${phone.processor}
- 📦 RAM/Storage: ${phone.ram_internal_memory}
- 🔋 Battery: ${phone.battery}
- 🖥️ Display: ${phone.display}
- 📷 Rear Camera: ${phone.rear_cameras}
- 🤳 Front Camera: ${phone.front_cameras}
- ✨ Features: ${phone.additional_features}
`).join("\n---\n");
  return res.json({
  type: "comparison",
  phones: uniquePhones,
  reply: `## ⚖️ Phone Comparison\n${comparisonText}`
  });
  }

  // ---------------------------
  // SINGLE PHONE SEARCH
  // ---------------------------
  const phone = phones.find(p =>
  lowerMessage.includes(p.model_name.toLowerCase())
  );
  if (phone) {
  const phoneText = `**${phone.model_name}**

- 💰 **Price:** ₹${phone.price}
- ⚙️ **Processor:** ${phone.processor}
- 📦 **RAM/Storage:** ${phone.ram_internal_memory}
- 🔋 **Battery:** ${phone.battery}
- 🖥️ **Display:** ${phone.display}
- 📷 **Rear Camera:** ${phone.rear_cameras}
- 🤳 **Front Camera:** ${phone.front_cameras}
- ✨ **Features:** ${phone.additional_features}`;
  return res.json({
  type: "phone",
  phone: phone,
  reply: phoneText
  });
  }

  // ---------------------------
  // 💰 BUDGET-BASED DATABASE SEARCH
  // ---------------------------
  const budgetMatch = lowerMessage.match(/(\d{4,6})/);
  const isBudgetQuery = /under|below|within|budget|range|best phones?|suggest|recommend/i.test(lowerMessage);

  if (budgetMatch && isBudgetQuery) {
    const budget = parseInt(budgetMatch[1]);
    const minBudget = budget * 0.7;

    const matchingPhones = phones.filter(p => {
      const price = parseInt(String(p.price).replace(/[^\d]/g, ''));
      return price && price <= budget && price >= minBudget;
    }).sort((a, b) => {
      const priceA = parseInt(String(a.price).replace(/[^\d]/g, ''));
      const priceB = parseInt(String(b.price).replace(/[^\d]/g, ''));
      return priceB - priceA;
    }).slice(0, 5);

    if (matchingPhones.length > 0) {
      const listText = matchingPhones.map((p, i) => `
**${i + 1}. ${p.model_name}** — ₹${p.price}
   - ${p.processor} | ${p.ram_internal_memory} | ${p.battery}
`).join("\n");

      return res.json({
        type: "comparison",
        phones: matchingPhones,
        reply: `## 📱 Best Phones Under ₹${budget.toLocaleString('en-IN')}\n${listText}\n\n*Want full specs of any phone? Just ask its name!*`
      });
    }
  }
}

// ---------------------------
// GROQ AI — Fast model (8B instant) for general queries
// ---------------------------
try {
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const response = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    {
      role: "system",
      content: `You are MobileAssist AI, India's fastest mobile phone assistant.

Rules:
- Reply in English by default, unless user writes in Hindi, Kannada, Telugu, or another language
- Never mix languages in one response
- Always use Indian Rupees (INR ₹), never USD
- Suggest only phones officially available in India
- Format with markdown: **bold** phone names, bullet points for specs
- Be concise and direct — give specific model names
- If recommending phones, give at least 3 options briefly
- Never say "I don't have real-time data" — give your best estimate`
    },
    {
      role: "user",
      content: message
    }
  ],
  max_tokens: 700,
  temperature: 0.4
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