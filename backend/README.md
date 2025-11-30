# Momentum AI Backend

OpenAI-powered study guide generation API for Momentum AI.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and add your OpenAI API key:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The API will run on http://localhost:5000

## Endpoints

### POST /api/study-guide/generate

Generates a personalized study guide using GPT-4.

**Request Body:**
```json
{
  "subject": "Mathematics",
  "topic": "Quadratic Equations",
  "grade": 10,
  "learningStyle": "visual",
  "difficulty": "intermediate",
  "studentName": "Student Name",
  "courseCode": "MATH-101",
  "courseName": "Algebra II",
  "georgiaStandards": []
}
```

**Response:**
```json
{
  "id": "guide-1234567890",
  "title": "Quadratic Equations: Fundamentals",
  "subject": "Mathematics",
  "topic": "Quadratic Equations",
  "difficulty": "intermediate",
  "content": {
    "overview": "...",
    "keyPoints": [...],
    "examples": [...],
    "practiceProblems": [...],
    "resources": [...]
  },
  "generatedAt": "2025-11-30T07:00:00.000Z",
  "basedOnSurvey": "latest"
}
```

## Features

- 🤖 **GPT-4 Powered**: Real AI generation using OpenAI API
- 📚 **RAG System**: Retrieves Georgia Standards for context
- 📐 **LaTeX Support**: Mathematical equations rendered beautifully
- 🎨 **Learning Style Adaptation**: Visual, Auditory, Kinesthetic, Reading/Writing
- ✨ **Interactive Problems**: Complete with hints and step-by-step solutions

