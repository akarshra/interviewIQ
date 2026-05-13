# 🚀 InterviewIQ

InterviewIQ is an AI-powered mock interview platform that helps users practice technical interviews and receive intelligent feedback.

It simulates real interview scenarios using AI and provides structured responses to improve preparation.

---

## 🌟 Features

- 🔐 User Authentication (JWT-based login/signup)
- 🤖 AI-generated interview questions
- 📄 Resume parsing and context extraction for personalized questions
- 🧠 AI-powered feedback system
- 📊 Organized interview sessions
- 🌐 Full-stack MERN architecture
- 🔒 Secure backend with protected routes

---

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- OpenRouter (LLM API)
- Stripe (Payments)
- PDF Parsing (pdf-parse)

---

## 📂 Project Structure

```
interviewIQ/
│
├── client/     # Frontend (React)
├── server/     # Backend (Node + Express)
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/akarshra/interviewIQ.git
cd interviewIQ
```

---

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside the **server** folder and add:

```
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CORS_ORIGIN=http://localhost:5173
PORT=6000
```

Run backend:

```bash
npm start
```

---

### 3️⃣ Setup Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

---

## 🌍 Deployment

- Backend deployed on **Render**
- Frontend deployed on **Vercel**

(Add your live links here once deployed)

---

## 🔐 Environment Variables

The project requires the following environment variables:

- `MONGODB_URL` (or `MONGO_URI`)
- `JWT_SECRET`
- `OPENROUTER_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CORS_ORIGIN`
- `PORT`

Frontend env:

- `VITE_API_URL`
- `VITE_FIREBASE_APIKEY`

⚠️ Do NOT commit `.env` file to GitHub.

---

## 📌 Future Improvements

- Voice-based mock interviews
- Performance analytics dashboard
- Admin panel
- Interview history tracking

---

## 👨‍💻 Author

**Akarsh Raj**

GitHub: https://github.com/akarshra

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
