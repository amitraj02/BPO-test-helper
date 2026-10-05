# BPO Prep AI – AI-Powered Concentrix US BPO Non-Voice Assessment Preparation

![BPO Prep AI Architecture](./project_BPO%20prep%20AI.png)

An interactive, AI-powered recruitment assessment preparation platform designed for candidates preparing for **Concentrix US BPO Non-Voice (Email & Chat Support)** hiring rounds in Bengaluru and global hubs.

---

## 🌟 Key Features & Modules

1. **Round 2: English Grammar & Vocabulary**
   - Covers tenses, articles, prepositions, subject-verb agreement, sentence correction, synonyms/antonyms, and professional tone.
   - Configurable question counts (10, 20, 30) with explanations for every question.

2. **Round 2: Reading Comprehension**
   - Business support passages (e-commerce policies, SLA rules, escalation guidelines).
   - Side-by-side passage reader with text size adjustment and comprehension questions.

3. **Round 3: Typing Speed & Accuracy Benchmark**
   - In-browser interactive typing test (1, 2, 3, and 5-minute options).
   - Real-time Gross WPM, Net WPM, live accuracy percentage, and character-by-character color highlighting.
   - Zero AI request needed; executes 100% in browser.

4. **Round 4: Written Email Communication**
   - Realistic US customer support ticket scenarios (delayed delivery, refund disputes, billing errors).
   - Audited against an official 100-point rubric:
     - **Grammar & Spelling (25 pts)**
     - **Professional Tone (20 pts)**
     - **Clarity & Readability (20 pts)**
     - **Completeness (20 pts)**
     - **Customer Empathy (15 pts)**
   - Returns detailed feedback, identified strengths, mistakes, and an improved benchmark model response.

5. **Round 6: Live Customer Chat Simulation**
   - Interactive chat simulation where AI plays the role of a realistic US customer (frustrated, urgent, confused).
   - Multi-turn conversation evaluated on communication, empathy, accuracy, problem-solving, professionalism, and resolution.

6. **Round 5: Aptitude & Logical Reasoning**
   - Percentages, ratios, averages, number series, arithmetic, and logical sequencing.
   - Calculator-free practice matching BPO test conditions.

7. **Round 6: Customer Service Scenarios**
   - Practical situations: angry customers, missing information, and First Contact Resolution (FCR).

8. **Round 1 & 6: HR & Operations Interview Practice**
   - Practice the top 8 screening questions (Tell me about yourself, 24/7 rotational night shifts, non-voice preference, repetitive work, strengths).
   - Includes interviewer tips, expected key points, model high-scoring answers, and AI answer evaluation.

9. **Comprehensive Mock Assessment**
   - Configurable 45-minute multi-section assessment combining all 6 rounds with a consolidated performance report.

10. **Candidate Dashboard & Analytics**
    - Score progression curves (Recharts), topic strengths and weaknesses, recent test logs, and printable report generator.
    - Zero external database required (uses encrypted browser `localStorage`).

---

## 🏗️ System Architecture

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS
- **UI & Icons**: Lucide React, Glassmorphism design system, Dark/Light mode
- **Backend API**: Next.js Route Handlers (`/api/generate`, `/api/evaluate`, `/api/chat`, `/api/study-plan`)
- **AI Engine**: OpenAI API (`gpt-4o` / `gpt-4o-mini`) with structured JSON outputs and Zod schema validation
- **Offline Fallback Engine**: Comprehensive built-in question bank that activates automatically if an OpenAI API key is not configured or offline.

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js 18.17+ or Node.js 20+ (tested on Node.js v25)
- npm or pnpm

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o
```
*(Note: If `OPENAI_API_KEY` is not provided, the app will run with its offline verified question bank and simulated rubric evaluator).*

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## ☁️ Vercel Deployment

1. Push your repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Under **Environment Variables**, set:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `OPENAI_MODEL`: `gpt-4o` (or `gpt-4o-mini`)
4. Click **Deploy**.

---

## ⚖️ Official Disclaimer

*BPO Prep AI is an independent educational training platform powered by AI. It is **not affiliated with, endorsed by, or operated by Concentrix** or any of its subsidiaries. Official recruitment information and verified career openings can be found at [jobs.concentrix.com](https://jobs.concentrix.com).*
