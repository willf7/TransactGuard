# TransactGuard Constitution

TransactGuard is a web application for managing financial transaction disputes.
The terms MUST and MUST NOT define mandatory requirements throughout this constitution.

## Core Principles

### I. Modular Monolith and Clear Responsibilities

- The backend MUST remain a modular monolith, with modules organized around business
  capabilities and explicit boundaries. Cross-module collaboration MUST use service contracts
  rather than access another module's repositories or persistence internals.
- Controllers MUST remain thin: they handle HTTP input, invoke services, and construct HTTP
  responses. They MUST NOT implement business rules or access repositories directly.
- Services MUST implement business rules and coordinate use cases. Runtime database access
  MUST pass through repositories; controllers and services MUST NOT directly use database
  connections, SQL execution APIs, or an entity manager.
- Solutions MUST apply KISS, YAGNI, DRY, and SOLID proportionally. New abstractions and
  dependencies MUST address a documented current need.

These boundaries keep business behavior independently testable and prevent persistence and
transport concerns from spreading across the application.

### II. Explicit and Consistent API Contracts

- Every application endpoint MUST have the public prefix `/api`, exactly once. Exposed
  framework-managed endpoints MUST also respect that prefix.
- Request and response payloads MUST use dedicated DTOs defined as Java records.
  Persistence entities MUST NOT be exposed as API payloads. Request records MUST declare
  applicable Jakarta Bean Validation constraints, and API boundaries MUST trigger validation.
  Services MUST enforce business invariants independently of HTTP validation.
- API exception handling MUST be centralized in a `@RestControllerAdvice` using Spring's
  `ProblemDetail` representation. Every error response MUST use `application/problem+json`
  and include `type`, `title`, `status`, `detail`, and `instance`.
- The HTTP status MUST match `status` in the body and represent the failure correctly:
  malformed or invalid input uses 400, missing authentication uses 401, forbidden access
  uses 403, missing resources use 404, business state conflicts use 409, and unexpected
  server failures use 500. Other failures MUST use the applicable HTTP status semantics.
- Validation problems MUST additionally include `errors`, a list of objects each containing
  `field` and `message`. Client-visible validation messages MUST be meaningful and MUST NOT
  expose rejected sensitive values.
- Errors produced outside controller advice, including security and framework handlers,
  MUST conform to the same problem response contract.
- Responses, logs, tests, and documentation MUST NOT expose credentials or sensitive
  financial or personal data. Unexpected errors MUST return a safe message rather than
  stack traces, SQL details, or internal implementation information.

A single error contract makes frontend handling predictable and prevents accidental disclosure.

### III. Controlled Persistence and Schema Evolution

- Oracle Database MUST be the application database. JPA through repositories MUST provide
  runtime persistence access.
- Every application schema change MUST be represented by a versioned Flyway migration.
  Automatic JPA schema creation or mutation MUST NOT replace Flyway migrations.
- Applied migrations MUST NOT be edited or deleted. Schema corrections and evolution MUST
  use new migrations that preserve migration history.
- Flyway migrations MUST be validated against Oracle through integration tests whenever
  persistence behavior or the schema changes.

Versioned migrations make database evolution reproducible across environments.

### IV. Behavior-Based Test Coverage

- Every business rule MUST have unit tests covering its expected result, relevant rejection
  cases, and boundary conditions. Line coverage alone MUST NOT be treated as proof that a
  rule is tested.
- Backend unit tests MUST use JUnit and MUST isolate external dependencies. Mockito MUST
  be used when test doubles are needed; unit tests MUST NOT require a database or network.
- Every endpoint, identified by its HTTP method and path, MUST have at least one happy-path
  integration test exercising request handling, validation, services, and response serialization
  together. Mocking the service under test does not satisfy this integration requirement.
- Integration tests involving persistence MUST use Testcontainers with Oracle and apply
  the application's Flyway migrations. An in-memory database MUST NOT substitute for Oracle
  in these tests.
- Changes to error handling or validation MUST include tests for the affected status codes,
  required problem fields, and validation error structure. Bug fixes MUST include a
  regression test whenever the failure can be reproduced in an automated test.

