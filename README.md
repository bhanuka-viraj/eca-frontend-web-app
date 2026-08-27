# EduSphere LMS - Enterprise Learning & Skills Platform

A modern, 100% business-centric, pure light-themed Course & Learning Management System (LMS) platform inspired by the clean aesthetics of Coursera, Udemy, and Skillshare. Built with **React 18**, **Vite**, **Tailwind CSS**, and **Lucide Icons**, deployed on **Google Cloud Platform (GCP)** via Docker & Google Cloud Run.

---

## 🌟 Core Business Features

### 1. 🎓 Explore Courses
- **Curated Course Library:** Discover professional courses across *Software Engineering, Cloud Computing, Data Science, Design, and Business*.
- **Rich Course Cards:** Thumbnail previews, difficulty ratings (Beginner, Intermediate, Advanced), student counts, star ratings (e.g. ⭐ 4.9), and estimated durations.
- **Interactive Syllabus Modal:** In-depth module breakdowns, lesson timelines, and 1-click course enrollment.

### 2. 📖 My Learning
- **Student Dashboard:** Track your enrolled courses and view progress percentages in real-time.
- **Interactive Course Player:** Lecture player interface with interactive lesson checklists that dynamically advance course completion.
- **Certification:** Official certificate of completion unlocks upon reaching 100% progress.

### 3. 👨‍🏫 Instructor Studio
- **Course Authoring Wizard:** Clean publishing form for Course Title, Category, Difficulty, Tags, Duration, and Detailed Description.
- **Media Upload Dropzone:** Drag-and-drop cover image upload with live streaming progress bar that seamlessly attaches the image to the course.
- **Live Student Preview:** Real-time preview card showing how your course will appear to students.

### 4. 👥 Faculty & Students Directory
- **Academy Member Management:** Clean directory for managing students, faculty instructors, and administrators.
- **Role Filters & Metrics:** Instant breakdown of total academy members, active students, and verified faculty.
- **Onboard Member Modal:** Form for registering new students and faculty members.

### 5. ⚙️ Discreet API Connection Settings
- **Real-Time Health Probe:** Discreet connection status badge in the navbar and footer with live latency (ms).
- **Dynamic Endpoint Switching:** Configure and switch between local development server and cloud production endpoints.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite 6, Tailwind CSS 3, Lucide React Icons
- **HTTP Client:** Axios with dynamic base URL configuration and health probing
- **Containerization:** Multi-stage Dockerfile (Node 20 Alpine builder -> Nginx Alpine server on Port 8080)
- **Deployment:** Google Cloud Run (Serverless Container Platform)

---

## 💻 Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle (verified 0 errors)
npm run build

# 4. Preview production build
npm run preview
```

---

## 🐳 Docker Multi-Stage Build & Cloud Run

The repository includes a production-optimized multi-stage `Dockerfile`:

```dockerfile
# Stage 1: Build static assets with Node 20
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2: Serve with Nginx Alpine on Port 8080
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

### Deploy to Google Cloud Run
```bash
# Build container with Google Cloud Build
gcloud builds submit --tag gcr.io/enterprise-cloud-module-503705/frontend-app

# Deploy to Cloud Run Serverless
gcloud run deploy eca-frontend-app \
  --image gcr.io/enterprise-cloud-module-503705/frontend-app \
  --platform managed \
  --region us-central1 \
  --port 8080 \
  --allow-unauthenticated
```
