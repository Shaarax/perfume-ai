import { NextResponse } from 'next/server'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')?.toLowerCase() || ''
  const season = searchParams.get('season') // optional
  const occasion = searchParams.get('occasion') // optional
  const gender = searchParams.get('gender') || ''

  if (query.length < 2) {
    return NextResponse.json({ data: [], error: null })
  }

  const perfumes: Record<number, any> = {}

  // 1. Match by perfume name
  const nameMatch = await supabase
    .from('perfumes')
    .select('id, name, image_url, description, gender, price')
    .ilike('name', `%${query}%`)

  nameMatch.data?.forEach(p => {
    perfumes[p.id] = { ...p, score: 3 } // higher score for direct match
  })

  // 2. Match by brand name
  const brandMatch = await supabase
    .from('perfumes')
    .select('id, name, image_url, description, gender, price, brands:brand_id (name)')
    .ilike('brands.name', `%${query}%`)

  brandMatch.data?.forEach(p => {
    if (!perfumes[p.id]) perfumes[p.id] = { ...p, score: 2 }
    else perfumes[p.id].score += 2
  })

  // 3. Match by note name
  const noteMatch = await supabase
    .from('perfume_notes')
    .select('perfume_id, notes:note_id (name)')
    .ilike('notes.name', `%${query}%`)

  for (const match of noteMatch.data || []) {
    const perfumeId = match.perfume_id
    if (!perfumes[perfumeId]) {
      const { data: p } = await supabase
        .from('perfumes')
        .select('id, name, image_url, description, gender, price')
        .eq('id', perfumeId)
        .single()
      if (p) perfumes[perfumeId] = { ...p, score: 1 }
    } else {
      perfumes[perfumeId].score += 1
    }
  }

  // 4. Apply gender filter
  let filtered = Object.values(perfumes).filter(p => p !== null)
  if (gender) {
    filtered = filtered.filter(p => p.gender === gender)
  }

  // 5. Apply season & occasion filters
  const finalResults = []

  for (const perfume of filtered) {
    let include = true

    if (season) {
      const { data: seasonMatch } = await supabase
        .from('season_tags')
        .select('id')
        .eq('perfume_id', perfume.id)
        .eq('season', season)
      if (!seasonMatch || seasonMatch.length === 0) include = false
    }

    if (occasion && include) {
      const { data: occasionMatch } = await supabase
        .from('occasion_tags')
        .select('id')
        .eq('perfume_id', perfume.id)
        .eq('occasion', occasion)
      if (!occasionMatch || occasionMatch.length === 0) include = false
    }

    if (include) finalResults.push(perfume)
  }

  // 6. Rank by score descending
  finalResults.sort((a, b) => b.score - a.score)

  return NextResponse.json({ data: finalResults, error: null })
} 