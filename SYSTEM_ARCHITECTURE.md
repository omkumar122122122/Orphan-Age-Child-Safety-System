# 🏗️ SYSTEM ARCHITECTURE - ORPHAN AGE CHILD SAFETY SYSTEM

**Document Purpose**: Visual architecture overview  
**Last Updated**: Implementation Complete  
**Status**: Production-Ready

---

## 📐 HIGH-LEVEL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Admin UI   │  │  Parent UI   │  │ Orphanage UI │         │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                 │
│                            │                                     │
│                   React + Vite Frontend                          │
│                   (Port 5173)                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS/REST
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                       API GATEWAY LAYER                          │
│                                                                  │
│              NestJS Application (Port 3000)                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  JWT Auth │ Role Guards │ Rate Limiting │ CORS │ Headers │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                         │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │   Auth   │ │ Children │ │ Parents  │ │Orphanages│         │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │  Visit   │ │   Staff  │ │Notifications│Dashboard │         │
│  │ Requests │ │ Service  │ │  Service  │ Service  │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                    DATA ACCESS LAYER                             │
│                                                                  │
│                     Prisma ORM                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Query Builder │ Migrations │ Type Safety │ Relations     │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                      DATABASE LAYER                              │
│                                                                  │
│                   PostgreSQL Database                            │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Users │ Children │ Parents │ Orphanages │ VisitRequests  │ │
│  │ Staff │ Adoptions │ Notifications │ Documents │ etc...   │ │
│  └───────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 DATA FLOW - EXAMPLE: VISIT REQUEST APPROVAL

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER ACTION                                   │
│  Orphanage staff clicks "Approve" on visit request              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FRONTEND (React)                                │
│  1. Button onClick → dashboardService.approveVisit(id, data)    │
│  2. API call with JWT token in headers                          │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP PATCH
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  API LAYER (NestJS)                              │
│  1. JWT Guard → validates token                                 │
│  2. Role Guard → checks ORPHANAGE role                          │
│  3. VisitRequestsController.approve()                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              BUSINESS LOGIC (Service)                            │
│  1. VisitRequestsService.approve()                              │
│  2. Validate request exists                                     │
│  3. Validate orphanage ownership                                │
│  4. Generate QR code if requested                               │
│  5. Update visit request status                                 │
│  6. Call NotificationsService.sendNotification()                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              DATA ACCESS (Prisma)                                │
│  1. prisma.visitRequest.update()                                │
│  2. prisma.notification.create()                                │
│  3. Transaction committed                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              DATABASE (PostgreSQL)                               │
│  1. UPDATE visit_requests SET status='APPROVED'                 │
│  2. INSERT INTO notifications (userId, type, title, body...)    │
│  3. COMMIT                                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼ Response flows back up
┌─────────────────────────────────────────────────────────────────┐
│                  FRONTEND (React)                                │
│  1. Success response received                                   │
│  2. UI updated (visit status → Approved)                        │
│  3. Toast notification shown                                    │
│  4. Parent receives notification in real-time                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 SECURITY LAYERS

```
┌─────────────────────────────────────────────────────────────────┐
│                    INCOMING REQUEST                              │
│            (User → Frontend → Backend)                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   1. HTTPS/TLS  │
                    │   Encryption    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ 2. CORS Headers │
                    │   Validation    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ 3. Rate Limiter │
                    │   Throttling    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  4. JWT Guard   │
                    │   Verify Token  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  5. Role Guard  │
                    │  Check Roles    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ 6. Validation   │
                    │   Pipes (DTO)   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ 7. Ownership    │
                    │   Validation    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ 8. Business     │
                    │    Logic        │
                    └─────────────────┘
```

---

## 📊 DATABASE SCHEMA OVERVIEW

