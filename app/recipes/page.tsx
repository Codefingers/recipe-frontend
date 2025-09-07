"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Plus, Heart, ChefHat, PlusCircle } from "lucide-react"
import RecipeCard from "@/components/recipe-card"
import RecipeFilter from "@/components/recipe-filter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useFavorites } from "@/hooks/use-favorites"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Recipe } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

export default function MyRecipesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const { favorites } = useFavorites()
  const { user, createMockRecipe } = useAuth()
  const { toast } = useToast()
  const [refreshKey, setRefreshKey] = useState(0)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`https://kgoq68r29f.execute-api.eu-west-1.amazonaws.com/prod/recipes`)
        if (!response.ok) {
          throw new Error('Failed to fetch recipes')
        }
        const data = await response.json()
        setRecipes(data.recipes)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recipes')
        toast({
          title: "Error",
          description: "Failed to load recipes. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipes()
  }, [refreshKey, toast])

  // Get only favorited recipes
  const favoriteRecipes = useMemo(() => {
    return recipes.filter((recipe: Recipe) => favorites.includes(recipe.id))
  }, [favorites, recipes, refreshKey])

  // Get only created recipes
  const createdRecipes = useMemo(() => {
    return recipes.filter((recipe: Recipe) => user && recipe.authorId === user.id)
  }, [recipes, user, refreshKey])

  // Extract all unique tags from all user recipes
  const allTags = useMemo(() => {
    const tags = new Set<string>()

    // Combine favorites and created recipes for tag extraction
    const allUserRecipes = [...favoriteRecipes, ...createdRecipes]

    // Remove duplicates (recipes that are both created and favorited)
    const uniqueRecipes = allUserRecipes.filter(
      (recipe, index, self) => index === self.findIndex((r) => r.id === recipe.id),
    )

    uniqueRecipes.forEach((recipe) => {
      recipe.tags.forEach((tag: string) => tags.add(tag))
    })

    return Array.from(tags).sort()
  }, [favoriteRecipes, createdRecipes])

  // Filter recipes based on search query and selected tags
  const filteredFavorites = useMemo(() => {
    return favoriteRecipes.filter((recipe: Recipe) => {
      // Filter by search query (title or tags)
      const matchesSearch =
        searchQuery === "" ||
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Filter by selected tags
      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => recipe.tags.includes(tag))

      return matchesSearch && matchesTags
    })
  }, [searchQuery, selectedTags, favoriteRecipes])

  // Filter created recipes
  const filteredCreated = useMemo(() => {
    return createdRecipes.filter((recipe: Recipe) => {
      // Filter by search query (title or tags)
      const matchesSearch =
        searchQuery === "" ||
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Filter by selected tags
      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => recipe.tags.includes(tag))

      return matchesSearch && matchesTags
    })
  }, [searchQuery, selectedTags, createdRecipes])

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) => [...prev, tag])
  }

  const handleTagRemove = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag))
  }

  const clearFilters = () => {
    setSelectedTags([])
  }

  const handleCreateMockRecipe = async () => {
    try {
      await createMockRecipe()
      setRefreshKey((prev) => prev + 1)
      toast({
        title: "Mock Recipe Created",
        description: "A mock recipe has been added to your created recipes.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create mock recipe. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderRecipeGrid = (recipes: Recipe[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe: Recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )

  const renderLoadingState = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )

  const renderErrorState = () => (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold mb-2">Error loading recipes</h2>
      <p className="text-muted-foreground mb-6">{error}</p>
      <Button onClick={() => setRefreshKey((prev) => prev + 1)}>Try Again</Button>
    </div>
  )

  return (
    <ProtectedRoute>
      <div className="container px-4 py-6 md:py-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Recipes</h1>
            <p className="text-muted-foreground">Your recipes collection</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search recipes..."
                className="w-full pl-8 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link href="/recipes/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Recipe
              </Button>
            </Link>
          </div>
        </div>

        {!isLoading && !error && allTags.length > 0 && (
          <div className="mb-8">
            <RecipeFilter
              allTags={allTags}
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
              onTagRemove={handleTagRemove}
              onClearFilters={clearFilters}
            />
          </div>
        )}

        <Tabs defaultValue="favorites" className="space-y-8">
          <TabsList>
            <TabsTrigger value="favorites" className="flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="created" className="flex items-center">
              <ChefHat className="h-4 w-4 mr-2" />
              Created by Me
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites">
            {isLoading ? (
              renderLoadingState()
            ) : error ? (
              renderErrorState()
            ) : filteredFavorites.length > 0 ? (
              renderRecipeGrid(filteredFavorites)
            ) : (
              <div className="text-center py-12">
                {favoriteRecipes.length > 0 ? (
                  <>
                    <h2 className="text-xl font-semibold mb-2">No recipes found</h2>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                    {(searchQuery || selectedTags.length > 0) && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("")
                          setSelectedTags([])
                        }}
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-2">No favorite recipes yet</h2>
                    <p className="text-muted-foreground mb-6">
                      Start adding recipes to your favorites to see them here.
                    </p>
                    <Link href="/">
                      <Button>Browse Recipes</Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="created">
            <div className="mb-4 flex justify-end">
              <Button variant="outline" onClick={handleCreateMockRecipe}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Mock Recipe
              </Button>
            </div>

            {isLoading ? (
              renderLoadingState()
            ) : error ? (
              renderErrorState()
            ) : filteredCreated.length > 0 ? (
              renderRecipeGrid(filteredCreated)
            ) : (
              <div className="text-center py-12">
                {createdRecipes.length > 0 ? (
                  <>
                    <h2 className="text-xl font-semibold mb-2">No recipes found</h2>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                    {(searchQuery || selectedTags.length > 0) && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("")
                          setSelectedTags([])
                        }}
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-2">You haven't created any recipes yet</h2>
                    <p className="text-muted-foreground mb-6">Create your first recipe to see it here.</p>
                    <div className="flex gap-4 justify-center">
                      <Link href="/recipes/new">
                        <Button>Create Recipe</Button>
                      </Link>
                      <Button variant="outline" onClick={handleCreateMockRecipe}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Mock Recipe
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}

