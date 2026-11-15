// Creates a bcrypt hash for the admin password. Run: npm run hash-password -- "YourStrongPassword"
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error('Usage: npm run hash-password -- "YourStrongPassword"   (minimum 10 characters)');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log("\nFor .env / .env.local (each $ escaped, because Next.js expands $VARIABLES in env files):\n");
console.log(`ADMIN_PASSWORD_HASH=${hash.replace(/\$/g, "\\$")}`);
console.log("\nFor the Vercel dashboard / PM2 ecosystem / Docker -e (paste raw, no backslashes):\n");
console.log(hash);
console.log("\nA fresh JWT secret, if you need one:\n");
console.log(`JWT_SECRET=${crypto.randomBytes(48).toString("hex")}\n`);
