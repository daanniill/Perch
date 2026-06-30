import { StackClientApp } from '@stackframe/stack'

// VITE_NEON_AUTH_URL is the Neon Auth base URL (found in your Neon project dashboard).
// It is used as the Stack Auth server endpoint for this project.
export const stackApp = new StackClientApp({
  projectId: import.meta.env.VITE_STACK_PROJECT_ID,
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_KEY,
  baseUrl: import.meta.env.VITE_NEON_AUTH_URL,
  tokenStore: 'cookie',
  urls: {
    home: '/',
    afterSignIn: '/#/onboarding',
    afterSignUp: '/#/onboarding',
  },
})

// Helper: fetch our Express backend with the Stack Auth token attached.
export async function apiFetch(path, options = {}) {
  const user = await stackApp.getUser()
  const token = user ? await user.getAuthToken() : null
  return fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
}
