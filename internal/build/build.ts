#!/usr/bin/env node
import { run } from '@cdx-component/build-utils';

const main = async () => {
  await run('pnpm build:modules');
  await run('pnpm build:full');
  await run('pnpm build:theme && pnpm copy:package');
  await run('pnpm copy:package');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
