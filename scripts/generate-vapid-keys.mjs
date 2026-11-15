// Generates a VAPID key pair for Web Push. Run: npm run generate-vapid-keys
import * as webpush from "web-push";

const { publicKey, privateKey } = webpush.generateVAPIDKeys();
console.log("Add these to .env.local (and to your hosting provider's environment variables):\n");
console.log(`VAPID_PUBLIC_KEY=${publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${privateKey}`);
console.log("VAPID_SUBJECT=mailto:Info@zylosolution.com");
console.log("\nKeep the private key secret. If you change keys, admins must click “Enable notifications” again.");
