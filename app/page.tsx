"use client"

import { useState, useEffect } from "react"
import RecipeList from "@/components/recipe-list"
import { Recipe } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('https://kgoq68r29f.execute-api.eu-west-1.amazonaws.com/prod/recipes', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch recipes')
        }
        const data = await response.json()
        setRecipes(data.recipes || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recipes')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  if (isLoading) {
    return (
      <div className="container px-4 py-6 md:py-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-6 md:py-10 max-w-5xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Error loading recipes</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container px-4 py-6 md:py-10 max-w-5xl mx-auto">
      <RecipeList initialRecipes={recipes} />
    </div>
  )
}

