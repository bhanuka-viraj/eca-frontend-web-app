# EduCloud Enterprise - Course & Learning Management SaaS Platform

An enterprise-grade, ultra-modern Course & Learning Management SaaS platform built with **React 18**, **Vite**, **Tailwind CSS**, and **Lucide Icons**, integrated with a 3-tier Spring Boot microservices backend deployed on **Google Cloud Platform (GCP)**.

---

## 🏛️ Academic & Cloud Architecture Metadata
- **Lead Developer:** J P Bhanuka Viraj Madhuranga
- **Student ID:** 241711105
- **GCP Project ID:** `enterprise-cloud-module-503705`
- **GCP Region:** `us-central1` (Iowa, USA)
- **Frontend Service (Cloud Run):** `eca-frontend-app`
- **Frontend URL:** [https://eca-frontend-app-535026634701.us-central1.run.app](https://eca-frontend-app-535026634701.us-central1.run.app)
- **API Gateway Service (Cloud Run):** `eca-api-gateway`
- **API Gateway URL:** [https://eca-api-gateway-535026634701.us-central1.run.app](https://eca-api-gateway-535026634701.us-central1.run.app)

---

## ✨ Features & Component Architecture

### 1. 🔍 'Explore Courses'
- **Coursera / Udemy / Linear Aesthetic:** Modern course library with dark slate/indigo theme and glassmorphism.
- **Category Filtering & Search:** Filter by *Cloud, DevOps, Java, AI, Microservices* with live search.
- **Rich Course Cards:** High-res GCS thumbnails, dynamic technology tags (`#GCP`, `#Kubernetes`, `#Docker`), instructor badges, and difficulty ratings.
- **Interactive Syllabus Viewer:** Slideout/modal displaying comprehensive course modules, lesson breakdowns, duration, and 1-click enterprise enrollment.

### 2. 🎬 'Instructor Studio'
- **Course Creation Wizard:** Step-by-step course authoring form mapped to MongoDB Atlas document schemas.
- **Real-Time Live Card Preview:** Live rendering of the student card as instructors draft title, syllabus, and metadata.
- **Cloud Storage Media Hub (GCS):** Drag-and-drop file uploader with live streaming progress bar (0% -> 100%), instant thumbnail preview, and 1-click auto-binding to the course draft.

### 3. 👥 'Member Directory'
- **Cloud SQL IAM User Management:** Relational member directory powered by Google Cloud SQL (MySQL 8.0).
- **RBAC Role Filtering:** Quick filtering by *Students, Instructors, Admins*.
- **Onboard Member Modal:** Form validation for registering new faculty and student profiles.

### 4. ⚡ 'Cloud Infrastructure & Telemetry'
- **Live Gateway Health Checker:** Real-time ping test with exact round-trip response latency (ms) and HTTP status codes.
- **Dynamic Gateway Switching:** Instantly switch between `localhost:8080`, GCP Cloud Run URL, or GCP Load Balancer Static IP.
- **Microservices Topology Map:** Visual mapping of Spring Cloud Gateway (:8080) -> User Service (:8081) -> Course Service (:8082) -> Media Service (:8083).
- **REST Routing Table:** Active reverse proxy route specifications with interactive ping tests.

### 5. 🛡️ 'System Information Popover'
- Discreet, accessible modal containing academic metadata, GCP specs, and Docker Nginx container runtime specs.

---

## 🛠️ Tech Stack
- **Frontend Framework:** React 18 (Hooks, Suspense, Error Boundaries)
- **Bundler / Tooling:** Vite 6
- **Styling:** Tailwind CSS 3 with custom glassmorphism and animations
- **Iconography:** Lucide React
- **HTTP Client:** Axios with dynamic base URL interceptors
- **Web Server:** Nginx Alpine configured for SPA routing (`try_files $uri $uri/ /index.html`) on Port 8080

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

The repository includes an optimized multi-stage `Dockerfile`:
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
