#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { readFileSync, writeFileSync, statSync, closeSync, openSync } from 'node:fs';
import { parse, stringify } from 'envfile';

const JWT_RS256_PUB_KEY = 'JWT_RS256_PUB_KEY';
const JWT_RS256_KEY = 'JWT_RS256_KEY';

execFileSync('bash', ['./scripts/jwtrs256.sh'], { cwd: process.cwd(), stdio: 'inherit' });

const envfile = resolve(process.cwd(), process.env.ENV_FILE || '.env');
const pubkfile = resolve(process.cwd(), '.keychain/JWTRS256.key.pub');
const pkfile = resolve(process.cwd(), '.keychain/JWTRS256.key');

try {
  if (!statSync(envfile).isFile()) {
    console.error(`"${envfile}" must be a file`);
    process.exit(1);
  }
} catch {
  closeSync(openSync(envfile, 'w'));
}

const env_data = readFileSync(envfile);
const pubk_data = readFileSync(pubkfile);
const pk_data = readFileSync(pkfile);

const parsed_env = parse(env_data);

const format = (data) => '"' + data.trim().replace(/\n|\r\n/g, '\\n') + '"\n';

parsed_env[JWT_RS256_PUB_KEY] = format(pubk_data.toString('utf-8'));
parsed_env[JWT_RS256_KEY] = format(pk_data.toString('utf-8'));

writeFileSync(envfile, stringify(parsed_env).trim());

console.log('Done!');
