module.exports = {
  apps: [{
    name: "nestjs-app",
    script: "./dist/main.js",
    instances: 1,              // ← ONLY ONE instance
    exec_mode: "fork",         // ← fork mode (not cluster)
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
};
