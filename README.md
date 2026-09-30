<div align="center">

# 📚 Kotodama

### AI-Powered Note Sharing Platform for Indian College Students

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Kotodama** is a full-stack SaaS platform where college students across India can share notes, join university communities, take quizzes, study with flashcards, and chat with AI — all in one place.

[Live Demo](#) · [Report Bug](https://github.com/Quantumboy80/kotodama/issues) · [Request Feature](https://github.com/Quantumboy80/kotodama/issues)

</div>

---

## ✨ Features

### 📝 Notes System
- Upload, share, and discover notes across universities and degree streams
- Filter by university, degree, year, and semester
- Community-driven content with upvotes and engagement

### 🏫 University Communities
- **25+ Indian universities** pre-loaded (IITs, NITs, BITS, VTU, Anna University, AKTU, RGPV, and more)
- Users can **register their own college** — visible to all users platform-wide
- One-click join to university communities organized by degree stream (B.Tech CSE, IT, ECE, BCA, MCA, etc.)
- Search and discover communities across India

### 🤖 AI Chat
- Powered by **Google Gemini AI**
- Subject-specific AI agents for targeted academic help
- Context-aware conversations for better study assistance

### 📋 Quiz System
- Admin-created quizzes with bulk import support
- Timed quiz sessions with countdown
- Score breakdown, progress tracking, and leaderboard

### 🃏 Flashcards
- Spaced repetition study cards
- Admin and user-created decks
- Track study progress over time

### 🔐 Authentication & Security
- Google OAuth via Better Auth
- Device fingerprinting and multi-device management
- Secure session handling

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Motion, Lenis |
| **Backend** | Next.js API Routes, Server Actions, Prisma ORM |
| **Database** | PostgreSQL |
| **CMS** | Sanity CMS (Headless) with Portable Text |
| **AI** | Google Gemini AI with custom system prompts |
| **Auth** | Better Auth (Google OAuth) |
| **Dev Tools** | Turbopack, ESLint, Prettier, Husky |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun**
- **PostgreSQL** database (local or cloud — [Neon](https://neon.tech) / [Supabase](https://supabase.com) for free)
- **Google Cloud Console** project (for OAuth)
- **Sanity** account (for CMS)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Quantumboy80/kotodama.git
   cd kotodama
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/kotodama"

   # Better Auth
   BETTER_AUTH_SECRET="your-random-secret-key"
   BETTER_AUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Sanity CMS
   NEXT_PUBLIC_SANITY_PROJECT_ID="your-sanity-project-id"
   NEXT_PUBLIC_SANITY_DATASET="production"
   SANITY_API_TOKEN="your-sanity-api-token"

   # Google Gemini AI
   GEMINI_API_KEY="your-gemini-api-key"


   # Telegram Bot (optional - for admin notifications)
   TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
   TELEGRAM_CHANNEL_ID="your-channel-id"
   ```

4. **Set up the database**

   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser** at [http://localhost:3000](http://localhost:3000)

7. **Access Sanity Studio** at [http://localhost:3000/studio](http://localhost:3000/studio) for content management

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (admin)/                  # Admin dashboard routes
│   ├── (auth)/                   # Authentication pages
│   ├── (staticPages)/            # Static pages (about, privacy, terms)
│   ├── (user)/                   # User dashboard routes
│   │   ├── ai/                   # AI chat page
│   │   ├── notes/                # Notes, communities, personal notes
│   │   ├── profile/              # User profile
│   │   └── quiz/                 # Quiz system
│   └── api/                      # API endpoints
├── components/                   # React components
│   ├── admin/                    # Admin dashboard
│   ├── ai/                       # AI chat interface
│   ├── auth/                     # Auth & onboarding
│   ├── core/                     # Core layout (navbar, footer, sidebar)
│   ├── flashcard/                # Flashcard components
│   ├── landing/                  # Landing page
│   ├── note/                     # Notes & communities UI
│   ├── premium/                  # Premium & payment
│   ├── quiz/                     # Quiz components
│   └── ui/                       # shadcn/ui primitives
├── dal/                          # Data Access Layer
│   ├── ai/                       # AI chat queries
│   ├── community/                # Community & university actions
│   ├── note/                     # Note CRUD
│   ├── premium/                  # Premium system
│   ├── quiz/                     # Quiz system
│   ├── referral/                 # Referral system
│   └── user/                     # User management & onboarding
├── hooks/                        # Custom React hooks
├── lib/                          # Core libraries (auth, db, payments)
├── sanity/                       # Sanity CMS schemas & config
├── utils/                        # Utilities & config
│   ├── academic-config.ts        # University/degree/semester hierarchy
│   ├── ai-system-prompt.ts       # AI agent system prompts
│   └── config.ts                 # App configuration
└── types/                        # TypeScript definitions
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your `kotodama` repository
3. Add all environment variables from your `.env` file
4. Set `DATABASE_URL` to a production PostgreSQL (e.g., [Neon](https://neon.tech))
5. Deploy!

### Post-Deployment

```bash
# Run against your production database to sync schema
npx prisma db push
```

---

## 🎓 Supported Universities

Kotodama comes pre-loaded with 25+ Indian universities including:

> IIT Bombay, IIT Delhi, IIT Madras, IIT Kharagpur, NIT Trichy, NIT Surathkal, BITS Pilani, Delhi University, SPPU, Mumbai University, VTU, Anna University, AKTU, RGPV, Jadavpur University, Calcutta University, MAKAUT, SRM, VIT Vellore, Manipal, Amity, Thapar, Chandigarh University, and more.

**Don't see your college?** Users can register any college/university directly from the platform — it becomes available to all users instantly.

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Use TypeScript for all new code
- Follow the existing DAL (Data Access Layer) pattern for data mutations
- Use Zod for validation, React Hook Form for forms
- Use conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`)

---

<div align="center">

**Built with ❤️ for Indian college students**

[⬆ Back to Top](#-kotodama)

</div>
