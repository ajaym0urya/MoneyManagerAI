# AI Budget Coach 🚀

AI Budget Coach is a full-stack, production-ready web application designed to help users manage their finances, visualize their expenses, and receive AI-driven financial advice. 

The application features a modern fintech UI, built with a React frontend (Vite & Tailwind CSS) and an async Python FastAPI backend, integrated natively with Google Cloud (Vertex AI Gemini, Firestore, Cloud Run, Firebase Hosting).

## 🧱 Architecture & Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Recharts
- **Backend**: Python 3.10+, FastAPI, Uvicorn
- **Database**: Google Firebase Firestore
- **AI Integration**: Google Vertex AI (Gemini)
- **Deployment**: Firebase Hosting (Frontend), Google Cloud Run (Backend)

## 📦 Project Setup

### 1. Pre-requisites
- [Node.js](https://nodejs.org/en/) & npm
- [Python 3.10+](https://www.python.org/)
- [Firebase CLI](https://firebase.google.com/docs/cli) (`npm install -g firebase-tools`)
- [Google Cloud CLI (gcloud)](https://cloud.google.com/sdk/docs/install)

### 2. Environment Variables

**Backend (`Backend/.env`)**:
Replace the `.env.example` placeholders with your actual values:
```env
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_PROJECT_ID=your_firebase_project_id
```

**Frontend (`Frontend/.env`)**:
Replace the `.env.example` placeholders with your actual deployed backend URL (or use localhost for testing):
```env
VITE_API_URL=http://localhost:8000
```

### 3. Local Development

**Backend**:
1. `cd Backend`
2. Create virtual environment: `python -m venv venv`
3. Activate:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run server: `uvicorn main:app --reload` (Runs on port 8000)

**Frontend**:
1. `cd Frontend`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev` (Runs on port 5173 default)

---

## 🚀 Deployment Instructions

### 1. Linking your Firebase Project
Open `.firebaserc` in the root folder and change `"default": "your-firebase-project-id"` to your literal Firebase project ID.

### 2. Deploy Frontend to Firebase Hosting
```bash
# Login to Firebase
firebase login

# Deploy
firebase deploy --only hosting
```

### 3. Deploy Backend to Google Cloud Run
Assuming you have billing enabled and the Cloud Run / Vertex AI APIs enabled on your GCP project.

```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project your-google-cloud-project-id

# Deploy via Cloud Build and Cloud Run
gcloud builds submit --config cloudbuild.yaml .
```

---

## 🐙 GitHub Integration

To push this pre-configured repository to your own GitHub account:

```bash
git init
git add .
git commit -m "Initial commit: Production-ready AI Budget Coach scaffolding"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
