module.exports = {
  apps: [{
    name: 'tcg-server',
    script: './src/index.js',

    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: '6002',
    },
    env_development: {
      NODE_ENV: 'development',
      DEBUG: 'gskse*',
    },
  }],
};
