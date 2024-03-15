module.exports = {
  apps: [
    {
      name: "db-server",
      script: "./crud-server/src/index.js", // Backend sunucu dosyanızın yolu
      // instances: 1,
      autorestart: true,
      watch: true,
      ignore_watch: ["node_modules"],
      max_memory_restart: "1G",
      env: {
        DB_HOST: "localhost",
        DB_NAME: "StarMetal",
        DB_USER: "SA",
        DB_PASS: "OriginZero2024",
      },
    },
    {
      name: "application",
      script: "npm",
      args: "run dev",
      cwd: "./client/", // client klasörünün yolu
      autorestart: true,
      watch: true,
      ignore_watch: ["node_modules"],
    },
  ],
};
