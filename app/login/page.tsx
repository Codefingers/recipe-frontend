"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const { login, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Redirect if already logged in
  if (user) {
    router.push("/")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login()
      toast({
        title: "Login successful",
        description: "Welcome back to Plukos Recipes!",
      })
      router.push("/")
    } catch {
      toast({
        title: "Login failed",
        description: "We couldn't sign you in. Please try again.",
        variant: "destructive",
      })
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
            <Button type="submit" className="w-full">
              Continue to sign in
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

