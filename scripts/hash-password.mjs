import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { hash } = require("@node-rs/argon2");

const password = process.argv[2] ?? process.env.ADMIN_PASSWORD;
if (!password) {
  console.error("Usage: npm run hash-password -- \"your-password\"");
  process.exit(1);
}

const digest = await hash(password, { memoryCost: 19456, timeCost: 2, parallelism: 1 });
console.log(digest);
