"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import RecipeCard from "@/components/recipe-card"
import RecipeFilter from "@/components/recipe-filter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { recipes } from "@/lib/data"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Extract all unique tags from recipes
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    recipes.forEach((recipe) => {
      recipe.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [])

  // Filter recipes based on search query and selected tags
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Filter by search query (title or tags)
      const matchesSearch =
        searchQuery === "" ||
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Filter by selected tags
      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => recipe.tags.includes(tag))

      return matchesSearch && matchesTags
    })
  }, [searchQuery, selectedTags])

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) => [...prev, tag])
  }

  const handleTagRemove = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag))
  }

  const clearFilters = () => {
    setSelectedTags([])
  }

  return (
    <div className="container px-4 py-6 md:py-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full md:w-96">
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
          <Button className="w-full md:w-auto">Create New Recipe</Button>
        </Link>
      </div>

      <div className="mb-8">
        <RecipeFilter
          allTags={allTags}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          onTagRemove={handleTagRemove}
          onClearFilters={clearFilters}
        />
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
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
        </div>
      )}
    </div>
  )
}

