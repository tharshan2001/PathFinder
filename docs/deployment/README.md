# Deployment Documentation

This folder contains screenshots and evidence of successful deployment.

## Live URLs

| Service | URL |
|---------|-----|
| Frontend | `https://cloudbox.my` |
| Backend API | `https://api.cloudbox.my` |
| API Docs | `https://api.cloudbox.my/api-docs` |

## Required Screenshots

### 1. Backend Deployment

- [ ] Server/VPS dashboard showing successful deployment
- [ ] Backend health check response from `https://api.cloudbox.my/api/health`
- [ ] Swagger UI accessible at `https://api.cloudbox.my/api-docs`

### 2. Frontend Deployment

- [ ] Frontend homepage at `https://cloudbox.my`
- [ ] Application running without errors
- [ ] User registration/login working

### 3. API Verification

- [ ] Health check endpoint response
- [ ] User registration working
- [ ] User login returning JWT token

### 4. Database Connection

- [ ] MongoDB Atlas cluster dashboard
- [ ] Evidence of data being stored (collections with documents)

## Naming Convention

Name screenshots as:
```
backend-deployment-[description].png
frontend-deployment-[description].png
api-verification-[description].png
database-connection-[description].png
```

## Example Screenshots to Capture

1. `backend-deployment-server-success.png` - Shows live service status
2. `frontend-deployment-homepage.png` - CloudBox homepage
3. `api-verification-swagger.png` - Swagger UI at api.cloudbox.my
4. `api-verification-health-check.png` - Response from /api/health
5. `database-connection-atlas.png` - MongoDB Atlas dashboard
