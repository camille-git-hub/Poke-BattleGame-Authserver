# Poke-BattleGame-Authserver
Auth server for Pokemon!

Auth server:
 - only place that knows passwords and issues tokens.
 - register users
 - login users
 - access jwt shortlived
 - refresh jwt long-lived, stored in in db for revocation/rotation
 
Frontend:
 - allows to input password and send it over to Auth.

Backend:
 - Never handles auth.
 - verifies access tokens
 - userId for Crud

## Zod validation

Request validation is handled in middleware before controllers run.

- Schemas live in `src/schemas/authSchemas.ts`
- Middleware lives in `src/middleware/validate.ts`
- Routes use `validateBody(schema)` before the controller

Current validated routes:

- `POST /auth/register` with `{ "email": string, "password": string }`
- `POST /auth/login` with `{ "email": string, "password": string }`

If validation fails, the server responds with HTTP 400:

```json
{
	"message": "Validation failed",
	"errors": [
		{ "path": "email", "message": "Valid email required" }
	]
}
```

