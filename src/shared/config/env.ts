export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  appEnv: import.meta.env.VITE_APP_ENV,
}

export function validateEnv() {
  if (!env.apiBaseUrl) {
    throw new Error('Missing environment variable: VITE_API_BASE_URL')
  }

  if (!env.appEnv) {
    throw new Error('Missing environment variable: VITE_APP_ENV')
  }
}
