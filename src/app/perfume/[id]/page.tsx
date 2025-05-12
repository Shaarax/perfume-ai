'use client'

import { useState, useEffect } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/supabase'
import { FavoriteButton } from '@/components/ui/favorite-button'

export default function PerfumeDetail() {
  const supabase = createBrowserSupabaseClient<Database>()
  const params = useParams()
  const router = useRouter()

  const { id } = params

  const [perfume, setPerfume] = useState<any>(null)
  const [notes, setNotes] = useState<any[]>([])
  const [accords, setAccords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUserId(session?.user?.id || null)
    }
    checkAuth()
  }, [supabase])

  useEffect(() => {
    if (id) {
      fetchPerfume()
    }
  }, [id])

  const fetchPerfume = async () => {
    setLoading(true)

    try {
      const { data: perfumeData } = await supabase
        .from('perfumes')
        .select('id, name, image_url, release_year, description, gender, brands(name)')
        .eq('id', id)
        .single()

      if (perfumeData) setPerfume(perfumeData)

      const { data: notesData } = await supabase
        .from('perfume_notes')
        .select('notes(name, note_type)')
        .eq('perfume_id', id)

      if (notesData) setNotes(notesData)

      const { data: accordsData } = await supabase
        .from('perfume_accords')
        .select('accords(name)')
        .eq('perfume_id', id)

      if (accordsData) setAccords(accordsData)

      setLoading(false)
    } catch (error) {
      console.error('Error fetching perfume:', error)
      setError('Failed to fetch perfume details')
      setLoading(false)
    }
  }

  const addToFavorites = async () => {
    if (!userId) {
      const confirm = window.confirm('You need to log in to favorite this perfume. Do you want to log in?')
      if (confirm) window.location.href = '/login'
      return
    }

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('perfume_id', perfume?.id)

        if (error) throw error
        setIsFavorite(false)
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: userId,
            perfume_id: perfume?.id
          })

        if (error) throw error
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  // Check if perfume is favorited when component mounts
  useEffect(() => {
    const checkFavorite = async () => {
      if (!userId || !perfume) return

      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', userId)
          .eq('perfume_id', perfume.id)
          .single()

        if (error) throw error
        setIsFavorite(!!data)
      } catch (error) {
        console.error('Error checking favorite:', error)
      }
    }

    checkFavorite()
  }, [userId, perfume, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Perfume Not Found</h1>
          <p className="text-gray-600 mb-6">The perfume you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  if (!perfume) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Perfume Not Found</h1>
          <p className="text-gray-600 mb-6">The perfume you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center">
          {/* Perfume Image */}
          <div className="relative mb-12">
            <img
              src={perfume.image_url || '/placeholder.jpg'}
              alt={perfume.name}
              className="w-64 h-64 object-cover rounded-full border-8 border-white shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 rounded-full border-8 border-purple-100 opacity-50"></div>
          </div>

          {/* Perfume Name + Brand */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif font-bold text-gray-800 mb-4 tracking-tight">
              {perfume.name}
            </h1>
            {perfume.brands?.name && (
              <p className="text-xl text-gray-600 font-light tracking-wider">
                {perfume.brands.name}
              </p>
            )}
          </div>

          {/* Main Accords */}
          {accords.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {accords.map((a: any, idx: number) => (
                <span
                  key={idx}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-medium tracking-wide shadow-sm hover:shadow-md transition-shadow"
                >
                  {a.accords.name}
                </span>
              ))}
            </div>
          )}

          {/* Notes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl mb-16">
            {['top', 'middle', 'base'].map((type) => (
              <div key={type} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-serif font-semibold mb-6 capitalize text-center text-gray-800">
                  {type} Notes
                </h2>
                <ul className="list-none space-y-3 text-center">
                  {notes
                    .filter((n: any) => n.notes.note_type === type)
                    .map((n: any, idx: number) => (
                      <li key={idx} className="text-gray-700 font-light tracking-wide">
                        {n.notes.name}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Description */}
          {perfume.description && (
            <div className="max-w-3xl text-center">
              <p className="text-gray-600 leading-relaxed font-light tracking-wide">
                {perfume.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
