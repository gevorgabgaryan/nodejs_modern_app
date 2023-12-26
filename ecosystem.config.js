const path = require("path")

module.exports = {
  apps: [
    {
      name: "main",
      script: "npm",
      args: "start",
      instances: 1,
      autorestart: true,
      watch: ["."],
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
    },
    ...[ 'registry', 'catalog', 'order'].map((name) => ({
      name,
      cwd: path.resolve(__dirname, `./microservices/${name}-service`),
      script: "npm",
      args: "start",
      watch: ["."],
      instance_var: "INSTANCE_ID",
      env: {
        NODE_ENV: "development",
      },
    })),
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
}
