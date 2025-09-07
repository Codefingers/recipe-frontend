export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  rating: number
  prepTime: string
  cookTime: string
  tags: string[]
  ingredients: string[]
  instructions: string[]
  authorId: string
  authorName: string
  createdAt: string
  imageUrl: string
}
