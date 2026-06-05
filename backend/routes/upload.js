const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Mobile = require('../models/Mobile');

const upload = multer({ dest: 'uploads/' });

router.post('/csv', upload.single('file'), (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {

      results.push({
        model_name: data.model_name,
        price: data.price,
        expert_rating: data.expert_rating,
        user_rating: data.user_rating,
        processor: data.processor,
        rear_cameras: data.rear_cameras,
        front_cameras: data.front_cameras,
        display: data.display,
        ram_internal_memory: data.ram_internal_memory,
        battery: data.battery,
        operating_system: data.operating_system,
        additional_features: data.additional_features,
        review: data.review,
        review_link: data.review_link
      });

    })
    .on('end', async () => {

      try {

        await Mobile.insertMany(results);

        fs.unlinkSync(filePath);

        res.json({
          message: "CSV uploaded successfully",
          count: results.length
        });

      } catch (error) {

        console.error(error);
        res.status(500).json({ error: "Database insert error" });

      }

    });

});

module.exports = router;