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

export default function RegisterPage() {
  const { register, logout, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  if (user) {
    return (
      <div className="container max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">You already have an account</CardTitle>
          <CardDescription className="space-y-1">
            <p className="text-sm text-muted-foreground break-all">{user.name}</p>
            <p className="text-sm text-muted-foreground">
              You can keep using this account or sign out to create a new one.
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
      await register()
      toast({
        title: "Registration successful",
        description: "Welcome to Plukos Recipes!",
      })
      router.push("/")
    } catch (err) {
      console.error("[Register]", err)
      toast({
        title: "Registration failed",
        description: err instanceof Error ? err.message : "We couldn't create your account. Please try again.",
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
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Sign up with our secure provider to create your Plukos Recipes account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You&apos;ll be redirected to our authentication provider to create your account, then brought back here.
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
                "Continue to sign up"
              )}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

