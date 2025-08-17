# 📋 Dynamic Airtable-Connected Form Builder

A modern, full-stack **MERN application** that allows users to securely log in with their Airtable account, create custom forms using fields directly from their Airtable bases, apply conditional logic to questions, and save form responses as new records in Airtable.

🔗 **Live Project Link**: [Add your deployed link here]

---

## 🚀 Features Overview
- **🔐 Secure Airtable OAuth 2.0 Login** – Users can securely log in with their Airtable account. The application handles the complete OAuth flow and securely manages user tokens.  
- **🛠 Dynamic Form Creation** – Users can select any of their Airtable bases and tables to build a form. The application fetches the table schema and allows adding fields as questions.  
- **✏️ Customizable Questions** – Question labels can be renamed for a user-friendly experience.  
- **🔄 Conditional Logic** – Set visibility rules for questions based on previous answers (e.g., *Show "GitHub URL" only if "Role" is "Engineer"*).  
- **📑 Multiple Field Types Supported** – Supports Airtable field types like short text, long text, single select, multi-select, and attachments.  
- **🌍 Live Form Viewer** – Forms are available at a public URL (`/form/:id`), where anyone can view and fill them out. Logic applies in real-time.  
- **⚡ Direct Airtable Integration** – Form responses are instantly sent to the Airtable table as new records.  
- **📊 User Dashboard** – Logged-in users can view, edit, and get share links for all created forms.  

---

## 🗝 Airtable OAuth App Setup Guide
Before running the app, you must create an Airtable OAuth application to get credentials.

1. **Go to Airtable App Creation Page**  
   👉 [Create OAuth App](https://airtable.com/create/oauth)

2. **Fill Application Details**  
   - App name: `MERN Form Builder` (or your own choice)  
   - App homepage URL: `http://localhost:5173` (for local dev)  

3. **Set Redirect URI**  
   Use the following for local development:  http://localhost:5001/auth/airtable/callback

4. **Select Scopes**  
- `data.records:read`  
- `data.records:write`  
- `schema.bases:read`  
- `user.email:read`  

5. **Get Credentials**  
After creating, you’ll receive **Client ID** and **Client Secret** → required in `.env`.

---

## ⚙️ Setup Instructions

### ✅ Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)  
- npm (comes with Node.js)  
- [MongoDB](https://www.mongodb.com/) (Atlas or local instance)  
- Airtable OAuth Client ID & Secret  

---

### 🖥 Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

Create a .env file in backend/ with the following:

MONGO_URI=your_mongodb_connection_string
AIRTABLE_CLIENT_ID=your_airtable_client_id
AIRTABLE_CLIENT_SECRET=your_airtable_client_secret
JWT_SECRET=a_long_random_string_for_jwt
BACKEND_URL=http://localhost:5001
FRONTEND_URL=http://localhost:5173

###Start the backend:

npm start


Backend will run at → http://localhost:5001

###Frontend Setup
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend server
npm run dev

The conditional logic feature makes forms interactive and personalized.

How it works:

Add at least two questions in the Form Builder.

For any non-first question, click "Set Logic".

Choose a source question and define a required value.

In the live form:

The dependent question is hidden by default.

It appears only when the condition is met.

👉 Example: Show "GitHub URL" only if "Role" = "Engineer".

Frontend will run at → http://localhost:5173

###🛠 Tech Stack

Frontend: React + Vite + Tailwind CSS

Backend: Node.js + Express.js

Database: MongoDB (Mongoose ODM)

Auth: Airtable OAuth 2.0

Other Tools: JWT, Axios

