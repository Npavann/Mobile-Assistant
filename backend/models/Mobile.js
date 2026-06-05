const mongoose = require('mongoose');

const mobileSchema = new mongoose.Schema({
  model_name: String,
  price: String,
  expert_rating: String,
  user_rating: String,
  processor: String,
  rear_cameras: String,
  front_cameras: String,
  display: String,
  ram_internal_memory: String,
  battery: String,
  operating_system: String,
  additional_features: String,
  review: String,
  review_link: String
});

module.exports = mongoose.model('Mobile', mobileSchema);