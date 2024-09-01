module.exports = {
  apps: [
    {
      name: 'dhanreg',
      script: 'ng',
      args: 'serve --port 8088 --disable-host-check',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
