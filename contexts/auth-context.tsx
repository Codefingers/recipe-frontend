"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { initAmplifyIfNeeded } from "@/lib/cognito-config"
import { getCurrentUser, fetchUserAttributes, fetchAuthSession, signInWithRedirect, signOut } from "aws-amplify/auth"

type User = {
  id: string
  name: string
  email: string
  firstName?: string
  lastName?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: () => Promise<void>
  register: () => Promise<void>
  logout: () => Promise<void>
  isOwner: (authorId: string) => boolean
  createMockRecipe: () => void
  getIdToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function loadCurrentUser(): Promise<User | null> {
  try {
    const currentUser = await getCurrentUser()

    let attributes: Awaited<ReturnType<typeof fetchUserAttributes>> | null = null
    try {
      attributes = await fetchUserAttributes()
    } catch (err) {
      // A 400 from Cognito when fetching attributes should not prevent us
      // from treating the user as signed in, as long as getCurrentUser succeeded.
      console.error("[Auth] fetchUserAttributes failed", err)
    }

    const id =
      attributes?.sub ??
      // Amplify's getCurrentUser() exposes userSub/userId depending on version
      (currentUser as any).userId ??
      (currentUser as any).userSub ??
      currentUser.username

    const email =
      attributes?.email ??
      // Fallback to whatever login identifier Amplify has (e.g. email/username)
      ((currentUser as any).signInDetails?.loginId as string | undefined) ??
      ""

    const firstName = attributes?.given_name
    const lastName = attributes?.family_name

    const name =
      [firstName, lastName].filter(Boolean).join(" ") ||
      (attributes?.["custom:full_name"] as string | undefined) ||
      email ||
      currentUser.username

    return {
      id,
      name,
      email,
      firstName,
      lastName,
    }
  } catch (err) {
    console.error("[Auth] getCurrentUser failed", err)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initAmplifyIfNeeded()

    let isMounted = true

    const init = async () => {
      try {
        const loadedUser = await loadCurrentUser()
        if (isMounted) {
          setUser(loadedUser)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void init()

    return () => {
      isMounted = false
    }
  }, [])

  const login = async () => {
    initAmplifyIfNeeded()
    await signInWithRedirect()
  }

  const register = async () => {
    initAmplifyIfNeeded()
    await signInWithRedirect()
  }

  const logout = async () => {
    initAmplifyIfNeeded()
    await signOut()
    setUser(null)
  }

  const isOwner = (authorId: string) => {
    return user?.id === authorId
  }

  const createMockRecipe = () => {
    // This was previously mutating a local in-memory recipes array.
    // Leave it as a no-op for now to avoid relying on client-side mocks.
    return
  }

  const getIdToken = async () => {
    try {
      const session = await fetchAuthSession()
      return session.tokens?.idToken?.toString() ?? null
    } catch {
      return null
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isOwner, createMockRecipe, getIdToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

