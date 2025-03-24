"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Edit, ArrowLeft, Heart, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { recipes } from "@/lib/data"
import { notFound, useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/components/ui/use-toast"

export default function RecipePage() {
  const { id } = useParams<{ id: string }>()
  const recipe = recipes.find((r) => r.id === id)
  const { user, isOwner } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { toast } = useToast()
  const router = useRouter()

  if (!recipe) {
    notFound()
  }

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
    <div className="container max-w-4xl mx-auto px-4 py-6 md:py-10">
      <Link href="/" className="inline-flex items-center text-sm mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to recipes
      </Link>

      <div className="grid gap-6 md:gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{recipe.title}</h1>
            <p className="text-muted-foreground mt-2">{recipe.description}</p>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-1" />
              <span>By {recipe.authorName}</span>
            </div>
          </div>
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
        </div>

        <div className="aspect-video relative rounded-lg overflow-hidden">
          <Image src={recipe.image || "/placeholder.svg"} alt={recipe.title} fill className="object-cover" priority />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <Star className="h-5 w-5 fill-primary text-primary mr-1" />
            <span className="font-medium">{recipe.rating}/5</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-1" />
            <span>Prep: {recipe.prepTime}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-1" />
            <span>Cook: {recipe.cookTime}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

