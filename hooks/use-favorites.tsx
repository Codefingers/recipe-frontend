"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load favorites from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`)
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites))
      } else {
        setFavorites([])
      }
    } else {
      setFavorites([])
    }
    setIsLoading(false)
  }, [user])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (user && !isLoading) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites))
    }
  }, [favorites, user, isLoading])

  const addFavorite = (recipeId: string) => {
    if (!user) return
    setFavorites((prev) => [...prev, recipeId])
  }

  const removeFavorite = (recipeId: string) => {
    if (!user) return
    setFavorites((prev) => prev.filter((id) => id !== recipeId))
  }

  const toggleFavorite = (recipeId: string) => {
    if (!user) return
    if (favorites.includes(recipeId)) {
      removeFavorite(recipeId)
    } else {
      addFavorite(recipeId)
    }
  }

  const isFavorite = (recipeId: string) => {
    return favorites.includes(recipeId)
  }

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  }
}

