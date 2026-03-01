"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const redirect = searchParams.get("redirect") || "/"

    if (user) {
      router.replace(redirect)
      return
    }

    const timeout = setTimeout(() => {
      // If we still don't have a user after a short delay, treat it as an error
      setError("We couldn't complete the sign-in. Please try again.")
    }, 8000)

    return () => clearTimeout(timeout)
  }, [user, router, searchParams])

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="mb-2 text-2xl font-semibold">Sign-in error</h1>
        <p className="mb-6 text-center text-muted-foreground">{error}</p>
        <button
          onClick={() => router.push("/login")}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="mt-4 text-sm text-muted-foreground">Signing you in...</p>
    </div>
  )
}

