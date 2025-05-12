'use client'

import { Heart } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useState, useEffect } from 'react'
import type { Database } from '@/types/supabase'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
  perfumeId: number
  className?: string
}

export function FavoriteButton({ perfumeId, className }: FavoriteButtonProps) {
  const [supabase] = useState(() => 
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUserId(session?.user?.id || null)
    }
    checkAuth()
  }, [supabase])

  const checkFavorite = async () => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('perfume_id', perfumeId)
        .single()

      if (error) throw error
      setIsFavorite(!!data)
    } catch (error) {
      console.error('Error checking favorite:', error)
    }
  }

  const addToFavorites = async () => {
    if (!userId) {
      const confirm = window.confirm('You need to log in to favorite perfumes. Would you like to log in now?')
      if (confirm) {
        router.push('/login')
      }
      return
    }

    setIsLoading(true)
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('perfume_id', perfumeId)

        if (error) throw error
        setIsFavorite(false)
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: userId,
            perfume_id: perfumeId
          })

        if (error) throw error
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Check if perfume is favorited when component mounts or userId changes
  useEffect(() => {
    checkFavorite()
  }, [userId])

  return (
    <button
      onClick={addToFavorites}
      disabled={isLoading}
      className={`
        p-2 rounded-lg transition-colors
        ${isFavorite 
          ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
          : 'bg-white/10 text-white hover:bg-white/20'
        }
        ${className}
      `}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className="w-5 h-5" 
        fill={isFavorite ? 'currentColor' : 'none'} 
      />
    </button>
  )
} 