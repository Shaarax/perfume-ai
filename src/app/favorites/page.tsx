'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Favorite = {
  id: string
  user_id: string
  perfume_id: string
  created_at: string
  perfumes: {
    id: string
    name: string
    image_url: string
    gender: string
    price: number
  }
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            id,
            user_id,
            perfume_id,
            created_at,
            perfumes (
              id,
              name,
              image_url,
              gender,
              price
            )
          `)
          .eq('user_id', user.id)

        if (error) throw error
        setFavorites(data as unknown as Favorite[])
      } catch (error) {
        console.error('Error fetching favorites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-lg">
          Please{' '}
          <Link href="/login" className="text-pink-500 hover:text-pink-600 underline">
            log in
          </Link>{' '}
          to view your favorites.
        </p>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your Favorite Perfumes</h1>
          <p className="text-gray-600">You have no favorites yet!</p>
          <Link 
            href="/" 
            className="mt-4 inline-block bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Discover Perfumes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Favorite Perfumes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map(fav => (
          <Link 
            key={fav.id} 
            href={`/perfume/${fav.perfume_id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-square relative">
                {fav.perfumes.image_url ? (
                  <img 
                    src={fav.perfumes.image_url} 
                    alt={fav.perfumes.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-lg group-hover:text-pink-500 transition-colors">
                  {fav.perfumes.name}
                </h2>
                {fav.perfumes.gender && (
                  <p className="text-sm text-gray-600 capitalize">
                    {fav.perfumes.gender}
                  </p>
                )}
                {fav.perfumes.price && (
                  <p className="text-sm text-gray-600">
                    ${fav.perfumes.price}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 