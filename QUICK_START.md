# Children Module - Quick Start Guide

This guide will help you get the Children module up and running quickly.

---

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

---

## 1. Backend Setup

### Install Dependencies
```bash
cd backend
npm install
```

### Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

Required environment variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/orphan_db"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

### Run Database Migrations
```bash
npx prisma migrate deploy
```

### Generate Prisma Client
```bash
npx prisma generate
```

### Start Backend Server
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

Backend will run on: `http://localhost:3000`

---

## 2. Frontend Setup

### Install Dependencies
```bash
cd ..  # Back to root
npm install
```

### Configure Environment
Create `.env` in root:
```env
VITE_API_URL=http://localhost:3000/api
```

### Start Frontend Server
```bash
# Development
npm run dev

# Production Build
npm run build
npm run preview
```

Frontend will run on: `http://localhost:5173`

---

## 3. Test the Children Module

### Create Test User
Use Swagger UI at `http://localhost:3000/api/docs`:

1. Register a new user (Admin role)
2. Login to get JWT token
3. Use token for authenticated requests

### Test API Endpoints

#### Register a Child
```bash
POST http://localhost:3000/api/children
Headers:
  Authorization: Bearer <your_jwt_token>
  Content-Type: application/json

Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2015-05-15",
  "gender": "MALE",
  "bloodGroup": "A_POSITIVE",
  "admissionReason": "Orphaned",
  "entrySource": "Police",
  "healthStatus": "HEALTHY"
}
```

#### List Children
```bash
GET http://localhost:3000/api/children?page=1&limit=8
Headers:
  Authorization: Bearer <your_jwt_token>
```

#### Get Child Profile
```bash
GET http://localhost:3000/api/children/:id
Headers:
  Authorization: Bearer <your_jwt_token>
```

### Test Frontend

1. Open `http://localhost:5173`
2. Login with your test user
3. Navigate to Children page
4. Try:
   - Viewing children list
   - Searching for children
   - Filtering by status
   - Viewing child profile
   - Registering new child

---

## 4. Database Seeding (Optional)

To populate the database with sample data:

```bash
cd backend
npm run seed
```

This will create:
- Sample orphanages
- Sample children
- Sample attendance records
- Sample users

---

## 5. Verify Installation

### Backend Health Check
```bash
curl http://localhost:3000/api/health
```

### Check Database Connection
```bash
cd backend
npx prisma studio
```

This opens Prisma Studio at `http://localhost:5555`

### Frontend Build Test
```bash
npm run build
```

Should complete without errors.

---

## 6. Common Issues

### Issue: Database connection fails
**Solution**: Check PostgreSQL is running and credentials in `.env` are correct

### Issue: JWT authentication fails
**Solution**: Make sure JWT secrets are set in backend `.env`

### Issue: Frontend can't connect to backend
**Solution**: Verify `VITE_API_URL` in frontend `.env` matches backend URL

### Issue: Prisma client not found
**Solution**: Run `npx prisma generate` in backend folder

---

## 7. API Documentation

Once backend is running, access Swagger documentation:
```
http://localhost:3000/api/docs
```

This provides:
- All API endpoints
- Request/response schemas
- Authentication requirements
- Try-it-out functionality

---

## 8. Development Workflow

### Make Changes to Backend
1. Edit files in `backend/src/`
2. Server auto-reloads (if using `npm run start:dev`)
3. Test changes via Swagger or frontend

### Make Changes to Frontend
1. Edit files in `src/`
2. Vite auto-reloads browser
3. See changes immediately

### Update Database Schema
1. Edit `backend/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_migration_name`
3. Prisma client auto-updates

---

## 9. Production Deployment

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
npm run build
# Deploy 'dist' folder to your hosting (Vercel, Netlify, etc.)
```

### Environment Variables
Make sure to set production values for:
- `DATABASE_URL` (production database)
- `JWT_SECRET` (strong secret)
- `VITE_API_URL` (production backend URL)

---

## 10. Next Steps

After verifying the Children module works:

1. Review the detailed completion report: `CHILDREN_MODULE_COMPLETION_REPORT.md`
2. Check audit summary: `AUDIT_SUMMARY.md`
3. Review frontend integration guide: `FRONTEND_INTEGRATION.md`
4. Proceed with next module implementation

---

## Support

For issues or questions:
1. Check the completion report for detailed information
2. Review Swagger documentation for API details
3. Check browser console for frontend errors
4. Check backend logs for API errors

---

**Status**: ✅ Production Ready  
**Last Updated**: January 14, 2026  
**Version**: 1.0.0
