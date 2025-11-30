import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface StudyGuideParams {
  subject: string
  topic: string
  grade: number
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  studentName: string
  courseCode?: string
  courseName?: string
  georgiaStandards?: any[]
}

const SYSTEM_PROMPT = `You are an expert educational content creator specializing in creating highly engaging, personalized study guides for high school students in Georgia.

Your study guides must:
- Align with Georgia Standards of Excellence
- Adapt to the student's learning style (visual, auditory, kinesthetic, reading/writing)
- Include LaTeX-formatted mathematical equations using $ delimiters (e.g., $x^2$, $\\frac{dy}{dx}$, $\\int x dx$)
- Provide clear, encouraging explanations with worked examples
- Include interactive practice problems with detailed hints and step-by-step solutions
- Be visually appealing with proper formatting and emojis where appropriate
- Use real-world applications to make concepts relatable

**CRITICAL**: Output ONLY valid JSON with this exact structure:
{
  "title": "Engaging title for the topic",
  "overview": "Comprehensive overview with LaTeX notation like $x^2$ where appropriate. Make it personal and encouraging.",
  "keyPoints": [
    "Clear bullet point 1 with LaTeX if needed: $\\frac{d}{dx}(x^2) = 2x$",
    "Clear bullet point 2",
    "Clear bullet point 3",
    "4-6 total points"
  ],
  "examples": [
    {
      "title": "Descriptive example title",
      "description": "Detailed problem setup with LaTeX: Solve $\\int x^2 dx$",
      "solution": "Step-by-step solution:\n1. First step with explanation\n2. Second step: $\\int x^2 dx = \\frac{x^3}{3} + C$\n3. Final answer with verification"
    }
  ],
  "practiceProblems": [
    {
      "question": "Engaging question with LaTeX: Find $\\frac{dy}{dx}$ if $y = x^3 + 2x$",
      "difficulty": "easy",
      "hint": "Remember the power rule: $\\frac{d}{dx}(x^n) = nx^{n-1}$",
      "answer": "Detailed step-by-step answer:\n$\\frac{dy}{dx} = 3x^2 + 2$\n\nExplanation: Apply power rule to each term..."
    }
  ],
  "resources": [
    {
      "type": "video",
      "title": "Resource title",
      "url": "https://actual-url.com",
      "description": "What this resource offers",
      "duration": "10 min"
    }
  ]
}

Make the content highly engaging, use plenty of LaTeX for mathematical notation, and ensure every practice problem has a complete, detailed answer with step-by-step explanations.`

export async function generateStudyGuideWithAI(params: StudyGuideParams): Promise<any> {
  const learningStyleGuidance = {
    visual: 'Include suggestions to draw diagrams, use color coding, and visualize concepts. Mention graphical representations.',
    auditory: 'Suggest reading aloud, explaining to others, and using mnemonics. Emphasize verbal reasoning.',
    kinesthetic: 'Recommend hands-on practice, writing out solutions, and physical movement breaks. Focus on doing and practicing.',
    reading: 'Provide detailed written explanations, encourage note-taking, and offer extensive written examples.'
  }

  const userPrompt = `Create a comprehensive, engaging study guide for ${params.studentName}, a ${params.grade}th grade student.

**Course**: ${params.courseName || params.subject} ${params.courseCode ? `(${params.courseCode})` : ''}
**Topic**: ${params.topic}
**Difficulty**: ${params.difficulty}
**Learning Style**: ${params.learningStyle}

**Learning Style Adaptation**: ${learningStyleGuidance[params.learningStyle]}

${params.georgiaStandards && params.georgiaStandards.length > 0 ? `
**Relevant Georgia Standards**:
${params.georgiaStandards.map(std => `
- ${std.code}: ${std.description}
  Key concepts: ${std.keyVocabulary?.join(', ') || 'N/A'}
`).join('\n')}
` : ''}

**Requirements**:
1. Create an overview that's personal, encouraging, and uses LaTeX for any mathematical notation
2. Provide 5-6 clear key points about the topic
3. Include 3 detailed worked examples with step-by-step solutions using LaTeX notation
4. Create 4-6 practice problems:
   - Mix of difficulty levels (2 easy, 2 medium, 1-2 hard)
   - Each with a helpful hint
   - **CRITICAL**: Each problem MUST include a complete, detailed answer with step-by-step solution
   - Use LaTeX for all mathematical expressions
5. Suggest 4-6 high-quality learning resources (actual URLs to Khan Academy, YouTube, etc.)

**LaTeX Usage Examples**:
- Fractions: $\\frac{dy}{dx}$
- Integrals: $\\int x^2 dx$
- Limits: $\\lim_{x \\to 0} \\frac{\\sin x}{x}$
- Exponents: $x^2$, $e^{-x}$
- Equations: $F = ma$

Make the guide engaging, interactive, and perfectly suited for a ${params.learningStyle} learner studying ${params.topic}.

Remember: Output ONLY the JSON object, no additional text before or after.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 4096,
      response_format: { type: 'json_object' }
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No content returned from OpenAI')
    }

    const guideData = JSON.parse(content)

    // Validate and ensure all required fields
    if (!guideData.title || !guideData.overview || !guideData.keyPoints || !guideData.examples || !guideData.practiceProblems) {
      throw new Error('Invalid guide structure returned from AI')
    }

    // Fix malformed LaTeX (add missing backslashes)
    const fixLatex = (text: string): string => {
      if (!text) return text
      return text
        .replace(/([^\\])frac{/g, '$1\\frac{')  // Fix \frac
        .replace(/^frac{/g, '\\frac{')
        .replace(/([^\\])int /g, '$1\\int ')    // Fix \int
        .replace(/^int /g, '\\int ')
        .replace(/([^\\])lim_/g, '$1\\lim_')    // Fix \lim
        .replace(/^lim_/g, '\\lim_')
        .replace(/([^\\])sqrt{/g, '$1\\sqrt{')  // Fix \sqrt
        .replace(/^sqrt{/g, '\\sqrt{')
        .replace(/([^\\])sum_/g, '$1\\sum_')    // Fix \sum
        .replace(/^sum_/g, '\\sum_')
        .replace(/([^\\])prod_/g, '$1\\prod_')  // Fix \prod
        .replace(/^prod_/g, '\\prod_')
    }

    // Apply LaTeX fixes to all text content
    const fixObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return fixLatex(obj)
      } else if (Array.isArray(obj)) {
        return obj.map(fixObject)
      } else if (obj && typeof obj === 'object') {
        const fixed: any = {}
        for (const key in obj) {
          fixed[key] = fixObject(obj[key])
        }
        return fixed
      }
      return obj
    }

    const fixedGuideData = fixObject(guideData)

    return {
      id: `guide-${Date.now()}`,
      title: fixedGuideData.title,
      subject: params.subject,
      topic: params.topic,
      difficulty: params.difficulty,
      content: {
        overview: fixedGuideData.overview,
        keyPoints: fixedGuideData.keyPoints,
        examples: fixedGuideData.examples.map((ex: any) => ({
          title: ex.title,
          description: ex.description,
          solution: ex.solution
        })),
        practiceProblems: fixedGuideData.practiceProblems.map((prob: any, idx: number) => ({
          id: `prob-${Date.now()}-${idx}`,
          question: prob.question,
          difficulty: prob.difficulty || 'medium',
          hint: prob.hint,
          answer: prob.answer
        })),
        resources: fixedGuideData.resources || []
      },
      generatedAt: new Date().toISOString(),
      basedOnSurvey: 'latest'
    }
  } catch (error) {
    console.error('OpenAI generation error:', error)
    throw new Error(`Failed to generate study guide: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
