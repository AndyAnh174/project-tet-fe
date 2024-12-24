const configs = {
  development: {
    API_URL: import.meta.env.VITE_API_URL || 'https://whole-downloading-bugs-denver.trycloudflare.com',
  },
  production: {
    API_URL: import.meta.env.VITE_API_URL || 'https://whole-downloading-bugs-denver.trycloudflare.com',
  },
  staging: {
    API_URL: import.meta.env.VITE_API_URL || 'https://staging-api.your-domain.com/api',
  }
};

const env = import.meta.env.MODE || 'development';
export default configs[env]; 