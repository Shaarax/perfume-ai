# 🌸 Perfume AI — Smart Fragrance Discovery Engine

Perfume AI is a full-stack, AI-ready fragrance discovery platform built with Next.js and Supabase.  
It helps users search, explore, and understand perfumes using structured data — including notes, accords, perfumers, and clone relationships.

---

## 🚀 Features

- 🔍 Google-style instant search with live suggestions
- 📖 Perfume detail pages with brand, description, notes, accords
- 🧠 Normalized schema: perfumes, notes, accords, perfumers, tags, clones
- 🗃 Public fragrance dataset loader with Python script
- 📸 Image fallback system for perfumes without bottle photos
- 🔐 Supabase Auth ready (favorites feature in progress)

---

## 🧰 Tech Stack

| Layer       | Tech                              |
|-------------|------------------------------------|
| Frontend    | Next.js (App Router), Tailwind CSS |
| Backend     | Supabase (PostgreSQL + Auth)       |
| Scripts     | Python (AI, CSV import)            |
| Auth        | Supabase email / OAuth             |

---

## 📦 Dataset Used

> Source: [Parfumo Fragrance Dataset (Kaggle)](https://www.kaggle.com/datasets/olgagmiufana1/parfumo-fragrance-dataset)

Used only for development/testing.

---

## 🧠 Project Vision

Perfume AI aims to be a scalable, intelligent engine for scent discovery — combining data, AI, and personalization.

### In Progress / upcoming:
- 💖 Favorite perfumes
- 🎯 Occasion & season filtering
- 🔍 Accord-based search
- 🔬 AI clone suggestion engine
- ✨ AI-generated custom perfumes

---

## 🛠 Getting Started

```bash
git clone https://github.com/Shaarax/perfume-ai.git
cd perfume-ai
npm install
npm run dev
