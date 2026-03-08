"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const { login, logout, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  if (user) {
    return (
      <div className="container max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">You&apos;re already signed in</CardTitle>
            <CardDescription className="space-y-1">
              <p className="text-sm text-muted-foreground break-all">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                You can continue using Plukos Recipes or sign out below.
              </p>
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-3">
            <Button className="w-full" onClick={() => router.push("/recipes")}>
              Go to my recipes
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                await logout()
                router.push("/")
              }}
            >
              Log out
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login()
      toast({
        title: "Login successful",
        description: "Welcome back to Plukos Recipes!",
      })
      router.push("/")
    } catch (err) {
      console.error("[Login]", err)
      toast({
        title: "Login failed",
        description: err instanceof Error ? err.message : "We couldn't sign you in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>Sign in with your Plukos Recipes account using our secure provider.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You&apos;ll be redirected to our authentication provider to complete sign in, then brought back here.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                "Continue to sign in"
              )}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Create account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

