"use client"

import { Button } from "@/components/ui/button"
import { Edit, Heart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/components/ui/use-toast"
import { Recipe } from "@/lib/data"

interface RecipeActionsProps {
  recipe: Recipe
}

export default function RecipeActions({ recipe }: RecipeActionsProps) {
  const { user, isOwner } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { toast } = useToast()
  const router = useRouter()

  const isFav = user ? isFavorite(recipe.id) : false
  const canEdit = user && isOwner(recipe.authorId)

  const handleFavoriteClick = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to favorite recipes",
      })
      router.push("/login")
      return
    }

    toggleFavorite(recipe.id)

    // If we're unfavoriting and we came from the My Recipes page, go back
    if (isFav && document.referrer.includes("/recipes") && !document.referrer.includes(`/recipes/${recipe.id}`)) {
      router.back()
    } else {
      toast({
        title: isFav ? "Removed from favorites" : "Added to favorites",
        description: isFav ? "Recipe removed from your collection" : "Recipe added to your collection",
      })
    }
  }

  return (
    <div className="flex gap-2">
      {user && (
        <Button variant={isFav ? "default" : "outline"} className="shrink-0" onClick={handleFavoriteClick}>
          <Heart className={`mr-2 h-4 w-4 ${isFav ? "fill-white" : ""}`} />
          {isFav ? "Favorited" : "Add to Favorites"}
        </Button>
      )}
      {canEdit && (
        <Link href={`/recipes/${recipe.id}/edit`}>
          <Button variant="outline" className="shrink-0">
            <Edit className="mr-2 h-4 w-4" />
            Edit Recipe
          </Button>
        </Link>
      )}
    </div>
  )
} 