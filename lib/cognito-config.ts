import { Amplify } from "aws-amplify"

export const cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
      region: process.env.NEXT_PUBLIC_COGNITO_REGION!,
      signInRedirectURI: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGNIN!,
      signOutRedirectURI: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGNOUT!,
      domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
      // Common default scopes for Cognito Hosted UI
      scopes: ["email", "openid", "profile"],
      responseType: "code",
    },
  },
}

let isAmplifyConfigured = false

export function initAmplifyIfNeeded() {
  if (isAmplifyConfigured) return

  // In a Next.js app router project, this module is only imported on the client
  // from client components (e.g. AuthProvider), so it's safe to configure here.
  Amplify.configure(cognitoConfig)
  isAmplifyConfigured = true
}

