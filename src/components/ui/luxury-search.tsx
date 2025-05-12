'use client'

import { Search } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { FavoriteButton } from "./favorite-button"

interface SearchResult {
  id: number
  name: string
  image_url: string | null
  description: string | null
  gender: string | null
  price: number | null
  score: number
}

export function LuxurySearch() {
  const [query, setQuery] = useState("")
  const [season, setSeason] = useState<string | null>(null)
  const [occasion, setOccasion] = useState<string | null>(null)
  const [gender, setGender] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (query.length < 2) return
    
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        query: query,
        ...(season && { season }),
        ...(occasion && { occasion }),
        ...(gender && { gender })
      })
      
      const res = await fetch(`/api/search?${params.toString()}`)
      const { data } = await res.json()
      setResults(data || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative group">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Discover your perfect scent..."
            className="w-full px-5 py-4 text-base bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300 shadow-lg backdrop-blur-sm"
          />
          <button
            type="submit"
            onClick={handleSearch}
            className="absolute right-2 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-300 font-medium shadow-md hover:shadow-lg active:scale-95"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <Select value={season || undefined} onValueChange={setSeason}>
            <SelectTrigger className="bg-black/20 border-white/10 text-white">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spring">Spring</SelectItem>
              <SelectItem value="summer">Summer</SelectItem>
              <SelectItem value="fall">Fall</SelectItem>
              <SelectItem value="winter">Winter</SelectItem>
            </SelectContent>
          </Select>

          <Select value={occasion || undefined} onValueChange={setOccasion}>
            <SelectTrigger className="bg-black/20 border-white/10 text-white">
              <SelectValue placeholder="Select occasion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="party">Party</SelectItem>
            </SelectContent>
          </Select>

          <Select value={gender || undefined} onValueChange={setGender}>
            <SelectTrigger className="bg-black/20 border-white/10 text-white">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="unisex">Unisex</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="mt-3 text-center text-sm text-white/70">
        Try "vanilla summer scent" or "fresh citrus perfume"
      </p>

      {isLoading && (
        <div className="mt-4 text-center text-white/70">
          Searching...
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
          {results.map((perfume) => (
            <div
              key={perfume.id}
              className="flex items-center gap-4 p-4 bg-black/20 border border-white/10 rounded-lg text-white hover:bg-black/30 transition-colors"
            >
              <Link
                href={`/perfume/${perfume.id}`}
                className="flex-1 flex items-center gap-4"
              >
                {perfume.image_url && (
                  <img
                    src={perfume.image_url}
                    alt={perfume.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-medium">{perfume.name}</h3>
                  {perfume.gender && (
                    <p className="text-sm text-white/70 capitalize">
                      {perfume.gender}
                    </p>
                  )}
                  {perfume.price && (
                    <p className="text-sm text-white/70">
                      ${perfume.price}
                    </p>
                  )}
                </div>
              </Link>
              <FavoriteButton perfumeId={perfume.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 