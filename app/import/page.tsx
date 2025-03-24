"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Import } from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProtectedRoute from "@/components/protected-route"

export default function ImportPage() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [importedRecipe, setImportedRecipe] = useState<any>(null)
  const [error, setError] = useState("")

  const handleImport = async () => {
    if (!url) return

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call to scrape recipe
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock response
      setImportedRecipe({
        title: "Imported Chocolate Chip Cookies",
        description: "Classic chocolate chip cookies that are crisp on the outside, chewy on the inside.",
        ingredients: [
          "2 1/4 cups all-purpose flour",
          "1 teaspoon baking soda",
          "1 teaspoon salt",
          "1 cup unsalted butter, softened",
          "3/4 cup granulated sugar",
          "3/4 cup packed brown sugar",
          "2 large eggs",
          "2 teaspoons vanilla extract",
          "2 cups semi-sweet chocolate chips",
        ],
        instructions: [
          "Preheat oven to 375°F (190°C).",
          "Combine flour, baking soda, and salt in a small bowl.",
          "Beat butter, granulated sugar, and brown sugar in a large mixer bowl.",
          "Add eggs one at a time, beating well after each addition. Beat in vanilla.",
          "Gradually beat in flour mixture. Stir in chocolate chips.",
          "Drop by rounded tablespoon onto ungreased baking sheets.",
          "Bake for 9 to 11 minutes or until golden brown.",
          "Cool on baking sheets for 2 minutes; remove to wire racks to cool completely.",
        ],
      })
    } catch (err) {
      setError("Failed to import recipe. Please check the URL and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualImport = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle manual import logic
  }

  return (
    <ProtectedRoute>
      <div className="container max-w-4xl mx-auto px-4 py-6 md:py-10">
        <Link href="/" className="inline-flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to recipes
        </Link>

        <h1 className="text-3xl font-bold mb-8">Import Recipe</h1>

        <Tabs defaultValue="url" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">Import from URL</TabsTrigger>
            <TabsTrigger value="manual">Manual Import</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="url" className="mb-2 block">
                  Recipe URL
                </Label>
                <Input
                  id="url"
                  placeholder="https://example.com/recipe"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <Button className="mt-8" onClick={handleImport} disabled={isLoading || !url}>
                {isLoading ? "Importing..." : "Import"}
              </Button>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            {importedRecipe && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">{importedRecipe.title}</h2>
                  <p className="text-muted-foreground mb-6">{importedRecipe.description}</p>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="font-medium mb-2">Ingredients</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {importedRecipe.ingredients.map((ingredient: string, i: number) => (
                          <li key={i}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Instructions</h3>
                      <ol className="list-decimal pl-5 space-y-2">
                        {importedRecipe.instructions.map((instruction: string, i: number) => (
                          <li key={i}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Link href="/recipes/new">
                      <Button>
                        <Import className="mr-2 h-4 w-4" />
                        Edit & Save Recipe
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="manual" className="space-y-6">
            <form onSubmit={handleManualImport} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="manual-title">Recipe Title</Label>
                <Input id="manual-title" placeholder="Enter recipe title" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manual-ingredients">Ingredients (one per line)</Label>
                <Textarea
                  id="manual-ingredients"
                  placeholder="1 cup flour
2 eggs
1/2 cup sugar"
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manual-instructions">Instructions (one step per line)</Label>
                <Textarea
                  id="manual-instructions"
                  placeholder="Preheat oven to 350°F.
Mix dry ingredients in a bowl.
Add wet ingredients and stir until combined."
                  rows={6}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Import className="mr-2 h-4 w-4" />
                  Create Recipe
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}

