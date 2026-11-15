// Runs the app reachable from phones/tablets on the same Wi‑Fi.
//   npm run dev:lan     → development server (hot reload)
//   npm run start:lan   → production server (run `npm run build` first)
import os from "node:os";
import { spawn } from "node:child_process";

const mode = process.argv[2] === "start" ? "start" : "dev";
const port = process.env.PORT || "3000";

const ips = Object.entries(os.networkInterfaces())
  .flatMap(([name, list]) => (list ?? []).filter((i) => i.family === "IPv4" && !i.internal).map((i) => ({ name, ip: i.address })))
  // Virtual adapters (WSL, Hyper-V, Docker, VPN) are listed last – phones can't reach them.
  .sort((a, b) => Number(/vEthernet|WSL|Docker|VirtualBox|VMware|vpn/i.test(a.name)) - Number(/vEthernet|WSL|Docker|VirtualBox|VMware|vpn/i.test(b.name)));

console.log(`\n  Zylo Solution – ${mode === "dev" ? "development" : "production"} server on your network\n`);
console.log(`  This computer:   http://localhost:${port}`);
for (const { name, ip } of ips) console.log(`  Phone (${name}):`.padEnd(19) + ` http://${ip}:${port}`);
console.log(`\n  • Phone and computer must be on the same Wi‑Fi.`);
console.log(`  • If the phone can't connect, allow Node.js through Windows Firewall (Private + Public networks).`);
console.log(`  • Push notifications need HTTPS, so test those on localhost or the deployed site.\n`);

const child = spawn("npx", ["next", mode, "-H", "0.0.0.0", "-p", port], { stdio: "inherit", shell: true });
child.on("exit", (code) => process.exit(code ?? 0));
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => child.kill(sig));
