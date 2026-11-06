# TransactGuard

Web application for managing financial transaction disputes.

## Repository

- `backend/`: Java 21 and Spring Boot API with Oracle, JPA, and Flyway.
- `frontend/`: Angular application with TypeScript, SCSS, and PrimeNG.
- `docs/`: technical documentation (created as needed).
- `specs/`: feature specifications, plans, and tasks (created with the first feature).
- `.specify/`: Spec Kit configuration, scripts, templates, and workflows.
- `.agents/skills/speckit-*/`: Spec Kit skills for Codex.

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
cp .env.example .env
# Set PRIMENG_LICENSE_KEY in .env before continuing.
npm start
npm run build
npm test -- --watch=false
```

The local license and generated Angular configuration are ignored by Git. In CI, supply
`PRIMENG_LICENSE_KEY` through the process environment. See `frontend/README.md` for setup
and browser visibility details.

See `AGENTS.md` for repository conventions and validation requirements.
Neither area currently has lint configured. No end-to-end test runner is configured.
