"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { recipes } from "@/lib/data"

type User = {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>
  logout: () => void
  isOwner: (authorId: string) => boolean
  createMockRecipe: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage on initial load
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call to authenticate
    setIsLoading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      const newUser = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        name: email.split("@")[0], // Use part of email as name for demo
        firstName: email.split("@")[0],
        lastName: "User",
        email,
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    // In a real app, this would make an API call to register
    setIsLoading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful registration
      const newUser = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email,
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const isOwner = (authorId: string) => {
    return user?.id === authorId
  }

  const createMockRecipe = () => {
    if (!user) return

    // Create a mock recipe with the current user as author
    const newRecipe = {
      id: "user_recipe_" + Math.random().toString(36).substr(2, 9),
      title: "My Homemade Recipe",
      description: "A delicious recipe I created myself",
      image: "/placeholder.svg?height=300&width=400",
      rating: 5,
      prepTime: "20 mins",
      cookTime: "30 mins",
      tags: ["Homemade", "Favorite", "Quick"],
      ingredients: [
        "2 cups flour",
        "1 cup sugar",
        "3 eggs",
        "1/2 cup butter",
        "1 tsp vanilla extract",
        "2 tsp baking powder",
        "1/2 tsp salt",
      ],
      instructions: [
        "Preheat oven to 350°F (175°C).",
        "Mix dry ingredients in a bowl.",
        "In another bowl, cream butter and sugar.",
        "Add eggs one at a time, then vanilla.",
        "Gradually add dry ingredients to wet ingredients.",
        "Pour batter into a greased pan.",
        "Bake for 25-30 minutes until golden brown.",
      ],
      authorId: user.id,
      authorName: user.name,
    }

    // Add the new recipe to the recipes array
    recipes.unshift(newRecipe)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isOwner, createMockRecipe }}>
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

