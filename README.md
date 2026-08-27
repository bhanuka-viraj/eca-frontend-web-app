# EduCloud Web Application Frontend

## Student Information
- **Student Name:** J P Bhanuka Viraj Madhuranga
- **Student Number:** 241711105
- **GCP Project ID:** enterprise-cloud-module-503705
- **Live Deployed URL:** https://eca-frontend-app-535026634701.us-central1.run.app

---

## Description
Frontend single page application for the EduCloud portal, connecting to the Spring Cloud API Gateway on Google Cloud Platform.

### Features
- User Registration & Listing (Cloud SQL MySQL via User Service)
- Course Publishing & Discovery (MongoDB via Course Service)
- Media File Upload to GCS Bucket (Google Cloud Storage via Media Service)

---

## Deployment (Cloud Run - PaaS/Serverless)
```bash
gcloud builds submit --tag gcr.io/enterprise-cloud-module-503705/frontend-app
gcloud run deploy eca-frontend-app \
  --image gcr.io/enterprise-cloud-module-503705/frontend-app \
  --platform managed \
  --allow-unauthenticated \
  --region us-central1
```
