import { StackClientApp } from '@stackframe/stack'

// Initialized once and re-used across the app.
// tokenStore: 'cookie' keeps the session across page reloads.
export const stackApp = new StackClientApp({
  projectId: import.meta.env.VITE_STACK_PROJECT_ID,
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_KEY,
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
