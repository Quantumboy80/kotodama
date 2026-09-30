<div align="center">

# 📚 Kotodama

### AI-Powered Note Sharing Platform for Indian College Students


[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=js,ts,html,tailwindcss,react,nextjs,nodejs,bun,postgres,prisma,docker,gcp,git,github,vscode;theme=dark" alt="My Skills" />
  </a>
</p>

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
# 🏗️ System Architecture

Kotodama follows a modular full-stack architecture built around **Next.js**, **React**, **TypeScript**, **Prisma**, **PostgreSQL**, **Better Auth**, **Google Gemini**, and **Sanity CMS**.

The system separates the presentation layer, application logic, data access, database, and external services so that individual modules can be developed and maintained independently.

---

## High-Level Design (HLD)

```mermaid
flowchart TB

    U[Student / User]

    subgraph CLIENT["Presentation Layer"]
        UI[Next.js App Router]
        RC[React Components]
        UI_LIB[shadcn/ui + Tailwind CSS]
    end

    subgraph APP["Application Layer"]
        ROUTES[Server Actions / API Routes]
        AUTH[Authentication & Authorization]
        VALIDATION[Input Validation]
        DAL[Data Access Layer]
    end

    subgraph DOMAIN["Domain Modules"]
        NOTES[Notes & Communities]
        QUIZ[Quiz Engine]
        FLASH[Flashcard Engine]
        AI[AI Chat Service]
        USER[User Management]
    end

    subgraph DATA["Data Layer"]
        PRISMA[Prisma ORM]
        DB[(PostgreSQL)]
    end

    subgraph EXT["External Services"]
        GOOGLE[Google OAuth]
        GEMINI[Google Gemini]
        SANITY[Sanity CMS]
    end

    U --> UI
    UI --> RC
    RC --> ROUTES

    ROUTES --> AUTH
    ROUTES --> VALIDATION
    ROUTES --> DAL

    DAL --> NOTES
    DAL --> QUIZ
    DAL --> FLASH
    DAL --> AI
    DAL --> USER

    AUTH --> GOOGLE

    NOTES --> PRISMA
    QUIZ --> PRISMA
    FLASH --> PRISMA
    USER --> PRISMA

    AI --> GEMINI

    PRISMA --> DB

    UI -. Content .-> SANITY
```

### Architecture Layers

| Layer | Responsibility |
| ---------------------- | -------------------------------------------------------------- |
| **Presentation Layer** | UI, pages, forms, components and user interactions |
| **Application Layer** | Authentication, authorization, validation and request handling |
| **Domain Layer** | Notes, communities, quizzes, flashcards and AI functionality |
| **Data Access Layer** | Centralized database operations |
| **Data Layer** | Prisma ORM and PostgreSQL |
| **External Services** | Google OAuth, Gemini AI and Sanity CMS |

---

# 🔄 Request / Data Flow

A typical authenticated request follows the following flow:

```text
User
  │
  ▼
React / Next.js UI
  │
  ▼
Server Action / API Route
  │
  ├── Validate Input
  │
  ├── Authenticate User
  │
  └── Authorize Operation
          │
          ▼
      Domain Logic
          │
          ▼
      Data Access Layer
          │
          ▼
        Prisma ORM
          │
          ▼
       PostgreSQL
          │
          ▼
        Response
          │
          ▼
        Next.js UI
```

This separation prevents UI components from directly accessing the database and keeps business logic independent from the presentation layer.

---

# 🧩 Low-Level Design (LLD)

## Layered Design

```mermaid
flowchart LR

    VIEW["React / Next.js Components"]

    ACTION["Server Actions / API Routes"]

    SERVICE["Business / Domain Logic"]

    DAL["Data Access Layer"]

    ORM["Prisma ORM"]

    DB[("PostgreSQL")]

    VIEW --> ACTION
    ACTION --> SERVICE
    SERVICE --> DAL
    DAL --> ORM
    ORM --> DB
```

## 1. Presentation Layer

The presentation layer is responsible for:

- Rendering pages
- Handling user interactions
- Forms and validation feedback
- Loading and error states
- Displaying notes
- Displaying quizzes and results
- Flashcard interfaces
- AI chat interface
- Community interfaces

The project follows a modular component structure:

```text
src/
├── app/
├── components/
│   ├── admin/
│   ├── ai/
│   ├── auth/
│   ├── core/
│   ├── flashcard/
│   ├── landing/
│   ├── note/
│   ├── quiz/
│   └── ui/
```

---

## 2. Application Layer

The application layer receives requests from the frontend and coordinates the required operations.

Its responsibilities include:

- Authentication
- Authorization
- Input validation
- Calling business logic
- Calling the Data Access Layer
- Returning responses to the UI

A typical operation looks like:

```text
Create Note
    │
    ▼
Server Action / API
    │
    ▼
Validate Input
    │
    ▼
Check Authentication
    │
    ▼
Check Authorization
    │
    ▼
Data Access Layer
    │
    ▼
Prisma
    │
    ▼
PostgreSQL
```

---

# 3. Data Access Layer (DAL)

Kotodama uses a dedicated **Data Access Layer** to keep database operations separate from UI and business logic.

```text
src/dal/

├── ai/
├── community/
├── note/
├── quiz/
├── user/
└── ...
```

The DAL acts as an abstraction between the application and Prisma.

### Without DAL

```text
Component
    │
    ▼
Prisma
    │
    ▼
Database
```

### With DAL

```text
Component
    │
    ▼
Server Action / API
    │
    ▼
DAL
    │
    ▼
Prisma
    │
    ▼
Database
```

### Benefits

- Separation of concerns
- Centralized database queries
- Reduced code duplication
- Easier testing
- Easier database migrations
- Better authorization control
- Cleaner business logic

---

# 🗄️ Database Design

Kotodama uses **PostgreSQL** as its relational database and **Prisma ORM** for type-safe database access.

The database contains entities for:

- Users
- User profiles
- Authentication sessions
- Universities
- Communities
- Community members
- Notes
- Quizzes
- Questions
- Question options
- Quiz attempts
- Quiz answers
- Flashcard sets
- Flashcard items
- Flashcard visits
- AI chats
- AI chat messages

---

## Entity Relationship Diagram

```mermaid
erDiagram

    USER ||--o| USER_PROFILE : has
    USER ||--o{ SESSION : creates
    USER ||--o{ ACCOUNT : owns
    USER ||--o{ DEVICE_FINGERPRINT : uses

    USER ||--o{ NOTE : creates
    USER ||--o{ COMMUNITY_MEMBER : joins
    USER ||--o{ QUIZ_ATTEMPT : makes
    USER ||--o{ FLASHCARD_VISIT : records
    USER ||--o{ CHAT : owns

    UNIVERSITY ||--o{ COMMUNITY : contains
    UNIVERSITY ||--o{ NOTE : associated_with

    COMMUNITY ||--o{ COMMUNITY_MEMBER : has
    COMMUNITY ||--o{ NOTE : contains

    QUIZ ||--o{ QUESTION : contains
    QUIZ ||--o{ QUIZ_ATTEMPT : receives

    QUESTION ||--o{ QUESTION_OPTION : contains
    QUESTION ||--o{ QUIZ_ANSWER : answered_in

    QUIZ_ATTEMPT ||--o{ QUIZ_ANSWER : contains
    QUESTION_OPTION ||--o{ QUIZ_ANSWER : selected_as

    FLASHCARD_SET ||--o{ FLASHCARD_ITEM : contains
    FLASHCARD_SET ||--o{ FLASHCARD_VISIT : tracked_by
    FLASHCARD_ITEM ||--o{ FLASHCARD_VISIT : visited

    CHAT ||--o{ CHAT_MESSAGE : contains

    USER {
        string id PK
        string name
        string email UK
        string role
        boolean isOnboarded
        boolean isBlocked
        datetime createdAt
    }

    USER_PROFILE {
        string id PK
        string userId FK
        string firstName
        string lastName
        string phoneNumber UK
        enum university
        enum degree
        enum year
        enum semester
    }

    UNIVERSITY {
        string id PK
        string name UK
        string label
    }

    COMMUNITY {
        string id PK
        string universityId FK
        string name
        string description
        string degree
    }

    COMMUNITY_MEMBER {
        string id PK
        string communityId FK
        string userId FK
        enum role
    }

    NOTE {
        string id PK
        string authorId FK
        string communityId FK
        string universityId FK
        string title
        string slug UK
        string content
        string pdfUrl
        string type
        string subject
    }

    QUIZ {
        string id PK
        string title
        string subject
        enum university
        enum degree
        enum year
        enum semester
        int timeLimit
        boolean isPublished
    }

    QUESTION {
        string id PK
        string quizId FK
        string question
        string explanation
        int order
    }

    QUESTION_OPTION {
        string id PK
        string questionId FK
        string text
        boolean isCorrect
        int order
    }

    QUIZ_ATTEMPT {
        string id PK
        string userId FK
        string quizId FK
        int score
        int totalMarks
        decimal accuracy
        int timeTaken
        enum status
    }

    QUIZ_ANSWER {
        string id PK
        string attemptId FK
        string questionId FK
        string selectedOptionId FK
        boolean isCorrect
        int marksAwarded
        int timeTaken
    }

    FLASHCARD_SET {
        string id PK
        string title
        string description
        string subject
        enum university
        enum degree
        enum year
        enum semester
    }

    FLASHCARD_ITEM {
        string id PK
        string setId FK
        string front
        string back
        int order
    }

    FLASHCARD_VISIT {
        string id PK
        string userId FK
        string setId FK
        string cardId FK
        datetime visitedAt
    }

    CHAT {
        string id PK
        string userId FK
        string university
        string degree
        string year
        string semester
        string subject
        string name
    }

    CHAT_MESSAGE {
        string id PK
        string chatId FK
        enum role
        string content
        string model
        datetime createdAt
    }
```

---

# 🧠 Thinking Logic Behind the System

Kotodama is designed as an **integrated academic learning ecosystem**, rather than a collection of independent features.

The core idea is to maintain a common academic context across the platform:

```text
University
     │
     ▼
Degree
     │
     ▼
Year
     │
     ▼
Semester
     │
     ▼
Subject
```

This context can then be reused by different modules.

```text
                       USER
                         │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
     COMMUNITY         NOTES              AI
         │                                 │
         │                                 │
         ▼                                 ▼
     ACADEMIC                         CHAT HISTORY
      CONTEXT                              │
         │                                 │
    ┌────┼────┐                            │
    │    │    │                            ▼
    ▼    ▼    ▼                      PERSONALIZED
  QUIZ FLASHCARD                       ASSISTANCE
    │      │
    ▼      ▼
 PROGRESS PROGRESS
```

The objective is to allow a student to move naturally between:

```text
Learning Material
       ↓
Community
       ↓
Notes
       ↓
AI Assistance
       ↓
Practice
       ↓
Quiz
       ↓
Revision
       ↓
Flashcards
```

---

# 🔐 Authentication Flow

Kotodama uses **Better Auth** with **Google OAuth**.

```mermaid
sequenceDiagram

    actor User
    participant UI as Next.js UI
    participant Auth as Better Auth
    participant Google as Google OAuth
    participant DB as PostgreSQL

    User->>UI: Click "Continue with Google"
    UI->>Auth: Start authentication
    Auth->>Google: OAuth request
    Google-->>Auth: Authorization response
    Auth->>DB: Create / Update User
    Auth->>DB: Create Account + Session
    Auth-->>UI: Authenticated Session
    UI-->>User: Open Dashboard
```

### Authentication Logic

```text
User
  │
  ▼
Google OAuth
  │
  ▼
Better Auth
  │
  ├── Create / Update User
  │
  ├── Create Account
  │
  └── Create Session
          │
          ▼
       PostgreSQL
          │
          ▼
     Authenticated User
```

The application therefore does not need to implement OAuth itself.

---

# 📝 Notes System

The Notes system supports both personal and community-oriented academic notes.

A note can contain information such as:

- Author
- University
- Community
- Degree
- Year
- Semester
- Subject
- Title
- Content
- PDF/document URL

The `communityId` can be optional, allowing the same `Note` entity to support different contexts.

## Notes Flow

```mermaid
flowchart TD

    A[User Creates Note]

    A --> B{Select Visibility}

    B -->|Personal| C[No Community]
    B -->|Community| D[Select Community]

    C --> E[Validate Note]
    D --> E

    E --> F[Authorization Check]
    F --> G[Create Note]
    G --> H[Prisma]
    H --> I[(PostgreSQL)]

    I --> J[Return Note]
    J --> K[Update UI]
```

### Design Reasoning

Instead of maintaining separate tables:

```text
PersonalNote
CommunityNote
```

the system uses a single:

```text
Note
```

with an optional:

```text
communityId
```

This reduces duplication and simplifies querying.

---

# 🏫 University & Community Logic

The community hierarchy is:

```text
University
    │
    └── Community
            │
            ├── Members
            │
            └── Notes
```

A community represents an academic group associated with a university and degree.

```text
University
    │
    ▼
Degree
    │
    ▼
Community
    │
    ├── Student 1
    ├── Student 2
    ├── Student 3
    └── Notes
```

## Joining a Community

```text
User
 │
 ▼
Select University
 │
 ▼
Select Degree
 │
 ▼
Find Community
 │
 ▼
Check Existing Membership
 │
 ▼
Create CommunityMember
 │
 ▼
User becomes Community Member
```

Community membership can support different roles:

```text
MEMBER
MODERATOR
CREATOR
```

This allows permissions to be handled at the community level.

---

# 🤖 AI Chat Architecture

Kotodama integrates **Google Gemini** for AI-powered academic assistance.

The database separates a conversation from its individual messages:

```text
Chat
 │
 ├── User Message
 │
 ├── Assistant Message
 │
 ├── User Message
 │
 └── Assistant Message
```

The `Chat` entity also stores academic context:

```text
University
Degree
Year
Semester
Subject
```

This allows the AI system to understand the student's academic context.

---

## AI Request Flow

```mermaid
sequenceDiagram

    actor Student
    participant UI as AI Chat UI
    participant API as Next.js Server
    participant DB as PostgreSQL
    participant AI as Gemini

    Student->>UI: Enter Question

    UI->>API: Send Message + Chat ID

    API->>API: Authenticate User
    API->>API: Validate Request

    API->>DB: Load Chat Context
    DB-->>API: Previous Messages

    API->>DB: Save User Message

    API->>AI: Send Context + Question

    AI-->>API: Generate Response

    API->>DB: Save Assistant Message

    API-->>UI: Return Response

    UI-->>Student: Display AI Answer
```

### AI Design Principle

The AI model should **not be responsible for application state**.

PostgreSQL remains the source of truth for:

```text
Users
Chats
Messages
Academic Context
```

Gemini is responsible for:

```text
Understanding
     ↓
Reasoning
     ↓
Response Generation
```

This also makes it possible to replace the AI provider in the future without redesigning the entire application.

---

# 📋 Quiz System

The quiz system follows a hierarchical structure:

```text
Quiz
 │
 ├── Question
 │      │
 │      └── QuestionOption
 │
 └── QuizAttempt
          │
          └── QuizAnswer
```

Each quiz can contain:

- Questions
- Multiple options
- Correct answers
- Explanations
- Time limits
- Academic metadata

Each attempt can store:

- Score
- Total marks
- Accuracy
- Time taken
- Attempt status
- Individual answers

---

## Quiz Flow

```mermaid
flowchart TD

    A[Student Selects Quiz]

    A --> B[Load Quiz]
    B --> C[Load Questions]
    C --> D[Generate Randomization]

    D --> E[Create QuizAttempt]

    E --> F[Start Timer]

    F --> G[Display Question]

    G --> H[Student Selects Option]

    H --> I[Record Answer]

    I --> J{More Questions?}

    J -->|Yes| G
    J -->|No| K[Calculate Score]

    K --> L[Calculate Accuracy]
    L --> M[Store Quiz Answers]
    M --> N[Complete Quiz Attempt]
    N --> O[Display Result]
```

### Quiz Attempt States

```text
IN_PROGRESS
      │
      ├──────────────► COMPLETED
      │
      ├──────────────► ABANDONED
      │
      └──────────────► TIME_UP
```

---

# 🎲 Quiz Randomization

The quiz system can store randomization seeds for questions and options.

Instead of relying only on client-side randomization:

```text
Quiz
 │
 ├── questionSeed
 └── optionSeed
```

the ordering can be reproduced for a particular attempt.

This is useful for:

- Maintaining consistent ordering
- Reconstructing an attempt
- Handling page refreshes
- Reviewing previous attempts
- Avoiding inconsistent question sequences

---

# 🃏 Flashcard System

Flashcards are organized into sets.

```text
FlashcardSet
      │
      ├── FlashcardItem
      ├── FlashcardItem
      └── FlashcardItem
```

User activity is tracked separately:

```text
User
 │
 ▼
FlashcardVisit
 │
 ├── Flashcard Set
 ├── Optional Card
 └── Visited At
```

This separates **learning content** from **user activity**.

---

## Flashcard Flow

```mermaid
flowchart LR

    USER[Student]

    SET[Flashcard Set]

    CARD[Flashcard Item]

    VISIT[Flashcard Visit]

    DB[(PostgreSQL)]

    USER --> SET
    SET --> CARD

    USER --> VISIT
    CARD --> VISIT

    SET --> DB
    CARD --> DB
    VISIT --> DB
```

This design makes it possible to introduce more advanced learning analytics later without modifying the actual flashcard content structure.

---

# 🔐 Security & Authorization

Authentication and authorization are treated as separate concepts.

### Authentication

Answers:

> **Who is the user?**

Handled through Better Auth and Google OAuth.

### Authorization

Answers:

> **What can the user do?**

The system can use application-level roles such as:

```text
USER
ADMIN
```

and community-level roles such as:

```text
MEMBER
MODERATOR
CREATOR
```

Additional user state can include:

```text
isOnboarded
isBlocked
```

This allows authorization rules to be applied at different levels.

---

# 🧠 Complete User Journey

A typical student's journey through Kotodama can look like:

```text
                  ┌─────────────────┐
                  │ Google Login    │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Student Profile │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ University      │
                  │ Degree / Year   │
                  │ Semester        │
                  └────────┬────────┘
                           │
               ┌────────────┼────────────┐
               │            │            │
               ▼            ▼            ▼
            Community     Notes          AI
               │            │            │
               │            │            ▼
               │            │        AI Assistance
               │            │
               └──────┬─────┘
                      │
                      ▼
                   Practice
                      │
              ┌───────┴───────┐
              ▼               ▼
            Quiz          Flashcards
              │               │
              ▼               ▼
           Results         Progress
```

---

# 🔄 Example Learning Workflow

Suppose a student is studying **Machine Learning**.

The student has:

```text
University : IEM
Degree     : B.Tech
Year       : 3rd Year
Semester   : 6th
Subject    : Machine Learning
```

### Step 1 — Find Notes

```text
Student
   ↓
Search Notes
   ↓
Filter by academic context
   ↓
Machine Learning Notes
```

### Step 2 — Ask AI

```text
Student Question
       ↓
Chat Context
       ↓
Academic Context
       ↓
Gemini
       ↓
AI Response
       ↓
ChatMessage
```

### Step 3 — Practice Quiz

```text
Machine Learning Quiz
        ↓
Questions
        ↓
Quiz Attempt
        ↓
Answers
        ↓
Score
        ↓
Accuracy
```

### Step 4 — Revise

```text
Flashcard Set
      ↓
Flashcard Items
      ↓
Student Interaction
      ↓
FlashcardVisit
```

The different modules therefore form a single learning workflow.

---

# 📐 Core Design Decisions

| Decision | Reason |
| ---------------------------- | ---------------------------------------------------------------- |
| **Next.js** | Provides the application and presentation layer in one framework |
| **React** | Component-based UI architecture |
| **TypeScript** | Type safety across the application |
| **Prisma** | Type-safe database access |
| **PostgreSQL** | Strong relational model for academic and community data |
| **Better Auth** | Handles authentication and sessions |
| **Google OAuth** | Simple and secure user authentication |
| **Gemini** | AI-powered academic assistance |
| **Sanity CMS** | Separates managed content from transactional application data |
| **DAL** | Separates database operations from business logic |
| **Normalized Schema** | Reduces data duplication |
| **Academic Context** | Enables university/degree/year/semester based personalization |
| **Separate Activity Models** | Keeps learning content independent from user progress |

---

# 📈 Scalability Considerations

The application layer is designed so that multiple application instances can operate against the same database.

```text
                    ┌────────────────────┐
                    │    Load Balancer   │
                    └─────────┬──────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
          Next.js App    Next.js App    Next.js App
           Instance 1     Instance 2     Instance 3
                │             │             │
                └─────────────┼─────────────┘
                              │
                              ▼
                         PostgreSQL
```

Future scalability improvements can include:

### Database

- Connection pooling
- Query optimization
- Proper indexing
- Read replicas
- Database partitioning for large activity tables

### AI

- Response caching
- Request throttling
- Streaming responses
- Model fallback
- Conversation summarization
- AI request rate limiting

### Application

- CDN for static assets
- Background workers
- Distributed caching
- API rate limiting
- Centralized logging
- Application monitoring

---

# 🔮 Future Architecture Possibilities

The current architecture can be extended without fundamentally changing the existing system.

```text
Current System
     │
     ├── Notes
     ├── Communities
     ├── Quiz
     ├── Flashcards
     └── AI Chat
             │
             ▼
       Future Extensions
             │
     ├── Learning Analytics
     ├── Recommendation Engine
     ├── Spaced Repetition
     ├── AI Study Plans
     ├── Personalized Quizzes
     ├── Progress Dashboard
     └── Collaborative Study
```

Because the system already separates users, content and user activity, these features can be added without tightly coupling them to existing modules.

---

# 🧱 Overall Architecture Summary

```text
                         KOTODAMA
                            │
                 ┌──────────┴──────────┐
                 │                     │
             FRONTEND               BACKEND
                 │                     │
          Next.js / React       Server Actions / APIs
                 │                     │
                 │              ┌──────┴──────┐
                 │              │             │
                 │             Auth          DAL
                 │              │             │
                 │              │             ▼
                 │              │          Prisma
                 │              │             │
                 │              │             ▼
                 │              │        PostgreSQL
                 │
                 └──────────────┬──────────────┐
                                │              │
                              Gemini         Sanity
                                │              │
                                ▼              ▼
                           AI Learning      Managed
                           Assistance        Content
```

The architecture follows a simple principle:

> **Keep the UI, business logic, database operations, and external services loosely coupled.**

This makes Kotodama easier to maintain, extend and scale while keeping the core learning experience centered around the student's academic context.

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
