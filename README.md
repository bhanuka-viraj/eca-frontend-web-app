# EduSphere LMS - Enterprise Learning & Skills Platform

## 👨‍🎓 Student & Project Information
- **Student Name:** J P Bhanuka Viraj Madhuranga
- **Student ID:** 241711105
- **GitHub Username:** bhanuka-viraj
- **GCP Project ID:** enterprise-cloud-module-503705
- **GCP Region:** `us-central1` (Multi-zone: `us-central1-a`, `us-central1-b`)

---

## 🌐 Live Production Endpoints

| Component | Infrastructure Layer | Live Public URL | Protocol / Health |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | Cloud Load Balancer $\to$ Serverless NEG | [http://34.111.29.195](http://34.111.29.195) | HTTP 200 OK |
| **Frontend Origin** | Google Cloud Run Container | [https://eca-frontend-web-app-535026634701.us-central1.run.app](https://eca-frontend-web-app-535026634701.us-central1.run.app) | HTTP 200 OK |
| **API Gateway** | Global Load Balancer (Port 80 $\to$ 8080) | [http://34.160.86.95/api/v1/courses](http://34.160.86.95/api/v1/courses) | HTTP 200 OK |
| **Config Server** | Global Load Balancer (Port 80 $\to$ 8888) | [http://34.160.42.139/actuator/health](http://34.160.42.139/actuator/health) | HTTP 200 OK |
| **Eureka Registry** | Platform VM Instance Direct | [http://34.44.99.62:8761](http://34.44.99.62:8761) | HTTP 200 OK |

---

## 🌟 Core Business Features

### 1. 🎓 Explore Courses
- **Curated Course Library:** Discover professional courses across *Software Engineering, Cloud Computing, Data Science, Design, and Business*.
- **Rich Course Cards:** Thumbnail previews from Google Cloud Storage, difficulty ratings (Beginner, Intermediate, Advanced), student counts, star ratings (⭐ 4.9), and estimated durations.
- **Interactive Syllabus Modal:** In-depth module breakdowns, lesson timelines, and 1-click course enrollment.

### 2. 📖 My Learning
- **Student Dashboard:** Track enrolled courses and view progress percentages in real-time.
- **Interactive Course Player:** Lecture player interface with interactive lesson checklists that dynamically advance course completion.
- **Certification:** Official certificate of completion unlocks upon reaching 100% progress.

### 3. 👨‍🏫 Instructor Studio
- **Course Authoring Wizard:** Clean publishing form for Course Title, Category, Difficulty, Tags, Duration, and Detailed Description.
- **Media Upload Dropzone:** Drag-and-drop cover image upload with live streaming progress bar that seamlessly uploads to Google Cloud Storage via Media Service.
- **Live Student Preview:** Real-time preview card showing how your course will appear to students.

### 4. 👥 Faculty & Students Directory
- **Academy Member Management:** Clean directory for managing students, faculty instructors, and administrators backed by GCP Cloud SQL MySQL.
- **Role Filters & Metrics:** Instant breakdown of total academy members, active students, and verified faculty.
- **Onboard Member Modal:** Form for registering new students and faculty members.

### 5. ⚙️ Same-Origin Reverse Proxy & Zero-CORS Architecture
- **Nginx Reverse Proxy:** Built-in reverse proxy routing `/api/` directly to the Global API Gateway Load Balancer (`http://34.160.86.95/api/`).
- **Real-Time Health Probe:** Discreet connection status badge in the navbar and footer with live latency (ms).

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite 6, Tailwind CSS 3, Lucide React Icons
- **HTTP Client:** Axios with dynamic base URL configuration and health probing
- **Containerization:** Multi-stage Dockerfile (Node 20 Alpine builder -> Nginx Alpine server on Port 8080)
- **Deployment:** Google Cloud Run (Serverless Container Platform)
- **Load Balancing:** Google Cloud External Application Load Balancer with Serverless Network Endpoint Group (NEG)

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
gcloud run deploy eca-frontend-web-app \
  --image gcr.io/enterprise-cloud-module-503705/frontend-app \
  --platform managed \
  --region us-central1 \
  --port 8080 \
  --allow-unauthenticated
```
