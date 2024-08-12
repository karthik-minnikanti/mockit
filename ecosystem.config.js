module.exports = {
  apps: [
    {
      name: 'mockit-server',
      cwd: '/root/k8-mock-server/server',
      script: 'npm run start',
      instances: '1',
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 3223
      },
    },
    {
      name: 'mockit-client',
      cwd: '/root/k8-mock-server/client',
      script: 'npm run start',
      instances: '1',
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PUBLIC_URL: 'https://k811-dev.wyreless.org/mock',
        REACT_APP_PUBLIC_URL: 'https://k811-dev.wyreless.org/mock',
        REACT_APP_MOCKIT_API_URL: 'https://k811-dev.wyreless.org/mock/api',
        REACT_APP_MOCKIT_SERVER_URL: 'https://k811-dev.wyreless.org/mockit',
      },
    },
    {
      name: 'mockit-routes',
      cwd: '/root/k8-mock-server/mockit-routes',
      script: 'npm run start',
      instances: '1',
      exec_mode: 'fork',
      watch: true,
      env: {
        NODE_ENV: 'development',
        PORT: 3224
      },
    },
  ],
};
