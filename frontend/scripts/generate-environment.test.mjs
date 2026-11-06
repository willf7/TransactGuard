import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

function setup(t) {
  const root = mkdtempSync(join(tmpdir(), 'transactguard-env-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'scripts'));
  const script = join(root, 'scripts/generate-environment.mjs');
  copyFileSync(new URL('./generate-environment.mjs', import.meta.url), script);
  const env = { ...process.env };
  delete env.PRIMENG_LICENSE_KEY;
  return {
    writeEnv: (value) => writeFileSync(join(root, '.env'), value),
    run: (overrides = {}) =>
      spawnSync(process.execPath, [script], {
        env: { ...env, ...overrides },
        encoding: 'utf8',
      }),
    readLicense: () => {
      const source = readFileSync(join(root, 'src/environments/environment.generated.ts'), 'utf8');
      const json = source.split('export const environment = ')[1].replace(/ as const;\n$/, '');
      return JSON.parse(json).primeNgLicenseKey;
    },
  };
}

test('rejects a missing key with a configuration error', (t) => {
  const fixture = setup(t);
  const result = fixture.run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Set PRIMENG_LICENSE_KEY/);
});

test('loads the license from the local .env file', (t) => {
  const fixture = setup(t);
  fixture.writeEnv('PRIMENG_LICENSE_KEY=local-test-license\n');
  assert.equal(fixture.run().status, 0);
  assert.equal(fixture.readLicense(), 'local-test-license');
});

test('prefers the process value and safely serializes special characters', (t) => {
  const fixture = setup(t);
  fixture.writeEnv('PRIMENG_LICENSE_KEY=local-test-license\n');
  const license = 'test-quote-"-backslash-\\-newline-\n-end';
  assert.equal(fixture.run({ PRIMENG_LICENSE_KEY: license }).status, 0);
  assert.equal(fixture.readLicense(), license);
});

test('rejects an empty process value instead of using the local key', (t) => {
  const fixture = setup(t);
  fixture.writeEnv('PRIMENG_LICENSE_KEY=local-test-license\n');
  const result = fixture.run({ PRIMENG_LICENSE_KEY: '   ' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Set PRIMENG_LICENSE_KEY/);
});
