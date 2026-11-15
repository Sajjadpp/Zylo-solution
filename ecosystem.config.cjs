// PM2 process file for a VPS deployment:  pm2 start ecosystem.config.cjs
// Secrets are read from .env.production in the app folder (Next.js loads it automatically).
module.exports = {
  apps: [
    {
      name: "zylo",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000 -H 127.0.0.1",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: { NODE_ENV: "production" },
      max_memory_restart: "700M",
      time: true,
    },
  ],
};
