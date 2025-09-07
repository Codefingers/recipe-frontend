import { Badge } from "@/components/ui/badge"
import { Star, Clock, ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import RecipeActions from "@/components/recipe-actions"
import { Recipe } from "@/lib/data"

async function getRecipe(id: string): Promise<Recipe | null> {
  const response = await fetch(`https://kgoq68r29f.execute-api.eu-west-1.amazonaws.com/prod/recipes/${id}`)
  if (!response.ok) {
    return null
  }
  const data = await response.json()
  return data.recipe
}

export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipe = await getRecipe(params.id)

  if (!recipe) {
    notFound()
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
          <RecipeActions recipe={recipe} />
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
          {recipe.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient: string, index: number) => (
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
              {recipe.instructions.map((step: string, index: number) => (
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

