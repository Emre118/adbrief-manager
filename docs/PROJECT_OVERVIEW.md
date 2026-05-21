# Project Overview

## Project Summary

**AdBrief Manager: Campaign Brief Tracker** is a full-stack web application for
managing advertising campaign briefs. It allows users to register, log in, and
create, view, update, delete, search, and filter campaign brief records.

The project is designed for a System Analysis and Design course presentation. It
demonstrates a complete small information system with authentication, CRUD
operations, business validation, persistent storage, API documentation, and unit
tests.

## Main Entity: Campaign Brief

The main business entity is the **Campaign Brief**.

A campaign brief represents the key information needed to plan, track, and
manage an advertising campaign. Each brief belongs to one authenticated user and
is stored in the database as a record in the `campaign_briefs` table.

## Fields of a Campaign Brief

| Field | Description | Required |
|---|---|---|
| `id` | Unique campaign brief ID | Yes |
| `userId` | Owner user ID from the authenticated account | Yes |
| `title` | Campaign brief title | Yes |
| `brandName` | Brand or client name | Yes |
| `platform` | Advertising platform, such as Meta, Google, TikTok, LinkedIn, or Other | Yes |
| `objective` | Campaign objective, such as Awareness, Traffic, Leads, or Sales | Yes |
| `budget` | Campaign budget amount | Yes |
| `startDate` | Optional campaign start date | No |
| `deadline` | Required campaign deadline | Yes |
| `targetAudience` | Optional target audience description | No |
| `priority` | Priority level: Low, Medium, or High | Yes |
| `status` | Workflow status: Draft, In Progress, Ready, Published, or Archived | Yes |
| `notes` | Optional notes for campaign planning | No |
| `createdAt` | Record creation timestamp | Yes |
| `updatedAt` | Last update timestamp | Yes |

## User-Specific Data Isolation

The application protects campaign brief data by associating every brief with a
specific user account.

When a user logs in, the backend returns a JWT token. Protected campaign brief
routes require that token. The backend reads the authenticated user ID from the
token and uses it when querying the database.

Examples of this isolation:

- Listing briefs only returns records where `user_id` matches the logged-in user.
- Getting one brief checks both the brief ID and the authenticated `user_id`.
- Updating a brief only works if the brief belongs to the current user.
- Deleting a brief only works if the brief belongs to the current user.
- Dashboard summary counts are calculated only for the current user.

This means `user1@example.com` and `user2@example.com` can use the same system
without seeing or changing each other's campaign briefs.

## Backend Architecture

The backend is built with Node.js and Express.js. It follows a modular structure
so each part of the system has a clear responsibility.

Main backend files and folders:

- `src/server.js`: Starts the backend server.
- `src/app.js`: Configures Express middleware, routes, Swagger, static frontend
  hosting, and fallback routing.
- `src/db.js`: Initializes the SQLite database and creates required tables.
- `src/config.js`: Loads configuration such as port, JWT secret, and database
  file path.
- `src/routes/`: Defines API route paths for authentication and campaign briefs.
- `src/controllers/`: Handles HTTP request and response logic.
- `src/services/`: Contains business logic for authentication and campaign
  brief operations.
- `src/validators/`: Validates user input before data is saved.
- `src/middleware/authMiddleware.js`: Verifies JWT tokens for protected routes.
- `src/swagger/`: Configures Swagger API documentation.
- `src/utils/`: Provides shared error handling utilities.

Important backend routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/briefs`
- `POST /api/briefs`
- `GET /api/briefs/:id`
- `PUT /api/briefs/:id`
- `DELETE /api/briefs/:id`
- `GET /api/briefs/summary`

## Frontend Architecture

The frontend is a Vanilla JavaScript single-page application served by the
Express backend.

Frontend files:

- `frontend/index.html`: Main page structure.
- `frontend/styles.css`: Visual styling and layout.
- `frontend/app.js`: Client-side application logic.

The frontend handles:

- Register and login forms
- JWT token storage and logout behavior
- Fetch requests to backend API endpoints
- Campaign brief list rendering
- Create, edit, and delete interactions
- Search and filter controls
- Dashboard summary display
- Client-side validation and user feedback

Because the frontend is served from the backend, the application can be opened at
`http://localhost:3000` after the backend starts.

## Database Tables

The project uses SQLite for persistent storage.

### `users`

Stores registered user accounts.

| Column | Purpose |
|---|---|
| `id` | Primary key |
| `name` | User's display name |
| `email` | Unique login email |
| `password_hash` | Hashed password created with bcryptjs |
| `created_at` | Account creation timestamp |

### `campaign_briefs`

Stores campaign brief records.

| Column | Purpose |
|---|---|
| `id` | Primary key |
| `user_id` | Foreign key linking the brief to a user |
| `title` | Campaign title |
| `brand_name` | Brand/client name |
| `platform` | Advertising platform |
| `objective` | Campaign objective |
| `budget` | Campaign budget |
| `start_date` | Optional start date |
| `deadline` | Required deadline |
| `target_audience` | Optional audience description |
| `priority` | Priority level |
| `status` | Campaign workflow status |
| `notes` | Optional notes |
| `created_at` | Creation timestamp |
| `updated_at` | Last update timestamp |

The `campaign_briefs.user_id` column references `users.id` and uses cascade
delete behavior, so a user's briefs are removed if that user record is deleted.

## Requirement Mapping for System Analysis and Design

| Requirement | Project Implementation |
|---|---|
| User authentication | Register and login endpoints with hashed passwords and JWT |
| Authorization | JWT middleware protects campaign brief routes |
| CRUD operations | Campaign briefs can be created, read, updated, and deleted |
| Data persistence | SQLite database stores users and campaign briefs |
| User-specific records | Every campaign brief is scoped by authenticated `user_id` |
| Input validation | Backend validators enforce required fields and allowed values |
| Search and filtering | Brief list supports search, status, platform, and priority filters |
| Dashboard/reporting | Summary endpoint returns counts by status for the current user |
| REST API | Express routes expose JSON API endpoints |
| API documentation | Swagger UI is available at `/api-docs` |
| Frontend interface | Vanilla JavaScript SPA provides user-facing workflows |
| Testing | Jest tests cover validation and business logic |
| Modular design | Routes, controllers, services, validators, middleware, and utilities are separated |

## Why the Project Is Useful

AdBrief Manager is useful because campaign planning often involves many details:
brand names, platforms, objectives, budgets, deadlines, priorities, and current
statuses. Keeping this information in one structured system helps users avoid
lost notes, unclear ownership, and missed deadlines.

For the course project, it is also useful because it demonstrates the core parts
of a real information system:

- A clear domain entity
- Secure user access
- Persistent database storage
- Business rules and validation
- API-based architecture
- A usable frontend
- Documentation and tests

The result is small enough to present clearly, but complete enough to show how a
real web application is designed and implemented.
