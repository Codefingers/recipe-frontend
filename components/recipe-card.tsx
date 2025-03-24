"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/hooks/use-favorites"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// Update the Recipe interface to include author information
interface Recipe {
  id: string
  title: string
  description: string
  image: string
  rating: number
  prepTime: string
  cookTime: string
  tags: string[]
  authorId: string
  authorName: string
}

// Update the RecipeCard component to accept an onRemove callback

// Add onRemove to the props
interface RecipeCardProps {
  recipe: Recipe
  onRemove?: (id: string) => void
}

export default function RecipeCard({ recipe, onRemove }: RecipeCardProps) {
  const { user } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { toast } = useToast()
  const router = useRouter()

  const isFav = user ? isFavorite(recipe.id) : false

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to favorite recipes",
      })
      router.push("/login")
      return
    }

    toggleFavorite(recipe.id)

    // If the recipe is being unfavorited and we're in the My Recipes page
    if (isFav && onRemove) {
      onRemove(recipe.id)
    } else {
      toast({
        title: isFav ? "Removed from favorites" : "Added to favorites",
        description: isFav ? "Recipe removed from your collection" : "Recipe added to your collection",
      })
    }
  }

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={recipe.image || "/placeholder.svg"}
            alt={recipe.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10"
              onClick={handleFavoriteClick}
            >
              <Heart className={`h-5 w-5 ${isFav ? "fill-primary text-primary" : ""}`} />
              <span className="sr-only">{isFav ? "Remove from favorites" : "Add to favorites"}</span>
            </Button>
          )}
        </div>
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg line-clamp-1">{recipe.title}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-primary text-primary mr-1" />
              <span className="text-sm">{recipe.rating}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-muted-foreground text-sm line-clamp-2">{recipe.description}</p>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <span>Prep: {recipe.prepTime}</span>
            <span className="mx-2">•</span>
            <span>Cook: {recipe.cookTime}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
          {recipe.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {recipe.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{recipe.tags.length - 3}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

