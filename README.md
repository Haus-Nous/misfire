# Misfire 🎯
### Cognitive Misconception Diagnosis & Targeted Follow-Up Engine

> **"Same question. Three mistakes. Three different fixes."**

Traditional adaptive learning platforms treat wrong answers as binary points on a difficulty curve — simply dropping a student's score and presenting another generic question. **Misfire** uses LLM-powered cognitive diagnostics to isolate the *exact flawed mental model* behind a student's distractor choice and generates a tailored counter-example question targeted directly at repairing that conceptual gap.

---

## ⚡ Key Highlights

- **Pre-Indexed Misconception Taxonomy**: Covers **Fractions**, **Algebra**, and **Photosynthesis** with 15 granular cognitive error models.
- **4-Part Distinct Diagnostic Reasoning**: Every wrong answer produces:
  1. *Flawed Mental Model* (What flawed rule the student believes)
  2. *Distractor Attractor Rationale* (Why this specific wrong option appealed to that belief)
  3. *Root Cause Cognitive Gap* (The deeper conceptual mechanism)
  4. *Targeted Remedy Strategy* (Actionable pedagogical fix)
- **Mathematically Precise Targeted Follow-Ups**: Dynamically constructs new textbook-style questions where distractors mathematically match the diagnosed misconception in unreduced form without leaking hints in the prompt.
- **Flagship Demo Screen (`/demo`)**: Side-by-side 3-student comparison showing how 3 students answering the same question wrongly receive 3 entirely distinct diagnoses and follow-ups.
- **Interactive Diagnostic Quiz Room (`/quiz`)**: Live interactive quiz experience with staged reveals, rationale breakdowns, and an experimental on-the-fly taxonomy inferencing sandbox for custom user topics.

---

## 🏗️ Architecture & Project Structure

```
/app
  /api
    /diagnose/route.ts        # POST: Misconception classifier with 4 distinct reasoning fields
    /followup/route.ts        # POST: Targeted follow-up question generator with mathematical constraints
    /infer-taxonomy/route.ts  # POST: On-the-fly taxonomy inferencing for custom user topics
  /demo
    page.tsx                  # Flagship 3-column pitch demo ("3 mistakes, 3 fixes")
  /quiz
    page.tsx                  # Interactive diagnostic quiz room + experimental custom mode
  page.tsx                    # Landing page & value proposition
  layout.tsx                  # Base dark-themed shell & global navigation
/components
  QuestionCard.tsx            # Interactive question card with option selection & reasoning
  MisconceptionCard.tsx       # 4-box diagnostic breakdown display
  ComparisonView.tsx          # Side-by-side comparison: Traditional vs. Misfire
/lib
  taxonomy.ts                 # Expert taxonomies (Fractions, Algebra, Photosynthesis)
  questions.ts                # Seed question bank with pre-tagged distractor options
  groq.ts                     # Groq LLM client with retry logic & JSON parsing
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17+ or 20+
- A Groq API Key ([https://console.groq.com](https://console.groq.com))

### 2. Installation & Setup

```bash
# Clone the repository
git clone <repo-url>
cd misfire

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
```

Edit `.env.local` and add your Groq API key:
```ini
GROQ_API_KEY=gsk_your_real_key_here
```

### 3. Run Development Server

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 🔌 API Reference

### `POST /api/diagnose`
Classifies a student's answer against a taxonomy and returns 4 distinct diagnostic reasoning dimensions.

**Request Body:**
```json
{
  "topic": "fractions",
  "question": "Calculate the sum of the two fractions: 1/4 + 2/3",
  "correctAnswer": "11/12",
  "wrongAnswer": "3/7",
  "taxonomy": {
    "denominator_ignored": "Added or subtracted numerators and denominators separately..."
  }
}
```

**Response:**
```json
{
  "misconceptionId": "denominator_ignored",
  "confidence": 0.99,
  "flawedMentalModel": "The student believes you can add fractions by simply adding numerators and denominators separately.",
  "distractorAnalysis": "They added 1 + 2 = 3 for the numerator and 4 + 3 = 7 for the denominator, producing 3/7.",
  "rootCause": "A fundamental gap in recognizing that fractions must share a common denominator before combining.",
  "remedyStrategy": "Use visual area models or equivalent-fraction worksheets to explicitly show the need for a common denominator."
}
```

---

### `POST /api/followup`
Generates a new multiple-choice question that isolates and tests the diagnosed misconception without hinting at the error.

**Request Body:**
```json
{
  "topic": "fractions",
  "misconceptionId": "common_denom_confusion",
  "misconceptionDescription": "Found common denominator but forgot to scale numerators before adding"
}
```

---

### `POST /api/infer-taxonomy`
Generates a dynamic 3-4 item misconception taxonomy on the fly for any custom user-submitted topic.

**Request Body:**
```json
{
  "topic": "Thermodynamics",
  "question": "When heat is added to a gas at constant volume, what happens to internal energy?",
  "correctAnswer": "Internal energy increases"
}
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack dev, Webpack build)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **LLM Engine**: Groq SDK (`openai/gpt-oss-120b`)
- **Icons**: Lucide React
