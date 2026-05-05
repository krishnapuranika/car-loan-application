# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A car loan application with a Spring Boot REST API backend and React + TypeScript frontend. Users submit loan applications via a 3-step form and track status using a unique tracking ID.

## Architecture

```
car-loan-application/
├── backend/          # Spring Boot 3.2 REST API (Java 17, Maven)
│   └── src/main/java/com/carloan/
│       ├── controller/   LoanApplicationController
│       ├── service/      LoanApplicationService
│       ├── repository/   LoanApplicationRepository (JPA)
│       ├── entity/       LoanApplication
│       ├── dto/          LoanApplicationRequest / Response / ErrorResponse
│       ├── enums/        ApplicationStatus, EmploymentStatus
│       ├── exception/    GlobalExceptionHandler, ApplicationNotFoundException
│       └── config/       CorsConfig
└── frontend/         # React 18 + Vite + TypeScript + Tailwind CSS
    └── src/
        ├── pages/    HomePage, ApplyPage (3-step form), TrackPage
        ├── components/ Navbar, StatusBadge, LoadingSpinner
        ├── api/      loanApi.ts (fetch wrapper)
        └── types/    loan.ts (shared TS types)
```

### Backend API
- `POST /api/v1/applications` — submit application → returns `trackingId` + status
- `GET  /api/v1/applications/{trackingId}` — track by ID
- `GET  /actuator/health` — health check
- H2 in-memory DB in dev (`/h2-console` available). Configure `DATABASE_URL` env var for production.

### Frontend routing
- `/` — Home with two action cards (Apply / Track)
- `/apply` — 3-step form: Personal Info → Financial Info → Vehicle & Loan
- `/track` — Enter tracking ID; shows status timeline and application details
- `/track?id=CAR-XXXXXXXX` — auto-loads the given tracking ID

## Development Commands

### Backend
```bash
cd backend
mvn spring-boot:run              # Start dev server on :8080 (or ./mvnw if wrapper present)
mvn test                         # Run all tests
mvn test -Dtest=ClassName        # Run a single test class
mvn package -DskipTests          # Build JAR to target/
```
Generate Maven wrapper (one-time): `mvn wrapper:wrapper`

### Frontend
```bash
cd frontend
npm install                      # Install dependencies
npm run dev                      # Start dev server on :5173 (proxies /api → :8080)
npm run build                    # Production build to dist/
npm run lint                     # ESLint
npm test                         # Vitest watch mode
npm run test:run                 # Vitest single run
npm run test:run -- SomeTest     # Run a single test file
```

### Docker (full stack)
```bash
docker compose up --build        # Build and start frontend (:80) + backend (:8080)
```

## Key Design Decisions

- **Tracking ID format**: `CAR-` + 8 random uppercase hex chars (e.g. `CAR-A3F7B2D9`), set by `@PrePersist` on the entity.
- **Status flow**: `SUBMITTED` → `UNDER_REVIEW` → `APPROVED` | `REJECTED`
- **Validation**: Bean Validation on the backend DTO; Zod schema + React Hook Form on the frontend. Field errors are returned as `errors: { fieldName: message }` in the 400 response.
- **CORS**: Backend allows `http://localhost:5173,http://localhost:3000` in dev; override with `ALLOWED_ORIGINS` env var in prod.
- **Dev proxy**: Vite dev server proxies `/api` → `http://localhost:8080`, so no CORS issue during development.
- **Prod routing**: Nginx serves the SPA and reverse-proxies `/api` to the backend container (`http://backend:8080`).
- **Error propagation**: `loanApi.ts` re-throws the parsed JSON error body, so pages can display the backend's `message` field directly.
