# EduCloud Web Application - React & Vite Cloud-Native Frontend

## Student & Coursework Metadata
- **Student Name:** J P Bhanuka Viraj Madhuranga
- **Student ID:** 241711105
- **GCP Project ID:** `enterprise-cloud-module-503705`
- **GCP Region:** `us-central1`
- **Cloud Run Service (Frontend):** `eca-frontend-app`
- **Live Cloud Run URL:** [https://eca-frontend-app-535026634701.us-central1.run.app](https://eca-frontend-app-535026634701.us-central1.run.app)
- **API Gateway Service:** `eca-api-gateway`
- **Live API Gateway URL:** [https://eca-api-gateway-535026634701.us-central1.run.app](https://eca-api-gateway-535026634701.us-central1.run.app)

---

## 🚀 Architecture Overview
This is a modern, responsive Single Page Application (SPA) built with **React 18/19**, **Vite**, **Tailwind CSS**, and **Lucide React**. It provides a unified portal to interact with backend microservices routed through the Spring Cloud API Gateway on Google Cloud Platform.

### 🌐 Microservices Integrated
1. **User Service (`/api/v1/users`):**
   - **Database:** Google Cloud SQL (MySQL 8.0)
   - **Features:** User registration, IAM role management (Student, Instructor, Admin), search & filter, delete.
2. **Course Service (`/api/v1/courses`):**
   - **Database:** MongoDB Atlas (NoSQL Document Store)
   - **Features:** Rich course catalog publishing, categorization, tag queries, thumbnail attachments.
3. **Media Service (`/api/v1/media/upload`):**
   - **Storage:** Google Cloud Storage (GCS Bucket: `eca-media-assets-enterprise-cloud-module-503705`)
   - **Features:** Drag-and-drop file upload with progress bar, image preview, public GCS URL generator, clipboard copy.

---

## 🛠️ Key Frontend Components
- `src/components/Navbar.jsx`: Brand banner, student/GCP badges, live gateway health status with latency ping.
- `src/components/GatewayConfig.jsx`: Live Gateway URL selector with environment presets (Localhost, Cloud Run, Load Balancer) and latency connection tester.
- `src/components/UserManagement.jsx`: Cloud SQL MySQL user management CRUD interface with real-time statistics.
- `src/components/CourseCatalog.jsx`: MongoDB course catalog manager with search, category filtering, and thumbnail rendering.
- `src/components/MediaUploader.jsx`: GCS upload dropzone with upload percentage progress and thumbnail sharing.
- `src/components/ArchitectureModal.jsx`: Interactive modal detailing the 3-Tier Enterprise Cloud Microservices architecture.
- `src/services/api.js`: Centralized Axios client supporting dynamic Gateway URL switching.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Run local development server (Vite)
npm run dev
# App will run at http://localhost:3000

# 3. Build for production
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 🐳 Docker Multi-Stage Build & Cloud Run Deployment

The application uses a multi-stage Docker build (`node:20-alpine` -> `nginx:alpine`) listening on container port **8080** as required by Google Cloud Run.

### Local Docker Build & Run
```bash
# Build the Docker image
docker build -t eca-frontend-web-app:latest .

# Run container on port 8080
docker run -d -p 8080:8080 eca-frontend-web-app:latest
```

### Google Cloud Run Deployment (Serverless / PaaS)
```bash
# 1. Build and push image using Google Cloud Build
gcloud builds submit --tag gcr.io/enterprise-cloud-module-503705/frontend-app

# 2. Deploy to Cloud Run
gcloud run deploy eca-frontend-app \
  --image gcr.io/enterprise-cloud-module-503705/frontend-app \
  --platform managed \
  --region us-central1 \
  --port 8080 \
  --allow-unauthenticated
```
