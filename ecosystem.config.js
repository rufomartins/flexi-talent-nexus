
module.exports = {
  apps: [{
    name: 'onboarding-app',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3100,
      TRUST_PROXY: 'true', // Enable this to trust the Nginx proxy
      CLOUDMAILIN_USERNAME: 'inbound',
      CLOUDMAILIN_PASSWORD: 'Navigator145'
    }
  }]
};