These requirements verify business decisions and the HTTP and database boundaries that unit
tests alone cannot validate.

### V. Consistent Naming and Language

- Source-code identifiers MUST use English. Variables, parameters, methods, functions, and
  record components MUST use `camelCase`; classes, interfaces, records, enums, and TypeScript
  types MUST use `PascalCase`; constants MUST use `UPPER_SNAKE_CASE`.
- File names, framework-required identifiers, and external contract names MUST follow the
  applicable framework or contract convention while retaining English terminology.
- All client-visible error messages MUST use Brazilian Portuguese (`pt-BR`), including
  problem `title`, problem `detail`, and validation `errors[].message`. Framework defaults
  MUST be customized when necessary to meet this requirement.
- Machine-readable keys, type identifiers, URI values, and validation field paths MUST
  remain stable and MUST NOT be translated into human-readable messages.
- This constitution MUST use English. Operational repository guidance and commands belong
  in `AGENTS.md` rather than being duplicated here.

Consistent identifiers support maintenance while localized errors serve application users.

## Technology and Repository Constraints

- Frontend: Angular, TypeScript, SCSS, and PrimeNG.
- Backend: Java 21 and Spring Boot; JUnit, Mockito, and Testcontainers for backend testing.
- Persistence: Oracle Database, JPA, and Flyway.
- Repository: a monorepo with `frontend/` for the web application, `backend/` for the API,
  `specs/` for feature specifications and planning artifacts, and `docs/` for technical
  documentation and decisions. `.specify/` holds Spec Kit configuration, templates, and
  this constitution at `.specify/memory/constitution.md`.

These technologies and architectural constraints MUST guide new work. A dependency declared
here does not imply that it is already installed. Missing setup MUST be planned explicitly
before implementing work that requires it. Exact versions other than Java 21 belong in build
configuration and lockfiles; changing a mandated technology requires a constitutional amendment.

## Development Workflow and Quality Gates

- Feature specifications MUST define observable behavior and acceptance criteria. Plans MUST
  identify module boundaries, API contracts, persistence changes, and tests as applicable.
- Every implementation plan MUST include a Constitution Check before implementation begins.
  Any conflict MUST be resolved by revising the plan; implementation MUST NOT proceed with
  an unresolved constitutional violation.
- Reviews MUST verify module and layer boundaries, DTO validation, problem responses,
  naming and language, migration safety, and the required tests for the affected behavior.
- Before completion, code changes MUST pass the relevant build and tests and all configured
  lint checks. Missing tooling, blocked checks, and failures MUST be reported explicitly;
  a build MUST NOT be presented as a substitute for lint.
- Observable behavior, API contracts, configuration, and architecture changes MUST update
  the relevant specifications and documentation in the same delivery.
- Documentation-only changes require consistency and reference checks; application builds
  and tests are not required unless executable behavior also changes.

## Governance

This constitution is the authoritative source for project principles and quality requirements.
Specifications, plans, tasks, implementation, and repository guidance MUST comply with it.
Existing code or missing tooling does not waive a requirement; gaps affecting proposed work
MUST be identified and addressed in its plan.

When an implementation plan conflicts with this constitution, the plan MUST change. The
constitution MUST NOT be weakened or changed as a side effect of implementing a feature.

An amendment requires an explicit governance request, a written rationale, an impact review
covering affected specifications and implementation, and approval by the project maintainer
before adoption. The amendment MUST document any required migration or follow-up work.
Constitution changes MUST be committed separately from application implementation changes.

Constitution versions MUST follow semantic versioning:

- MAJOR: removal or incompatible redefinition of a principle or governance requirement.
- MINOR: addition of a principle or section, or a material expansion of requirements.
- PATCH: clarifications, wording corrections, or other changes without altered obligations.

Every amendment MUST update the version and last-amended date while preserving the original
ratification date. Every plan and pull request MUST be reviewed for constitutional compliance;
violations block acceptance until the plan or implementation is corrected. Operational
instructions, tool commands, and repository-specific review procedures remain in `AGENTS.md`.

**Version**: 1.0.0 | **Ratified**: 2026-11-05 | **Last Amended**: 2026-11-05
