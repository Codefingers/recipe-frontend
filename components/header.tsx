"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, User, LogOut } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center max-w-5xl mx-auto px-4">
        <Link href="/" className="font-bold text-xl mr-6">
          Plukos Recipes
        </Link>
        <div className="hidden md:flex items-center space-x-4 flex-1">
          <nav className="flex items-center space-x-4">
            <Link href="/" className="text-sm font-medium hover:underline">
              Home
            </Link>
            {user && (
              <>
                <Link href="/recipes" className="text-sm font-medium hover:underline">
                  My Recipes
                </Link>
                <Link href="/import" className="text-sm font-medium hover:underline">
                  Import
                </Link>
              </>
            )}
          </nav>
          <div className="flex-1" />
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuLabel className="font-normal text-xs truncate">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/recipes">My Recipes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="md:hidden flex flex-1 justify-end items-center space-x-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuLabel className="font-normal text-xs truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/recipes">My Recipes</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-b pb-4">
          <nav className="container flex flex-col space-y-3 px-4 max-w-5xl mx-auto">
            <Link href="/" className="text-sm font-medium hover:underline" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            {user && (
              <>
                <Link
                  href="/recipes"
                  className="text-sm font-medium hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Recipes
                </Link>
                <Link
                  href="/import"
                  className="text-sm font-medium hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Import
                </Link>
              </>
            )}
            {!user && (
              <Link
                href="/register"
                className="text-sm font-medium hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

