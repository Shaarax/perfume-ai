'use client'

import { useState, useEffect } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useDebounce } from 'use-debounce'
import type { Database } from '@/types/supabase'

type Perfume = {
  id: number
  name: string
  image_url: string | null
  brands: {
    name: string
  } | null
}

export default function Home() {
  const supabase = createPagesBrowserClient<Database>()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const [suggestions, setSuggestions] = useState<Perfume[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [popularPerfumes, setPopularPerfumes] = useState<Perfume[]>([])

  const fetchPopularPerfumes = async () => {
    const { data, error } = await supabase
      .from('perfumes')
      .select('id, name, image_url, brands(name)')
      .order('release_year', { ascending: false })
      .limit(12)

    if (error) {
      console.error('Error fetching popular perfumes:', error)
      setPopularPerfumes([])
    } else {
      const transformedData = (data || []).map(item => ({
        id: item.id as number,
        name: item.name as string,
        image_url: item.image_url as string | null,
        brands: item.brands ? { name: (item.brands as any).name } : null
      }))
      setPopularPerfumes(transformedData)
    }
  }

  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      fetchSuggestions(debouncedSearchTerm)
    } else {
      setSuggestions([])
      fetchPopularPerfumes()
    }
  }, [debouncedSearchTerm])

  const fetchSuggestions = async (query: string) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('perfumes')
      .select('id, name, image_url, brands(name)')
      .ilike('name', `%${query}%`)
      .limit(10)

    if (error) {
      console.error(error)
      setSuggestions([])
    } else {
      const transformedData = (data || []).map(item => ({
        id: item.id as number,
        name: item.name as string,
        image_url: item.image_url as string | null,
        brands: item.brands ? { name: (item.brands as any).name } : null
      }))
      setSuggestions(transformedData)
    }
    setLoading(false)
  }

  const handleSelect = (id: number) => {
    setShowSuggestions(false)
    router.push(`/perfume/${id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
            Discover Your Perfect Scent
          </h1>
          <p className="text-lg text-gray-600 text-center mb-12">
            Search through our collection of exquisite perfumes
          </p>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search for a perfume..."
              className="w-full p-4 text-lg border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />

            {loading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
              </div>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto z-10">
                {suggestions.map((perfume) => (
                  <div
                    key={perfume.id}
                    onClick={() => handleSelect(perfume.id)}
                    className="flex items-center gap-4 p-4 hover:bg-purple-50 cursor-pointer transition-all duration-150 border-b last:border-none"
                  >
                    <img
                      src={perfume.image_url || '/placeholder.jpg'}
                      alt={perfume.name}
                      className="w-12 h-12 object-cover rounded-full border border-gray-200"
                    />
                    <div>
                      <div className="font-medium text-gray-800">{perfume.name}</div>
                      {perfume.brands?.name && (
                        <div className="text-sm text-gray-500">{perfume.brands.name}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* If no suggestions */}
            {showSuggestions && suggestions.length === 0 && !loading && debouncedSearchTerm && (
              <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500">
                No perfumes found.
              </div>
            )}
          </div>

          {/* Popular Perfumes Grid */}
          {searchTerm.length === 0 && popularPerfumes.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Popular Picks</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {popularPerfumes.map((perfume) => (
                  <div
                    key={perfume.id}
                    onClick={() => handleSelect(perfume.id)}
                    className="flex flex-col items-center p-4 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition-all duration-200"
                  >
                    <img
                      src={perfume.image_url || '/placeholder.jpg'}
                      alt={perfume.name}
                      className="w-24 h-24 object-cover rounded-full mb-4 border"
                    />
                    <div className="text-center">
                      <div className="font-medium text-gray-800">{perfume.name}</div>
                      {perfume.brands?.name && (
                        <div className="text-sm text-gray-500">{perfume.brands.name}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
