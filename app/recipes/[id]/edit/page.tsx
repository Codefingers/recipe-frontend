"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Trash2, Star, ArrowDown, ArrowUp, Upload } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { recipes } from "@/lib/data"
import { useParams, useRouter } from "next/navigation"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

export default function EditRecipePage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const recipe = recipes.find((r) => r.id === id)
  const { user, isOwner } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [prepTime, setPrepTime] = useState("")
  const [cookTime, setCookTime] = useState("")
  const [ingredients, setIngredients] = useState<string[]>([""])
  const [instructions, setInstructions] = useState<string[]>([""])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (recipe) {
      // Check if user is the owner
      if (user && !isOwner(recipe.authorId)) {
        toast({
          title: "Permission denied",
          description: "You can only edit recipes you've created",
          variant: "destructive",
        })
        router.push(`/recipes/${id}`)
        return
      }

      setTitle(recipe.title)
      setDescription(recipe.description)
      setImageUrl(recipe.image)
      setPrepTime(recipe.prepTime)
      setCookTime(recipe.cookTime)
      setIngredients(recipe.ingredients)
      setInstructions(recipe.instructions)
      setTags(recipe.tags)
      setRating(recipe.rating)
    } else {
      router.push("/recipes")
    }
  }, [recipe, router, user, isOwner, id, toast])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would update the recipe in the database
    // and handle image upload if needed

    toast({
      title: "Recipe updated",
      description: "Your recipe has been updated successfully!",
    })

    router.push(`/recipes/${id}`)
  }

  return (
    <ProtectedRoute>
      <div className="container max-w-4xl mx-auto px-4 py-6 md:py-10">
        <Link href={`/recipes/${id}`} className="inline-flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to recipe
        </Link>

        <h1 className="text-3xl font-bold mb-8">Edit Recipe</h1>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Recipe Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
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

                {imagePreview ? (
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
                ) : imageUrl ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                    <Image src={imageUrl || "/placeholder.svg"} alt="Recipe preview" fill className="object-cover" />
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
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="prepTime">Prep Time</Label>
              <Input id="prepTime" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cookTime">Cook Time</Label>
              <Input id="cookTime" value={cookTime} onChange={(e) => setCookTime(e.target.value)} required />
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
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
}