```
┌────────────────────────────────────────────────────────────────┐
│                      CORE ENTITIES                              │
│                                                                 │
│  ┌──────────┐         ┌──────────┐         ┌──────────┐       │
│  │   User   │◄───────►│  Parent  │         │  Child   │       │
│  │          │         │          │         │          │       │
│  │ • id     │         │ • id     │         │ • id     │       │
│  │ • email  │         │ • userId │         │ • name   │       │
│  │ • role   │         │ • kyc    │         │ • age    │       │
│  │ • hash   │         │ • trust  │         │ • risk   │       │
│  └────┬─────┘         └────┬─────┘         └────┬─────┘       │
│       │                    │                     │             │
│       │                    │                     │             │
│  ┌────▼─────┐         ┌────▼─────┐         ┌────▼─────┐       │
│  │Orphanage │         │ParentDoc │         │Orphanage │       │
│  │          │         │          │         │Staff     │       │
│  │ • id     │         │ • id     │         │          │       │
│  │ • name   │         │ • type   │         │ • id     │       │
│  │ • active │         │ • status │         │ • role   │       │
│  └────┬─────┘         └──────────┘         └──────────┘       │
│       │                                                        │
└───────┼────────────────────────────────────────────────────────┘
        │
┌───────┼────────────────────────────────────────────────────────┐
│       │           TRANSACTIONAL ENTITIES                        │
│       │                                                        │
│  ┌────▼─────────┐       ┌──────────────┐                      │
│  │ VisitRequest │       │  Adoption    │                      │
│  │              │       │              │                      │
│  │ • id         │       │ • id         │                      │
│  │ • parentId   │       │ • parentId   │                      │
│  │ • orphanageId│       │ • childId    │                      │
│  │ • childId    │       │ • status     │                      │
│  │ • status     │       │ • startDate  │                      │
│  │ • visitDate  │       └──────────────┘                      │
│  │ • qrCode     │                                             │
│  └──────────────┘       ┌──────────────┐                      │
│                         │ Notification │                      │
│  ┌──────────────┐       │              │                      │
│  │PoliceVerif  │       │ • id         │                      │
│  │              │       │ • userId     │                      │
│  │ • id         │       │ • type       │                      │
│  │ • parentId   │       │ • title      │                      │
│  │ • status     │       │ • body       │                      │
│  │ • verifiedAt │       │ • isRead     │                      │
│  └──────────────┘       └──────────────┘                      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎭 USER ROLES & PERMISSIONS

```
┌─────────────────────────────────────────────────────────────────┐
│                        ROLE: ADMIN                               │
│                                                                  │
│  ✅ View all system data                                        │
│  ✅ Manage all children records                                 │
│  ✅ Manage all orphanages                                       │
│  ✅ View all parent profiles                                    │
│  ✅ View all visit requests                                     │
│  ✅ Access admin dashboard                                      │
│  ✅ Create/delete users                                         │
│  ✅ Generate system reports                                     │
│  ✅ System configuration                                        │
│  ❌ Cannot approve/reject visit requests (orphanage only)       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      ROLE: ORPHANAGE                             │
│                                                                  │
│  ✅ View own children only                                      │
│  ✅ Register new children                                       │
│  ✅ Update own children records                                 │
│  ✅ Manage own staff                                            │
│  ✅ View visit requests for own orphanage                       │
│  ✅ Approve/reject visit requests                               │
│  ✅ Reschedule visits                                           │
│  ✅ Access orphanage dashboard                                  │
│  ✅ View own notifications                                      │
│  ❌ Cannot see other orphanages' data                           │
│  ❌ Cannot manage system settings                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       ROLE: PARENT                               │
│                                                                  │
│  ✅ View own profile                                            │
│  ✅ Update own profile                                          │
│  ✅ View linked child (if adopted)                              │
│  ✅ Submit visit requests                                       │
│  ✅ View own visit requests                                     │
│  ✅ Cancel own visit requests                                   │
│  ✅ Upload KYC documents                                        │
│  ✅ View adoption journey                                       │
│  ✅ Access parent dashboard                                     │
│  ✅ Chat with Sahayak AI                                        │
│  ✅ View own notifications                                      │
│  ❌ Cannot see other children                                   │
│  ❌ Cannot approve own visit requests                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   ROLE: SOCIAL_WORKER                            │
│                                                                  │
│  ✅ View assigned cases                                         │
│  ✅ Update case notes                                           │
│  ✅ Conduct welfare checks                                      │
│  ✅ Generate reports                                            │
│  ✅ View notifications                                          │
│  ❌ Limited access (case-specific)                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 MODULE DEPENDENCIES

