# EduCloud Web Application Frontend

## Student Information
- **Student Name:** J P Bhanuka Viraj Madhuranga
- **Student Number:** 241711105
- **GCP Project ID:** enterprise-cloud-module-503705
- **Live Deployed URL:** https://eca-frontend-app-535026634701.us-central1.run.app

---

## Project Description
Frontend Single Page Application for the EduCloud portal, providing a responsive interface for user registration, course publishing, and cloud media uploads via the Spring Cloud API Gateway.

### Consumed Backend Microservices
1. **User Service (Cloud SQL):** User registration and profile listing (/api/v1/users).
2. **Course Service (MongoDB):** Course catalog creation and search (/api/v1/courses).
3. **Media Service (Cloud Storage):** Course thumbnail upload to GCS Bucket (/api/v1/media/upload).

---

## Deployment (Google Cloud Run - PaaS / Serverless)
`ash
gcloud builds submit --tag gcr.io/enterprise-cloud-module-503705/frontend-app
gcloud run deploy eca-frontend-app \
  --image gcr.io/enterprise-cloud-module-503705/frontend-app \
  --platform managed \
  --allow-unauthenticated \
  --region us-central1
`
