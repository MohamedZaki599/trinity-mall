import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { hash, verify } = require("@node-rs/argon2");

function promptHidden(question) {
  return new Promise((resolve) => {
    const { stdin, stdout } = process;
    stdout.write(question);
    const wasRaw = stdin.isRaw;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";

    const onData = (chunk) => {
      for (const char of chunk) {
        if (char === "\r" || char === "\n" || char === "\u0004") {
          stdin.setRawMode(wasRaw);
          stdin.pause();
          stdin.removeListener("data", onData);
          stdout.write("\n");
          resolve(value);
          return;
        }
        if (char === "\u0003") {
          stdin.setRawMode(wasRaw);
          stdin.pause();
          stdout.write("\n");
          process.exit(1);
        }
        if (char === "\u007f" || char === "\b") value = value.slice(0, -1);
        else if (char >= " ") value += char;
      }
    };

    stdin.on("data", onData);
  });
}

const args = process.argv.slice(2);
const printOnly = args.includes("--print");
let password = args.find((arg) => !arg.startsWith("--")) ?? process.env.ADMIN_PASSWORD;

if (!password) {
  if (!process.stdin.isTTY) {
    console.error("No password provided and no interactive terminal available.");
    process.exit(1);
  }
  password = await promptHidden("New admin password: ");
  if (!password) {
    console.error("Password cannot be empty.");
    process.exit(1);
  }
  const confirmation = await promptHidden("Confirm password:   ");
  if (confirmation !== password) {
    console.error("Passwords do not match.");
    process.exit(1);
  }
}

const digest = await hash(password, { memoryCost: 19456, timeCost: 2, parallelism: 1 });

if (!(await verify(digest, password))) {
  console.error("Generated hash failed verification; refusing to continue.");
  process.exit(1);
}

if (printOnly) {
  console.log(digest);
  process.exit(0);
}

const path = ".env.local";
const template = existsSync(path) ? readFileSync(path, "utf8") : "";
const updated = /^ADMIN_PASSWORD_HASH=.*$/m.test(template)
  ? template.replace(/^ADMIN_PASSWORD_HASH=.*$/m, `ADMIN_PASSWORD_HASH=${digest}`)
  : `${template.trimEnd()}\nADMIN_PASSWORD_HASH=${digest}\n`;

writeFileSync(path, updated);
console.log(`ADMIN_PASSWORD_HASH written to ${path} (${digest.length} characters, verified).`);
