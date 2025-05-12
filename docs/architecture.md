🧱 Database Schema Highlights

perfumes: Main table with name, brand_id, gender, release_year, etc.

brands: Normalized brand table

notes, perfume_notes: Many-to-many for top, middle, base notes

perfumers, perfume_perfumers: Link perfumers to perfumes

clone_relationships: Maps original perfumes to affordable clones

performance_metrics: Longevity, sillage, rating

accords, perfume_accords: Main scent classification

favorites: Stores user-perfume favorites with auth.user_id linkage

🔁 Data Flow

Data is imported from Kaggle dataset using a Python script.

The script normalizes brand, note, and perfumer values before inserting.

Frontend fetches data using Supabase client queries with filtering and joins.

🧪 Features Built

Google-style search with debounce + suggestion dropdown

Perfume detail page (accords, notes, brand, image fallback)

Popular perfume grid when idle

Authentication-ready frontend

Favorite logic structure in place

🧱 Backend Decisions

Supabase chosen for instant auth + normalized Postgres

Python script used for clean data control and multi-table inserts

Separation of notes, accords, and tags for future AI expandability

