"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface RecipeFilterProps {
  allTags: string[]
  selectedTags: string[]
  onTagSelect: (tag: string) => void
  onTagRemove: (tag: string) => void
  onClearFilters: () => void
}

export default function RecipeFilter({
  allTags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  onClearFilters,
}: RecipeFilterProps) {
  const [showAllTags, setShowAllTags] = useState(false)
  const displayTags = showAllTags ? allTags : allTags.slice(0, 10)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <h3 className="text-sm font-medium mr-2">Active Filters:</h3>
        {selectedTags.length > 0 ? (
          <>
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => onTagRemove(tag)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tag}</span>
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-xs h-7">
              Clear All
            </Button>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">No active filters</span>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Filter by Tag:</h3>
        <div className="flex flex-wrap gap-2">
          {displayTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => (selectedTags.includes(tag) ? onTagRemove(tag) : onTagSelect(tag))}
            >
              {tag}
            </Badge>
          ))}
          {allTags.length > 10 && (
            <Button variant="ghost" size="sm" onClick={() => setShowAllTags(!showAllTags)} className="text-xs h-7">
              {showAllTags ? "Show Less" : `Show All (${allTags.length})`}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

