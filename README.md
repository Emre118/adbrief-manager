# AdBrief Manager: Campaign Brief Tracker

AdBrief Manager is a full-stack web application for managing advertising campaign briefs. Users can register, log in, and manage only their own campaign brief records. The project was built for the System Analysis and Design course requirements: CRUD operations, REST API, JWT authentication, data isolation, Vanilla JavaScript SPA frontend, input validation, Swagger documentation, unit tests, and modular backend logic.

## Project Overview

The purpose of AdBrief Manager is to help users organize advertising campaign brief information in a simple web-based system. A campaign brief includes details such as title, brand, platform, objective, budget, deadline, priority, status, and notes.

The system uses a Node.js/Express backend with a SQLite database and a Vanilla JavaScript frontend. The backend exposes REST API endpoints, validates input, protects private routes with JWT authentication, and ensures that users can only access campaign briefs that belong to their own account.

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

## JWT Authentication

Authentication is handled with JSON Web Tokens.

1. A user registers or logs in with an email and password.
2. The backend validates the credentials.
3. On successful login, the backend returns a JWT.
4. The frontend stores the token and sends it with protected API requests.
5. Protected backend routes verify the token before returning or modifying campaign brief data.

Protected requests use this header format:

```txt
Authorization: Bearer <token>
```

Passwords are stored as hashes using `bcryptjs`; plain-text passwords are not stored in the database.

## User-Specific Data Isolation

Every campaign brief is linked to the authenticated user through `user_id`. The backend uses the user ID from the verified JWT token when listing, creating, reading, updating, deleting, and summarizing campaign briefs.

This means:

- User 1 can only see User 1's campaign briefs.
- User 2 can only see User 2's campaign briefs.
- A user cannot update or delete a campaign brief owned by another user.
- Summary counts are calculated only from the logged-in user's own records.

This behavior is enforced in backend service queries, not only in the frontend interface.

## CRUD Operations

The campaign brief module supports the full CRUD lifecycle:

| Operation | What it does | API endpoint |
|---|---|---|
| Create | Adds a new campaign brief for the authenticated user | `POST /api/briefs` |
| Read | Lists briefs or opens one specific brief owned by the user | `GET /api/briefs`, `GET /api/briefs/:id` |
| Update | Edits an existing brief owned by the user | `PUT /api/briefs/:id` |
| Delete | Removes an existing brief owned by the user | `DELETE /api/briefs/:id` |

The list endpoint also supports search and filtering:

```txt
GET /api/briefs?search=nike&status=Ready&platform=Meta&priority=High
```

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
  screenshots/
    project screenshots for presentation/reporting
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

## Swagger Testing Flow

Swagger UI can be used to inspect and manually test the API.

1. Start the backend with `npm run dev` or `npm start`.
2. Open `http://localhost:3000/api-docs`.
3. Use the auth section to review the register and login endpoints.
4. Register or log in through the application or API.
5. Copy the returned JWT token.
6. In Swagger UI, authorize protected requests with `Bearer <token>`.
7. Test campaign brief endpoints such as list, create, update, delete, and summary.

Protected campaign brief endpoints require a valid JWT token.

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

## Unit Testing

The project uses Jest for backend unit tests.

Run tests from the backend folder:

```bash
cd backend
npm test
```

The current tests focus on validation rules and business logic functions. They help confirm that important backend behavior continues to work when the project changes.

## Demo Checklist

Use this checklist for a System Analysis and Design course presentation:

- Introduce the project purpose and technology stack.
- Register a new user.
- Log in and explain the JWT token flow.
- Create a campaign brief.
- View the campaign brief list and dashboard summary.
- Edit an existing campaign brief.
- Delete a sample campaign brief.
- Demonstrate search and filtering by text, status, platform, or priority.
- Log in as `user1@example.com` and create user-specific records.
- Log in as `user2@example.com` and show that user1's records are not visible.
- Open Swagger UI at `http://localhost:3000/api-docs`.
- Run `npm test` from the backend folder and show the Jest test result.

## Screenshots

Project screenshots for the course report or presentation can be stored in a root-level `screenshots/` folder.

Suggested screenshots:

- Login/register screen
- Dashboard or campaign brief list
- Create/edit campaign brief form
- Search and filter result
- Swagger UI page
- Unit test terminal output

## Important Design Decisions

- Routes only handle HTTP requests and responses.
- Business logic is placed in service files.
- Input validation is separated into validator files.
- JWT authentication middleware protects campaign brief routes.
- Every campaign brief database operation is scoped by `user_id`.
- The frontend is a single-page application using `fetch` and does not use React, Vue, Angular, or another frontend framework.
