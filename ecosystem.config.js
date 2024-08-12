module.exports = {
  apps: [
    {
      name: 'server',
      script: './server/src/index.js',
      instances: '1',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 3223
      },
    },
    {
      name: 'client',
      script: './path/to/client.js',
      instances: '1',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PUBLIC_URL: 'https://k811-dev.wyreless.org/mock',
        REACT_APP_PUBLIC_URL: 'https://k811-dev.wyreless.org/mock',
        REACT_APP_MOCKIT_API_URL: 'https://k811-dev.wyreless.org/mock/api',
        REACT_APP_MOCKIT_SERVER_URL: 'https://k811-dev.wyreless.org/mockit'
      },
    },
    {
      name: 'mockit-routes',
      script: './mockit-routes/src/index.js',
      instances: '1',
      exec_mode: 'cluster',
      watch: true,
      env: {
        NODE_ENV: 'development',
        PORT: 3224
      },
    },
  ],
};