# Technical Documentation

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Architecture Overview](#architecture-overview)
3. [Project Structure](#project-structure)
4. [Backend](#backend)
5. [Frontend](#frontend)
6. [Running the Application](#running-the-application)
7. [API Reference](#api-reference)
8. [Testing](#testing)
9. [Docker Deployment](#docker-deployment)

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend language | Java 17+ |
| Backend framework | Spring Boot 3.2 |
| Persistence | Spring Data JPA + Hibernate 6 |
| Database (dev) | H2 in-memory |
| Build tool | Maven 3.9 |
| Frontend language | TypeScript |
| Frontend framework | React 18 |
| Bundler | Vite 5 |
| Styling | Tailwind CSS 3 |
| Form management | React Hook Form + Zod |
| Backend tests | JUnit 5, Mockito, Spring MockMvc |
| Frontend tests | Vitest, React Testing Library |
| Container | Docker + Nginx |

---

## Architecture Overview

The application follows a standard three-tier architecture.

```
Browser
  │
  ▼
React SPA (Vite dev server / Nginx in prod)
  │  /api/* proxied
  ▼
Spring Boot REST API  (:8080)
  │
  ▼
H2 in-memory database (dev) / configurable DB (prod)
```

### Backend layer breakdown

```
HTTP Request
    │
    ▼
LoanApplicationController   — validates input, maps HTTP verbs
    │
    ▼
LoanApplicationService      — business logic, status messages
    │
    ▼
LoanApplicationRepository   — Spring Data JPA interface
    │
    ▼
LoanApplication (Entity)    — JPA-managed, @PrePersist sets trackingId
```

### Key design decisions

- **Tracking ID** is generated inside `@PrePersist` as `CAR-` + 8 random uppercase hex characters (e.g. `CAR-A3F7B2D9`). It is never set by the caller.
- **Status flow**: `SUBMITTED` → `UNDER_REVIEW` → `APPROVED` or `REJECTED`. Status transitions are managed manually (e.g. by an admin process) via direct database updates in this version.
- **Validation** is enforced at two levels: Jakarta Bean Validation annotations on the request DTO (backend) and a Zod schema on the form (frontend). Both return field-level error messages.
- **Error contract**: all errors return `{ status, message, errors?, timestamp }`. The `errors` map is present only for validation failures (HTTP 400).
- **Dev proxy**: Vite proxies `/api` → `http://localhost:8080` so the frontend and backend can run on different ports without CORS issues during development.

---

## Project Structure

```
car-loan-application/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/carloan/
│       │   ├── CarLoanApplication.java
│       │   ├── config/        CorsConfig.java
│       │   ├── controller/    LoanApplicationController.java
│       │   ├── dto/           LoanApplicationRequest / Response / ErrorResponse
│       │   ├── entity/        LoanApplication.java
│       │   ├── enums/         ApplicationStatus, EmploymentStatus
│       │   ├── exception/     GlobalExceptionHandler, ApplicationNotFoundException
│       │   ├── repository/    LoanApplicationRepository.java
│       │   └── service/       LoanApplicationService.java
│       └── main/resources/
│           ├── application.properties          (dev)
│           └── application-prod.properties     (prod overrides)
├── frontend/
│   ├── src/
│   │   ├── api/           loanApi.ts
│   │   ├── components/    Navbar, StatusBadge, LoadingSpinner
│   │   ├── pages/         HomePage, ApplyPage, TrackPage
│   │   ├── types/         loan.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── nginx.conf
├── docker-compose.yml
├── README.md              (end-user documentation)
└── docs/
    └── TECHNICAL.md       (this file)
```

---

## Backend

### Data model — `loan_applications` table

| Column | Type | Notes |
|--------|------|-------|
| `id` | BIGINT | Auto-generated primary key |
| `tracking_id` | VARCHAR | Unique, set by `@PrePersist` |
| `first_name` | VARCHAR | |
| `last_name` | VARCHAR | |
| `email` | VARCHAR | |
| `phone` | VARCHAR | |
| `date_of_birth` | DATE | |
| `employment_status` | VARCHAR | `EMPLOYED / SELF_EMPLOYED / UNEMPLOYED / RETIRED` |
| `annual_income` | NUMERIC(12,2) | |
| `employer_name` | VARCHAR | Nullable |
| `vehicle_make` | VARCHAR | |
| `vehicle_model` | VARCHAR | |
| `vehicle_year` | INT | 1980 – 2027 |
| `vehicle_price` | NUMERIC(12,2) | Min $1,000 |
| `down_payment` | NUMERIC(12,2) | Min $0 |
| `loan_amount` | NUMERIC(12,2) | Min $1,000 |
| `loan_term_months` | INT | 12 / 24 / 36 / 48 / 60 / 72 / 84 |
| `status` | VARCHAR | `SUBMITTED / UNDER_REVIEW / APPROVED / REJECTED` |
| `submitted_at` | TIMESTAMP | Set by `@PrePersist`, never updated |
| `updated_at` | TIMESTAMP | Set by `@PrePersist`, refreshed by `@PreUpdate` |

### Configuration

**`application.properties`** (dev defaults)
```properties
spring.datasource.url=jdbc:h2:mem:carloandb
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true   # accessible at /h2-console
server.port=8080
cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

**Production overrides** (`application-prod.properties`) via environment variables:

| Variable | Purpose | Default |
|----------|---------|---------|
| `DATABASE_URL` | JDBC connection string | H2 in-memory |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost` |
| `SPRING_PROFILES_ACTIVE` | Set to `prod` | `default` |

---

## Frontend

### Page routing

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `HomePage` | Landing page with Apply and Track cards |
| `/apply` | `ApplyPage` | 3-step loan application form |
| `/track` | `TrackPage` | Track an application by tracking ID |
| `/track?id=CAR-XXXXXXXX` | `TrackPage` | Auto-loads and displays the given application |

### Form steps (`ApplyPage`)

| Step | Fields |
|------|--------|
| 1 – Personal Info | First name, Last name, Email, Phone, Date of birth |
| 2 – Financial Info | Employment status, Annual income, Employer name (optional) |
| 3 – Vehicle & Loan | Vehicle make/model/year, Vehicle price, Down payment, Loan amount, Loan term |

### API client (`src/api/loanApi.ts`)

All API calls go through `loanApi.ts`, which wraps `fetch` and throws the parsed error body on non-2xx responses. Pages catch these errors and display `error.message` directly.

---

## Running the Application

### Prerequisites

- Java 17 or higher
- Maven 3.9 or higher
- Node.js 20 or higher

### Local development

```bash
# Terminal 1 — backend (http://localhost:8080)
cd backend
mvn spring-boot:run

# Terminal 2 — frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

Generate Maven wrapper (one-time, optional):
```bash
cd backend && mvn wrapper:wrapper
```

---

## API Reference

### Submit a loan application

**`POST /api/v1/applications`**

Request body:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "9876543210",
  "dateOfBirth": "1985-06-15",
  "employmentStatus": "EMPLOYED",
  "annualIncome": 75000,
  "employerName": "Acme Corp",
  "vehicleMake": "Honda",
  "vehicleModel": "Accord",
  "vehicleYear": 2023,
  "vehiclePrice": 30000,
  "downPayment": 6000,
  "loanAmount": 24000,
  "loanTermMonths": 60
}
```

Success response — **`201 Created`**:
```json
{
  "trackingId": "CAR-A3F7B2D9",
  "status": "SUBMITTED",
  "statusMessage": "Your application has been received and is pending review.",
  "applicantName": "Jane Smith",
  "email": "jane@example.com",
  "loanAmount": 24000,
  "loanTermMonths": 60,
  "vehicleInfo": "2023 Honda Accord",
  "submittedAt": "2026-05-05T10:00:00",
  "updatedAt": "2026-05-05T10:00:00"
}
```

Validation error — **`400 Bad Request`**:
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "loanAmount": "Loan amount must be at least $1,000"
  },
  "timestamp": "2026-05-05T10:00:00"
}
```

---

### Track an application

**`GET /api/v1/applications/{trackingId}`**

The `trackingId` is case-insensitive (e.g. `car-a3f7b2d9` and `CAR-A3F7B2D9` are equivalent).

Success response — **`200 OK`**: same shape as the submit response above.

Not found — **`404 Not Found`**:
```json
{
  "status": 404,
  "message": "No application found with tracking ID: CAR-NOTEXIST",
  "timestamp": "2026-05-05T10:00:00"
}
```

---

### Health check

**`GET /actuator/health`** — returns `{ "status": "UP" }` with component details (DB, disk space).

---

## Testing

### Running tests

```bash
# Backend — all tests
cd backend && mvn test

# Backend — single class
mvn test -Dtest=LoanApplicationServiceTest

# Frontend — all tests (single run)
cd frontend && npm run test:run

# Frontend — watch mode
npm test

# Frontend — with coverage report
npm run test:coverage

# E2E — requires backend (:8080) and frontend (:5173) already running
cd e2e && mvn test

# E2E — with visible browser window
cd e2e && mvn test -Dheadless=false

# E2E — against a different base URL
cd e2e && mvn test -Dbase.url=http://localhost:3000
```

### Backend test suite — 24 tests

#### `LoanApplicationRepositoryTest` (5 tests) — `@DataJpaTest`
Uses a lightweight JPA context with an embedded H2 database. No full Spring Boot context is loaded.

| Test | What it verifies |
|------|-----------------|
| `save_shouldSetTrackingIdStatusAndTimestamps` | `@PrePersist` generates a `CAR-XXXXXXXX` tracking ID and sets status to `SUBMITTED` |
| `findByTrackingId_shouldReturnApplication` | Saved entity is retrievable by its tracking ID |
| `findByTrackingId_shouldReturnEmpty_whenIdDoesNotExist` | Returns `Optional.empty()` for an unknown ID |
| `save_shouldPersistAllFields` | All entity fields survive a persist/flush/find round trip |
| `trackingIds_shouldBeUniqueAcrossApplications` | Two separate saves produce different tracking IDs |

#### `LoanApplicationServiceTest` (9 tests) — unit tests with Mockito

| Test | What it verifies |
|------|-----------------|
| `submitApplication_shouldSaveAndReturnResponse` | Response contains correct tracking ID, status, and vehicle info |
| `submitApplication_shouldMapAllRequestFieldsToEntity` | All request fields are transferred to the saved entity |
| `trackApplication_shouldReturnApplicationByTrackingId` | Service delegates to repository and maps result |
| `trackApplication_shouldUppercaseTrackingId` | Lowercase input is normalised before the repository call |
| `trackApplication_shouldThrowWhenNotFound` | `ApplicationNotFoundException` is thrown with the tracking ID in the message |
| `statusMessage_submitted` | Status message contains "received" for `SUBMITTED` |
| `statusMessage_underReview` | Status message contains "reviewing" for `UNDER_REVIEW` |
| `statusMessage_approved` | Status message contains "approved" for `APPROVED` |
| `statusMessage_rejected` | Status message contains "not approved" for `REJECTED` |

#### `LoanApplicationControllerIntegrationTest` (10 tests) — `@SpringBootTest` + MockMvc

Full Spring application context with an in-memory H2 database.

| Test | What it verifies |
|------|-----------------|
| `submitApplication_shouldReturn201WithTrackingId` | Valid request returns `201` with a `CAR-` prefixed tracking ID |
| `submitApplication_shouldReturn400_whenBodyIsEmpty` | Empty body returns `400` with field-level errors for `firstName`, `email`, `loanAmount` |
| `submitApplication_shouldReturn400_whenEmailIsInvalid` | Bad email format returns `400` with `errors.email` |
| `submitApplication_shouldReturn400_whenLoanAmountIsTooLow` | Amount below $1,000 returns `400` with `errors.loanAmount` |
| `submitApplication_shouldReturn400_whenVehicleYearIsTooOld` | Year below 1980 returns `400` with `errors.vehicleYear` |
| `submitApplication_shouldReturn400_whenPhoneIsInvalid` | Non-numeric phone returns `400` with `errors.phone` |
| `trackApplication_shouldReturn200_afterSuccessfulSubmit` | Submit then track returns same tracking ID and correct loan term |
| `trackApplication_shouldAcceptLowercaseTrackingId` | Lowercase tracking ID resolves to the same application |
| `trackApplication_shouldReturn404_forUnknownId` | Unknown ID returns `404` with message containing the ID |
| `trackApplication_errorResponse_shouldContainStatusAndTimestamp` | Error response includes `status` field and `timestamp` |

---

### Frontend test suite — 54 tests

#### `StatusBadge.test.tsx` (6 tests)
Verifies correct label text and CSS colour class for each of the four application statuses.

#### `LoadingSpinner.test.tsx` (5 tests)
Verifies SVG renders, optional message appears, and size classes (`w-4`, `w-12`) are applied correctly.

#### `Navbar.test.tsx` (7 tests)
Verifies brand link, navigation links, correct `href` attributes, and active-state highlighting when on `/apply`.

#### `loanApi.test.ts` (8 tests)

| Test | What it verifies |
|------|-----------------|
| Sends `POST` to `/api/v1/applications` | Correct HTTP method and URL |
| Sends `Content-Type: application/json` | Header is present |
| Serialises request body as JSON | `firstName` and `loanAmount` are in the body |
| Returns parsed response on success | `trackingId` and `status` are accessible |
| Throws error body on non-2xx | Rejected promise contains backend `message` |
| Sends `GET` with uppercased tracking ID | Lowercase input is normalised in the URL |
| Returns parsed response on `GET` success | `applicantName` and `vehicleInfo` are accessible |
| Throws on 404 | Rejected promise contains backend `message` |

#### `HomePage.test.tsx` (6 tests)
Verifies heading, both action cards render with correct link targets, and all three feature highlights are present.

#### `ApplyPage.test.tsx` (9 tests)

| Test | What it verifies |
|------|-----------------|
| Renders page heading | "Apply for a Car Loan" is visible |
| Shows Personal Info fields on step 1 | All four input placeholders are present |
| Shows 3 step indicators | Step labels visible in the progress bar |
| Shows validation errors on empty Continue | At least one "Required" error appears |
| No Back button on step 1 | Back is not rendered |
| Moves to step 2 after valid step 1 | "Financial Information" heading appears |
| Shows Back button on step 2 | Back button is present |
| Back returns to step 1 | Personal Info fields reappear |
| Shows tracking ID on successful submission | Full form completion triggers API call and success state |

#### `TrackPage.test.tsx` (13 tests)

| Test | What it verifies |
|------|-----------------|
| Renders heading | "Track Your Application" is visible |
| Renders tracking ID input | Placeholder `CAR-XXXXXXXX` is present |
| Renders Track button | Button is in the document |
| Track button disabled when empty | Button is disabled with no input |
| Track button enabled after typing | Button becomes enabled |
| Shows applicant and vehicle after track | `applicantName` and `vehicleInfo` from API are displayed |
| Shows status badge | A `<span>` with the status label is present |
| Shows status message | The full status message string is visible |
| Displays formatted loan amount | `$20,000.00` is rendered |
| Shows error when ID not found | API error message is displayed |
| Clears previous results before new lookup | First result disappears after second (failed) search |
| Auto-loads from `?id=` URL param | `trackApplication` is called with the URL param value |
| Pre-fills input from `?id=` URL param | Input value matches the URL param |

---

## E2E Test Suite (Selenium + Cucumber)

End-to-end browser tests live in `e2e/` — a standalone Maven project separate from the Spring Boot backend.

### Technology

| Tool | Version | Purpose |
|------|---------|---------|
| Cucumber (JUnit Platform engine) | 7.15.0 | BDD framework and Gherkin feature files |
| Selenium WebDriver | 4.18.1 | Browser automation |
| WebDriverManager | 5.8.0 | Automatic ChromeDriver management |
| PicoContainer | 7.15.0 | Dependency injection between step classes |

### Structure

```
e2e/
├── pom.xml
└── src/test/
    ├── java/com/carloan/e2e/
    │   ├── CucumberRunner.java          — @Suite entry point
    │   ├── context/  ScenarioContext    — shared WebDriver + trackingId per scenario
    │   ├── hooks/    Hooks              — @Before Chrome setup, @After screenshot on failure
    │   ├── pages/    BasePage, HomePage, ApplyPage, TrackPage (Page Object Model)
    │   └── steps/    CommonSteps, HomePageSteps, ApplyPageSteps, TrackPageSteps
    └── resources/
        ├── junit-platform.properties
        └── features/
            ├── home_page.feature
            ├── apply_loan.feature
            └── track_application.feature
```

### Running the E2E tests

Both the backend and frontend must be running before executing E2E tests.

```bash
# Terminal 1 — backend
cd backend && mvn spring-boot:run

# Terminal 2 — frontend
cd frontend && npm run dev

# Terminal 3 — E2E tests (headless Chrome)
cd e2e && mvn test

# With a visible browser window
cd e2e && mvn test -Dheadless=false

# Against a different base URL (e.g. staging)
cd e2e && mvn test -Dbase.url=http://localhost:3000
```

HTML report is generated at `e2e/target/cucumber-report.html`.

### Scenarios — 7 total

#### `home_page.feature` (3 scenarios)

| Scenario | What it verifies |
|----------|-----------------|
| Home page displays both action cards | Both "Apply for a Loan" and "Track Your Application" cards are visible |
| Navigate to Apply page | Clicking the Apply card opens `/apply` with correct heading |
| Navigate to Track page | Clicking the Track card opens `/track` with correct heading |

#### `apply_loan.feature` (2 scenarios)

| Scenario | What it verifies |
|----------|-----------------|
| Full loan application submission | 3-step form completes successfully, "Application Submitted!" shown, `CAR-` tracking ID displayed |
| Validation errors on empty step 1 | Clicking Continue without input shows at least one validation error |

#### `track_application.feature` (2 scenarios)

| Scenario | What it verifies |
|----------|-----------------|
| Track a submitted application | After submitting, entering the tracking ID shows applicant name and "Submitted" status |
| Unknown tracking ID shows error | Entering a non-existent tracking ID displays an error message |

---

## Docker Deployment

```bash
# Build and start both services
docker compose up --build

# Frontend available at http://localhost
# Backend available at http://localhost:8080
```

The `frontend` service waits for the `backend` health check to pass before starting. Nginx serves the built React SPA and reverse-proxies `/api` requests to the backend container.

To run with a persistent database in production, set `DATABASE_URL` to a PostgreSQL JDBC URL and update `spring.jpa.hibernate.ddl-auto` to `update`.
