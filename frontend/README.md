# TransactGuard

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.5.

## PrimeNG license configuration

Use Node.js compatible with Angular (Node.js 24 is supported) and npm 11.16.0.
Install dependencies with `npm ci`, then prepare your local configuration:

```sh
cp .env.example .env
```

Set `PRIMENG_LICENSE_KEY` in `.env` to your own PrimeUI license key. In CI, supply
`PRIMENG_LICENSE_KEY` as an environment variable; it takes precedence over `.env`.
Do not commit the real key. Both `.env` and `src/environments/environment.generated.ts`
are ignored by Git. Only `.env.example` with an empty value is versioned.

The npm lifecycle scripts generate the Angular configuration before start, build,
watch, and test. A missing or empty key stops the command with a configuration error.
Use `npm start`, `npm run build`, `npm run watch`, and `npm test -- --watch=false`.
After changing the key, restart the command. If invoking Angular CLI directly, run
`npm run generate:environment` first.

The license is embedded in the browser bundle because PrimeNG consumes it on the
client. This setup prevents committing it to Git; it does not make it a server-side
secret. Never use this mechanism for database passwords or private API credentials.
See [Angular environment guidance](https://angular.dev/tools/cli/environments).

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
npm test -- --watch=false
```

## Running end-to-end tests

No end-to-end test framework is configured in this project.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
