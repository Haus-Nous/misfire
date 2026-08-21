# Misfire 🎯
### Intelligent EdTech Engine that Diagnoses the *Specific Misconception* Behind Wrong Answers and Generates Targeted Remediation

[![Live Demo](https://img.shields.io/badge/Live%20Demo-misfire--eta.vercel.app-00df8f?style=for-the-badge&logo=vercel&logoColor=black)](https://misfire-eta.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Haus--Nous%2Fmisfire-181717?style=for-the-badge&logo=github)](https://github.com/Haus-Nous/misfire)

> **Live Application**: [https://misfire-eta.vercel.app/](https://misfire-eta.vercel.app/)

---

## 💡 The Problem: Why Traditional Adaptive Learning Fails

> *"Teaching that responds to HOW someone got it wrong — not just THAT they got it wrong."*

Standard adaptive learning platforms treat wrong answers as **binary failure events**. When a student makes a mistake:
1. The platform drops their difficulty score by one level.
2. It serves the next random question in the sequence.
3. **The student's flawed mental model remains completely unaddressed.**

### Why This Matters
Two students who miss the same question rarely fail for the same reason:
- **Student A** adding $\frac{1}{4} + \frac{2}{3} \rightarrow \frac{3}{7}$ has a **procedural gap** (treating numerators and denominators as independent whole numbers).
- **Student B** choosing $\frac{3}{12}$ has a **fraction conversion gap** (finding a common denominator but forgetting to scale numerators).
- **Student C** choosing $\frac{2}{7}$ has an **arithmetic operation inversion**.

Giving all three students "a slightly easier fraction drill" wastes instructional time. **Misfire isolates the exact underlying misconception and instantly generates a targeted counter-example question to repair that specific cognitive gap.**

---

## 🏗️ Architecture Flow

```mermaid
flowchart LR
    A[Student Submits Wrong Answer] --> B[/api/diagnose\nGroq LLM Engine]
    B --> C[Classify Flawed Mental Model\n4-Dimension Breakdown]
    C --> D[/api/followup\nGroq LLM Engine]
    D --> E[Generate Mathematically Targeted\nCounter-Example Question]
    E --> F[Present Personalized Remediation\nto Student]
```

---

## ⚡ Key Features

- **🔍 4-Dimension Cognitive Reasoning Breakdown**:
  - **Flawed Mental Model**: What incorrect rule the student applied (in plain language).
  - **Distractor Attractor Rationale**: Why this specific wrong answer was appealing.
  - **Root Cause Cognitive Gap**: The deeper conceptual misunderstanding.
  - **Targeted Remedy Strategy**: Concrete, actionable guidance for teachers and learners.
- **🎯 Flagship 3-Column Pitch Demo (`/demo`)**:
  - Side-by-side comparison showing how **three students answering the same question wrongly** receive **three completely different diagnoses and follow-ups**.
  - Controlled presenter pacing via live "Run Diagnosis" trigger.
- **🧪 Interactive Diagnostic Quiz Room (`/quiz`)**:
  - Staged reveal UX: Question $\rightarrow$ Real-time Diagnosis $\rightarrow$ Remediation Bridge $\rightarrow$ Interactive Targeted Follow-Up.
- **✨ Experimental Custom Topic Mode**:
  - Allows users to enter any subject, question, and wrong answer.
  - Dynamically infers a plausible misconception taxonomy on the fly via Groq LLM before executing the diagnostic chain.
- **📐 Mathematical Rigor & Clean Output**:
  - Strict system constraints guarantee distractors match the exact computed outcome of the flawed method in unreduced plain-text format (e.g., `8/24`, not raw LaTeX or arbitrary wrong numbers).

---

## 📸 Screenshots

<!-- Note: Drop your actual demo screenshots into the repo or replace these paths -->
![Misfire 3-Column Flagship Demo](https://raw.githubusercontent.com/Haus-Nous/misfire/main/public/demo-screen-placeholder.png)
*Flagship 3-Column View: "Same question. Three mistakes. Three different fixes."*

![Interactive Quiz Room & Misconception Diagnosis](https://raw.githubusercontent.com/Haus-Nous/misfire/main/public/quiz-screen-placeholder.png)
*Interactive Quiz Room with Staged 4-Box Cognitive Diagnosis and Remediation Bridge*

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack dev, Webpack build)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **LLM Inference**: [Groq SDK](https://groq.com/) (`qwen/qwen3.6-27b`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Quickstart & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Haus-Nous/misfire.git
cd misfire
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the project root:
```bash
cp .env.local.example .env.local
```

Add your Groq API key (get one free at [console.groq.com](https://console.groq.com)):
```ini
GROQ_API_KEY=gsk_your_groq_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
npm run start
```

---

## 👥 Hackathon Submission Info

- **Project Name**: Misfire
- **Team**: The White Knight
- **Track / Problem Statement**: EdTech #1 — Teaching that responds to how someone got it wrong
- **Live URL**: [https://misfire-eta.vercel.app/](https://misfire-eta.vercel.app/)
- **Repository**: [https://github.com/Haus-Nous/misfire](https://github.com/Haus-Nous/misfire)
