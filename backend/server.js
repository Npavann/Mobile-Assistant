require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');
const chatRoutes = require('./routes/chat');
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
console.log("MongoDB Connected");
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
})
.catch(err => console.log(err));