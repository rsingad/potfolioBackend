# Ramesh Singad Portfolio - Backend

This is the high-performance Node.js/Express backend that powers the Ramesh Singad Portfolio. It handles data persistence, user authentication, and automated AI-driven tech news aggregation.

## 🚀 Core Functionalities

- **Automated Tech News:** Leverages cron jobs to fetch and transform trending tech news every 6 hours.
- **AI Content Transformation:** (Via Controller) Processes raw news into SEO-friendly insights.
- **User Authentication:** Secure local authentication using Passport.js and session management.
- **Contact Management:** API endpoints for handling professional inquiries.
- **CORS Management:** Securely configured to handle requests from allowed frontend origins (Production & Local).
- **Database Integration:** Seamless connection to MongoDB for persistent storage.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (using Mongoose)
- **Security:** Passport.js (Local Strategy), Express Session
- **Task Scheduling:** Node-cron
- **API Communication:** Axios
- **Environment:** Dotenv

## 📁 Project Structure

```text
potfolioBackend/
├── config/             # Database and Passport configurations
├── controllers/        # Business logic for news and contacts
├── models/             # Mongoose schemas for User, News, and Contacts
├── routes/             # Express API route definitions
├── index.js            # Entry point and server configuration
└── .env                # Environment secrets (Sensitive)
```

## ⚙️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to backend directory:**
   ```bash
   cd potfolioBackend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Environment Configuration:**
   Create a `.env` file with the following keys:
   ```env
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   SESSION_SECRET=<your-secret-key>
   VITE_GROQ_API_KEY=<your-groq-api-key>
   NODE_ENV=development
   ```

5. **Start Server:**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## 📡 API Endpoints

- **News API:**
  - `GET /api/news` - Fetch all trending tech insights.
  - `GET /api/news/:id` - Fetch specific insight details.
- **Auth API:**
  - `POST /auth/login` - User login.
  - `POST /auth/register` - New user registration.
- **Contact API:**
  - `POST /api/contact` - Submit contact form.

## ⏰ Automation

The backend runs a scheduled cron job every 6 hours (`0 */6 * * *`) to keep the "Tech Insights" section updated with the latest industry pulse.

## 📄 License

Personal Use - Ramesh Singad.
