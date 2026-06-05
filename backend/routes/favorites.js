const express = require("express");
const router = express.Router();

let favorites = []; // temporary storage

// Add favorite
router.post("/add", (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone required" });
  }

  favorites.push(phone);

  res.json({
    message: "Phone added to favorites",
    favorites
  });
});

// Get favorites
router.get("/", (req, res) => {
  res.json({ favorites });
});

module.exports = router;