```
┌────────────────────────────────────────────────────────────────┐
│                     MODULE DEPENDENCY GRAPH                     │
│                                                                 │
│                      ┌──────────────┐                          │
│                      │   AuthModule │                          │
│                      └───────┬──────┘                          │
│                              │                                 │
│              ┌───────────────┼───────────────┐                 │
│              │               │               │                 │
│      ┌───────▼─────┐ ┌───────▼─────┐ ┌─────▼──────┐          │
│      │UsersModule  │ │CommonModule │ │PrismaModule│          │
│      └───────┬─────┘ └───────┬─────┘ └─────┬──────┘          │
│              │               │               │                 │
│    ┌─────────┴───────────────┴───────────────┴─────────┐      │
│    │                                                     │      │
│ ┌──▼────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐ │      │
│ │ Children  │ │ Parents  │ │Orphanages│ │   Staff   │ │      │
│ │  Module   │ │  Module  │ │  Module  │ │  Module   │ │      │
│ └─────┬─────┘ └─────┬────┘ └────┬─────┘ └─────┬─────┘ │      │
│       │             │            │             │        │      │
│       └─────────────┴────────────┴─────────────┘        │      │
│                     │                                    │      │
│            ┌────────▼──────────┐                        │      │
│            │  VisitRequests    │                        │      │
│            │     Module        │◄───────────────────────┘      │
│            └────────┬──────────┘                               │
│                     │                                          │
│            ┌────────▼──────────┐                               │
│            │  Notifications    │                               │
│            │     Module        │                               │
│            └────────┬──────────┘                               │
│                     │                                          │
│            ┌────────▼──────────┐                               │
│            │   Dashboard       │                               │
│            │     Module        │                               │
│            └───────────────────┘                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 FRONTEND COMPONENT HIERARCHY

```
App.jsx
│
├── AppRoutes.jsx
│   │
│   ├── ProtectedRoute (HOC)
│   │   │
│   │   ├── AdminLayout
│   │   │   ├── Sidebar
│   │   │   ├── Navbar
│   │   │   └── AdminDashboard
│   │   │       ├── StatCard (x4)
│   │   │       ├── LineChartCard
│   │   │       ├── DoughnutChartCard
│   │   │       ├── DataTable
│   │   │       └── NotificationPanel
│   │   │
│   │   ├── ParentLayout
│   │   │   ├── Sidebar
│   │   │   ├── Navbar
│   │   │   └── ParentDashboard
│   │   │       ├── LinkedChildCard
│   │   │       ├── AdoptionTimeline
│   │   │       ├── NotificationPanel
│   │   │       ├── SahayakAI
│   │   │       └── Chatbot (floating)
│   │   │
│   │   └── OrphanageLayout
│   │       ├── Sidebar
│   │       ├── Navbar
│   │       └── OrphanageDashboard
│   │           ├── StatCard (x4)
│   │           ├── LineChartCard
│   │           ├── DataTable
│   │           └── NotificationPanel
│   │
│   └── Login
│
└── Providers
    ├── AuthContext
    ├── ThemeContext
    └── RouterProvider
```

---

## 🚀 DEPLOYMENT ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRODUCTION DEPLOYMENT                       │
│                                                                  │
│                     ┌──────────────────┐                        │
│                     │   Load Balancer  │                        │
│                     │   (Nginx/ALB)    │                        │
│                     └────────┬─────────┘                        │
│                              │                                  │
│              ┌───────────────┴───────────────┐                  │
│              │                               │                  │
│     ┌────────▼────────┐           ┌─────────▼────────┐         │
│     │  Frontend CDN   │           │  Backend Server  │         │
│     │  (Vercel/       │           │  (EC2/App Svc)   │         │
│     │   Netlify)      │           │                  │         │
│     │                 │           │  NestJS App      │         │
│     │  Static Files   │           │  (Port 3000)     │         │
│     │  React Build    │           └─────────┬────────┘         │
│     └─────────────────┘                     │                  │
│                                             │                  │
│                                   ┌─────────▼────────┐         │
│                                   │   PostgreSQL     │         │
│                                   │   Database       │         │
│                                   │   (RDS/Managed)  │         │
│                                   └──────────────────┘         │
│                                                                  │
│  Additional Services:                                           │
│  ├── Redis (Caching)                                           │
│  ├── S3 (File Storage)                                         │
│  ├── CloudWatch (Monitoring)                                   │
│  ├── SES (Email)                                               │
│  └── SNS (SMS)                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📈 SCALABILITY CONSIDERATIONS

```
┌─────────────────────────────────────────────────────────────────┐
│                    HORIZONTAL SCALING                            │
│                                                                  │
│  Backend:                                                        │
│  ├── Stateless NestJS servers                                  │
│  ├── Multiple instances behind load balancer                    │
│  ├── Auto-scaling based on CPU/memory                          │
│  └── Session stored in Redis (not in-memory)                   │
│                                                                  │
│  Database:                                                       │
│  ├── Read replicas for read-heavy operations                   │
│  ├── Connection pooling (Prisma)                               │
│  ├── Query optimization with indexes                           │
│  └── Partitioning for large tables                             │
│                                                                  │
│  Frontend:                                                       │
│  ├── CDN for static assets                                     │
│  ├── Code splitting for faster loads                           │
│  ├── Lazy loading of routes                                    │
│  └── Service worker for offline support                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ ARCHITECTURE PRINCIPLES

1. **Separation of Concerns** - Clear layer boundaries
2. **Single Responsibility** - Each module has one purpose
3. **Dependency Injection** - Loose coupling between components
4. **Type Safety** - TypeScript throughout backend
5. **RESTful API** - Standard HTTP methods and status codes
6. **Security First** - Multiple security layers
7. **Scalability** - Horizontal scaling ready
8. **Maintainability** - Clean code, comprehensive docs
9. **Performance** - Optimized queries, caching ready
10. **Testability** - Services can be unit tested independently

---

**Architecture Version**: 1.0.0  
**Last Updated**: Dashboard Module Complete  
**Status**: Production-Ready Architecture
