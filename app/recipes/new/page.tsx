"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Trash2, Star, ArrowDown, ArrowUp, Upload } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import ProtectedRoute from "@/components/protected-route"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"

export default function NewRecipePage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [prepTime, setPrepTime] = useState("")
  const [cookTime, setCookTime] = useState("")
  
  const [ingredients, setIngredients] = useState<string[]>([""])
  const [instructions, setInstructions] = useState<string[]>([""])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [rating, setRating] = useState(0)
  const [imageUrl, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addIngredient = () => {
    setIngredients([...ingredients, ""])
  }

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = value
    setIngredients(newIngredients)
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients]
      newIngredients.splice(index, 1)
      setIngredients(newIngredients)
    }
  }

  const moveIngredientUp = (index: number) => {
    if (index > 0) {
      const newIngredients = [...ingredients]
      ;[newIngredients[index], newIngredients[index - 1]] = [newIngredients[index - 1], newIngredients[index]]
      setIngredients(newIngredients)
    }
  }

  const moveIngredientDown = (index: number) => {
    if (index < ingredients.length - 1) {
      const newIngredients = [...ingredients]
      ;[newIngredients[index], newIngredients[index + 1]] = [newIngredients[index + 1], newIngredients[index]]
      setIngredients(newIngredients)
    }
  }

  const addInstruction = () => {
    setInstructions([...instructions, ""])
  }

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions]
    newInstructions[index] = value
    setInstructions(newInstructions)
  }

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      const newInstructions = [...instructions]
      newInstructions.splice(index, 1)
      setInstructions(newInstructions)
    }
  }

  const moveInstructionUp = (index: number) => {
    if (index > 0) {
      const newInstructions = [...instructions]
      ;[newInstructions[index], newInstructions[index - 1]] = [newInstructions[index - 1], newInstructions[index]]
      setInstructions(newInstructions)
    }
  }

  const moveInstructionDown = (index: number) => {
    if (index < instructions.length - 1) {
      const newInstructions = [...instructions]
      ;[newInstructions[index], newInstructions[index + 1]] = [newInstructions[index + 1], newInstructions[index]]
      setInstructions(newInstructions)
    }
  }

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
    // Clear file upload when URL is entered
    if (e.target.value) {
      setImageFile(null)
      setImagePreview(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Clear image URL when file is uploaded
      setImageUrl("")

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a recipe",
        variant: "destructive",
      })
      return
    }

    // Filter out empty ingredients and instructions
    const filteredIngredients = ingredients.filter(ingredient => ingredient.trim() !== "")
    const filteredInstructions = instructions.filter(instruction => instruction.trim() !== "")

    if (filteredIngredients.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one ingredient",
        variant: "destructive",
      })
      return
    }

    if (filteredInstructions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one instruction",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const recipeData = {
        title,
        description,
        imageUrl: imageFile ? imagePreview : imageUrl, // Use preview for file uploads or URL
        tags,
        rating,
        prepTime,
        cookTime,
        ingredients: filteredIngredients,
        instructions: filteredInstructions,
        authorId: user.id,
        authorName: user.name,
      }

      const response = await fetch("https://kgoq68r29f.execute-api.eu-west-1.amazonaws.com/prod/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      })

      if (!response.ok) {
        throw new Error("Failed to create recipe")
      }

      toast({
        title: "Recipe created",
        description: "Your recipe has been created successfully!",
      })

      router.push("/recipes")
    } catch (error) {
      console.error("Error creating recipe:", error)
      toast({
        title: "Error",
        description: "Failed to create recipe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container max-w-4xl mx-auto px-4 py-6 md:py-10">
        <Link href="/" className="inline-flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to recipes
        </Link>

        <h1 className="text-3xl font-bold mb-8">Create New Recipe</h1>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Recipe Title</Label>
              <Input 
                id="title" 
                placeholder="Enter recipe title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <div className="grid gap-4">
                <div className="flex gap-2">
                  <Input
                    id="image"
                    placeholder="Enter image URL"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    disabled={!!imageFile}
                  />
                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10"
                      onClick={triggerFileInput}
                      disabled={!!imageUrl}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {imagePreview && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Recipe preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={removeImage}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe your recipe" 
              rows={3} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required 
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="prepTime">Prep Time</Label>
              <Input 
                id="prepTime" 
                placeholder="e.g. 15 mins" 
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cookTime">Cook Time</Label>
              <Input 
                id="cookTime" 
                placeholder="e.g. 30 mins" 
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                    <Star
                      className={`h-6 w-6 ${rating >= star ? "fill-primary text-primary" : "text-muted-foreground"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Remove {tag}</span>
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              id="tags"
              placeholder="Type a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Ingredients</Label>
              <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                <Plus className="h-4 w-4 mr-1" />
                Add Ingredient
              </Button>
            </div>

            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                  required={index === 0}
                />
                <div className="flex">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => moveIngredientUp(index)}
                    disabled={index === 0}
                    className="h-10 w-8"
                  >
                    <ArrowUp className="h-4 w-4" />
                    <span className="sr-only">Move ingredient up</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => moveIngredientDown(index)}
                    disabled={index === ingredients.length - 1}
                    className="h-10 w-8"
                  >
                    <ArrowDown className="h-4 w-4" />
                    <span className="sr-only">Move ingredient down</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                    disabled={ingredients.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove ingredient</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Instructions</Label>
              <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
                <Plus className="h-4 w-4 mr-1" />
                Add Step
              </Button>
            </div>

            {instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  required={index === 0}
                />
                <div className="flex flex-col">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => moveInstructionUp(index)}
                    disabled={index === 0}
                    className="h-8 w-8"
                  >
                    <ArrowUp className="h-4 w-4" />
                    <span className="sr-only">Move step up</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => moveInstructionDown(index)}
                    disabled={index === instructions.length - 1}
                    className="h-8 w-8"
                  >
                    <ArrowDown className="h-4 w-4" />
                    <span className="sr-only">Move step down</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInstruction(index)}
                    disabled={instructions.length === 1}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove step</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Save Recipe"}
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
}

