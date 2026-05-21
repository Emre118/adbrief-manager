# AdBrief Manager Demo Script

## 1. Project Introduction

Introduce the project as **AdBrief Manager: Campaign Brief Tracker**.

Explain that the application helps advertising teams manage campaign briefs in
one place. Users can register, log in, create campaign briefs, update them,
search/filter them, and view only their own records.

Mention the main course-related system features:

- Full CRUD operations
- REST API backend
- JWT authentication
- User-specific data isolation
- SQLite database
- Vanilla JavaScript frontend
- Swagger API documentation
- Unit tests for validation and business logic

## 2. Register/Login Demo

Open the application:

```txt
http://localhost:3000
```

Demo flow:

1. Show the login/register screen.
2. Register a new user, for example `user1@example.com`.
3. Log in with the created account.
4. Point out that the dashboard and campaign brief features are available only
   after authentication.
5. Log out and log back in to show the normal login flow.

Presentation note:

> This demonstrates the authentication entry point of the system. A user must
> have an account and a valid login before accessing protected campaign brief
> features.

## 3. JWT Authentication Explanation

Explain the JWT flow at a high level:

1. The user submits email and password.
2. The backend verifies the credentials.
3. If valid, the backend returns a JWT token.
4. The frontend stores the token.
5. Future protected API requests include the token in the authorization header.
6. The backend validates the token before allowing access.

Example protected request concept:

```txt
Authorization: Bearer <jwt-token>
```

Presentation note:

> JWT allows the backend to identify the currently logged-in user without asking
> for the password on every request.

## 4. Campaign Brief CRUD Demo

After logging in as `user1@example.com`, demonstrate CRUD operations.

Create:

1. Click the option to add a new campaign brief.
2. Enter example data such as:
   - Title: Spring Sale Campaign
   - Brand: Nova Shoes
   - Platform: Meta
   - Objective: Sales
   - Budget: 5000
   - Priority: High
   - Status: Draft
3. Save the brief.
4. Show that the new brief appears in the list/dashboard.

Read:

1. Open or view the created campaign brief.
2. Explain that data is loaded from the backend API.

Update:

1. Edit the brief.
2. Change the status from `Draft` to `In Progress` or `Ready`.
3. Save the update.
4. Show that the updated value appears immediately.

Delete:

1. Create a temporary brief if needed.
2. Delete it.
3. Show that it is removed from the list.

Presentation note:

> These steps demonstrate the complete Create, Read, Update, and Delete
> lifecycle required for the system.

## 5. Search and Filter Demo

Use existing campaign briefs or create a few sample records with different
statuses, platforms, and priorities.

Demo flow:

1. Search by a keyword in the campaign title or brand name.
2. Filter by status, such as `Draft`, `Ready`, or `Published`.
3. Filter by platform, such as `Meta`, `Google`, or `TikTok`.
4. Filter by priority, such as `High`.
5. Clear the filters and show the full list again.

Presentation note:

> Search and filters make the system useful when a user has many campaign
> briefs. They support faster retrieval and better campaign tracking.

## 6. User-Specific Data Isolation Demo

This part demonstrates that users can only access their own campaign briefs.

User 1 flow:

1. Log in as `user1@example.com`.
2. Create two campaign briefs.
3. Show that both briefs appear in user1's list.
4. Log out.

User 2 flow:

1. Register or log in as `user2@example.com`.
2. Show that user2 does not see user1's campaign briefs.
3. Create one new campaign brief as user2.
4. Log out.

Return to user1:

1. Log back in as `user1@example.com`.
2. Show that user1 still sees only user1's own campaign briefs.
3. Confirm that user2's brief is not visible.

Presentation note:

> The backend uses the authenticated user ID from the JWT token and scopes
> campaign brief database queries to that user. This protects each user's data
> from being accessed by other accounts.

## 7. Swagger UI Demo

Open Swagger UI:

```txt
http://localhost:3000/api-docs
```

Demo flow:

1. Show the available API sections, such as authentication and campaign briefs.
2. Open the register or login endpoint documentation.
3. Show the request body format and response format.
4. Open a campaign brief endpoint.
5. Explain that protected endpoints require a JWT bearer token.

Presentation note:

> Swagger UI documents the REST API and makes it easier for developers and
> reviewers to understand the available endpoints, inputs, and responses.

## 8. Unit Test Demo

Open a terminal in the backend folder:

```bash
cd backend
npm test
```

Demo flow:

1. Run the test command.
2. Show that the Jest tests execute.
3. Explain that the tests focus on validation rules and business logic.
4. Connect this to reliability and maintainability.

Presentation note:

> Unit tests help verify that important backend rules continue to work as the
> system changes. For this project, they support confidence in validation and
> business logic behavior.

## Closing Summary

End the presentation by summarizing the main system achievements:

- Users can securely register and log in.
- JWT protects private routes.
- Campaign briefs support full CRUD operations.
- Search and filters help users manage many records.
- Data is isolated per user.
- Swagger documents the API.
- Unit tests verify important backend logic.
