**Authorization Policy**

- **401 Unauthorized**: Use when the request is unauthenticated — i.e. the client did not provide valid credentials (missing token, malformed token, expired or invalid token).
- **403 Forbidden**: Use when the request is authenticated but the authenticated principal is not allowed to perform the requested action (lack of role, ownership, or permissions).

Guidelines:
- Authentication checks must live in `auth.middleware` (HTTP) and `socketAuth` (Socket.IO). These return 401 for missing/invalid credentials.
- Authorization checks (permission/ownership) should be implemented as small middleware or inline checks in controllers; they must return 403 when the authenticated user lacks permission.
- Error responses should be JSON: `{ message: string }` for HTTP. Do not leak stack traces in production.

Examples:
- Missing token: 401 `{ message: "Token not provided or invalid" }`
- Valid token but trying to access another user's private resource: 403 `{ message: "Forbidden" }`
