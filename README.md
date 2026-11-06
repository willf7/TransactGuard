# TransactGuard

Web application for managing financial transaction disputes.

## Repository

- `backend/`: Java 21 and Spring Boot API with Oracle, JPA, and Flyway.
- `frontend/`: Angular application with TypeScript and SCSS.
- `docs/`: technical documentation (created as needed).

## Development

Use JDK 21 and Docker for the backend. From `backend/`:

```sh
./mvnw verify
./mvnw spring-boot:test-run
```

The test runner starts Oracle through Testcontainers. Running `./mvnw spring-boot:run`
requires an externally configured database.

Use a Node.js version compatible with Angular and npm 11.16.0. From `frontend/`:

```sh
npm ci
npm start
npm run build
npm test -- --watch=false
```

See `AGENTS.md` for repository conventions and validation requirements.
Neither area currently has lint configured. No end-to-end test runner is configured.
