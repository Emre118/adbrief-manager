# AdBrief Manager: Campaign Brief Tracker

AdBrief Manager is a full-stack web application for managing advertising campaign briefs. Users can register, log in, and manage only their own campaign brief records. The project was built for the System Analysis and Design course requirements: CRUD operations, REST API, JWT authentication, data isolation, Vanilla JavaScript SPA frontend, input validation, Swagger documentation, unit tests, and modular backend logic.

## Main Features

- User registration and login with JWT authentication
- User-specific data isolation: each user can only view, create, update, and delete their own campaign briefs
- Full CRUD operations for campaign briefs
- Search and filter by status, platform, priority, and text query
- Dashboard summary showing campaign brief counts by status
- RESTful API using JSON request/response format
- Swagger UI for interactive API documentation
- Frontend SPA built with Vanilla JavaScript, HTML, and CSS
- Backend validation and frontend validation
- Unit tests for validation and business logic

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | SQLite |
| Authentication | JWT, bcryptjs |
| API Documentation | Swagger UI |
| Testing | Jest |

## Project Structure

```txt
adbrief-manager/
  backend/
    src/
      app.js
      server.js
      db.js
      config.js
      controllers/
      middleware/
      routes/
      services/
      validators/
      swagger/
      utils/
    tests/
    package.json
    .env.example
  frontend/
    index.html
    styles.css
    app.js
  README.md
  .gitignore
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Emre118/adbrief-manager.git
cd adbrief-manager
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Create environment file

Copy `.env.example` to `.env`.

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Default `.env` values:

```txt
PORT=3000
JWT_SECRET=replace_this_with_a_long_secret
DB_FILE=./database.sqlite
```

### 4. Run the application

```bash
npm run dev
```

Or:

```bash
npm start
```

Then open:

```txt
http://localhost:3000
```

Swagger API documentation:

```txt
http://localhost:3000/api-docs
```

## How to Demonstrate User-Specific Data Isolation

1. Register as `user1@example.com`.
2. Create two campaign briefs.
3. Log out.
4. Register as `user2@example.com`.
5. Check the dashboard: user2 should not see user1's briefs.
6. Create a new brief as user2.
7. Log back in as user1: user1 should still only see user1's own records.

This behavior is enforced in the backend using the authenticated user's ID from the JWT token. All brief queries include `user_id = authenticatedUserId`.

## API Endpoints

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in and receive JWT token |

### Campaign Briefs

All campaign brief endpoints require the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/briefs` | List authenticated user's briefs |
| GET | `/api/briefs/:id` | Get one brief owned by the authenticated user |
| POST | `/api/briefs` | Create a new campaign brief |
| PUT | `/api/briefs/:id` | Update a campaign brief |
| DELETE | `/api/briefs/:id` | Delete a campaign brief |
| GET | `/api/briefs/summary` | Get dashboard summary |

Example filter request:

```txt
GET /api/briefs?search=nike&status=Ready&platform=Meta&priority=High
```

## Campaign Brief Fields

| Field | Type | Required | Example |
|---|---|---|---|
| title | string | Yes | Spring Sale Campaign |
| brandName | string | Yes | Nova Shoes |
| platform | string | Yes | Meta |
| objective | string | Yes | Sales |
| budget | number | Yes | 5000 |
| startDate | date | No | 2026-05-20 |
| deadline | date | Yes | 2026-05-25 |
| targetAudience | string | No | 18-34 online shoppers |
| priority | string | Yes | High |
| status | string | Yes | In Progress |
| notes | string | No | Prepare creative variations |

Allowed values:

- Platform: `Meta`, `Google`, `TikTok`, `LinkedIn`, `Other`
- Objective: `Awareness`, `Traffic`, `Leads`, `Sales`
- Priority: `Low`, `Medium`, `High`
- Status: `Draft`, `In Progress`, `Ready`, `Published`, `Archived`

## Run Tests

```bash
cd backend
npm test
```

The tests focus on validation rules and business logic functions, not route testing.

## Important Design Decisions

- Routes only handle HTTP requests and responses.
- Business logic is placed in service files.
- Input validation is separated into validator files.
- JWT authentication middleware protects campaign brief routes.
- Every campaign brief database operation is scoped by `user_id`.
- The frontend is a single-page application using `fetch` and does not use React, Vue, Angular, or another frontend framework.
