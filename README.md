# AI Mobile Assistant

A Full-Stack MERN Application that allows an admin to upload a CSV of mobile specifications and a user to converse with an AI agent powered by Gemini 1.5 Flash via a Retrieval-Augmented Generation (RAG) implementation. 

## Features
- **Admin Panel**: Seamlessly upload a CSV file containing mobile device specifications.
- **AI Chat Agent**: Engage with a smart assistant to find the best phone under a price, compare models, and filter by specifications like RAM, battery, display, and more.
- **RAG Implementation**: Fetches data dynamically from MongoDB and passes it as context to Gemini 1.5.

## Project Structure
- `backend/` - Node.js + Express backend with MongoDB and Google GenAI Integration
- `frontend/` - React frontend with sleek and premium UI for both Chat and Admin interfaces
- `example_mobiles.csv` - Built-in test CSV with modern mobile specifications to test the setup.

## Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally (or have a MongoDB Atlas connection string).

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Open `backend/.env` and replace `your_gemini_api_key_here` with your actual Google Gemini API Key.
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mobile_ai_assistant
   GEMINI_API_KEY=your_actual_key
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```

### 3. Frontend Setup
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

### 4. How to Use
1. **Upload Data**: Go to `http://localhost:5173/admin` (or the URL Vite provides). Click on "Choose CSV File", select `example_mobiles.csv` in the root directory, and upload.
2. **Chat**: Go to `http://localhost:5173/` and test queries like *"Which is the best phone under $800?"* or *"Compare Galaxy S24 Ultra and iPhone 15 Pro Max"*.
