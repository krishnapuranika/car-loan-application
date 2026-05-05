# Project Intent

## Original Requirement

> *"I want to build a car loan application. Two screens, one accepting basic details for a car loan and another application to track the application. The home page can contain two links or icons, one to create new application and another to track the application. You can use Spring Boot and React to create the application."*

---

## What Was Asked For

### Application Type
A web-based car loan application.

### Technology
- **Backend:** Spring Boot
- **Frontend:** React

### Screens

| Screen | Purpose |
|--------|---------|
| **Home page** | Entry point with two links or icons — one to start a new loan application, one to track an existing one |
| **Apply screen** | A form that accepts the basic details needed for a car loan |
| **Track screen** | A view where the user can check the status of an application they have already submitted |

### Home Page
The home page should provide clear navigation to both actions:
- Create a new loan application
- Track an existing application

---

## How the Requirement Was Interpreted and Built

| Requirement | Implementation |
|-------------|---------------|
| Home page with two links/icons | Landing page (`/`) with two card-style links — "Apply for a Loan" and "Track Your Application" |
| Screen to accept basic details | 3-step form at `/apply` covering personal info, financial info, and vehicle & loan details |
| Screen to track the application | Tracking page at `/track` where users enter their Tracking ID to see the current status and a progress timeline |
| Spring Boot backend | REST API with two endpoints — `POST /api/v1/applications` (submit) and `GET /api/v1/applications/{trackingId}` (track) |
| React frontend | Single-page application using React 18, React Router, and Tailwind CSS |
