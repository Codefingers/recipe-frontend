import { Amplify } from "aws-amplify"

const redirectSignIn = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGNIN
const redirectSignOut = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGNOUT
const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN
const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID

export const cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: userPoolId!,
      userPoolClientId: userPoolClientId!,
      loginWith: {
        oauth: {
          domain: domain!,
          redirectSignIn: redirectSignIn ? [redirectSignIn] : [],
          redirectSignOut: redirectSignOut ? [redirectSignOut] : [],
          responseType: "code" as const,
          scopes: ["openid", "email", "profile"],
        },
      },
    },
  },
}

let isAmplifyConfigured = false

export function initAmplifyIfNeeded() {
  if (isAmplifyConfigured) return

  if (!userPoolId || !userPoolClientId || !domain || !redirectSignIn || !redirectSignOut) {
    console.error(
      "[Cognito] Missing required env vars. Set NEXT_PUBLIC_COGNITO_USER_POOL_ID, NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID, NEXT_PUBLIC_COGNITO_DOMAIN, NEXT_PUBLIC_COGNITO_REDIRECT_SIGNIN, NEXT_PUBLIC_COGNITO_REDIRECT_SIGNOUT in .env.local"
    )
    return
  }

  Amplify.configure(cognitoConfig)
  isAmplifyConfigured = true
}

