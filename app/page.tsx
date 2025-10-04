import RecipeList from "@/components/recipe-list"

export default async function Home() {
  const recipes = await fetch('https://kgoq68r29f.execute-api.eu-west-1.amazonaws.com/prod/recipes', {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    }
  })
  const recipesData = await recipes.json()

  if (!recipesData) {
    return <div>No recipes found</div>
  }

  console.log(recipesData)
  
  return (
    <div className="container px-4 py-6 md:py-10 max-w-5xl mx-auto">
      <RecipeList initialRecipes={recipesData.recipes} />
    </div>
  )
}

