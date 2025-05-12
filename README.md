# 🌸 Perfume AI — Smart Fragrance Discovery Engine

Perfume AI is a modern fragrance discovery platform powered by **Next.js**, **Supabase**, and an extensible database schema — designed to help users explore, search, and understand perfumes through notes, accords, and perfumers.

---

## 🔥 Features (MVP Phase)

- 🔍 Google-style instant search
- 📖 Perfume detail page (brand, description, accords, notes)
- 🧠 Supabase schema with full normalization
- 💾 Data import script from public fragrance datasets
- 📸 Clean fallback images for perfumes without photos
- 🔐 Optional login support via Supabase (favorites coming soon)

---

## 📚 Stack

- **Frontend**: Next.js App Router + TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Data Import**: Python script + Supabase client
- **Styling**: TailwindCSS + minimalist design

---

## 🚀 Setup Instructions

```bash
git clone https://github.com/Shaarax/perfume-ai.git
cd perfume-ai
npm install
npm run dev
