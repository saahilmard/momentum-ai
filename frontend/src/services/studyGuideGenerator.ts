import { retrieveRelevantStandards, getPrerequisiteChain, type Standard } from './georgiaStandards'
import type { StudyGuide, Example, Problem, Resource } from '../types/user'

/**
 * RAG-Based Study Guide Generator
 * Uses Georgia Standards retrieval + template generation
 */

interface GenerationParams {
  subject: string
  weakArea: string
  grade: number
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  studentName: string
  courseCode?: string  // e.g., "MATH-101"
  courseName?: string  // e.g., "Calculus I"
}

/**
 * Main generation function - now uses OpenAI API
 */
export async function generateStudyGuide(params: GenerationParams): Promise<StudyGuide> {
  try {
    // Step 1: Retrieve relevant Georgia standards (RAG retrieval phase)
    const standards = retrieveRelevantStandards(
      params.grade,
      params.subject,
      [params.weakArea]
    )

    // Step 2: Call backend API for OpenAI generation
    const response = await fetch('http://localhost:5000/api/study-guide/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subject: params.subject,
        topic: params.weakArea,
        grade: params.grade,
        learningStyle: params.learningStyle,
        difficulty: params.difficulty,
        studentName: params.studentName,
        courseCode: params.courseCode,
        courseName: params.courseName,
        georgiaStandards: standards
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate study guide from API')
    }

    const guide = await response.json()
    return guide
  } catch (error) {
    console.error('Study guide generation error:', error)
    // Fallback to template-based generation
    return generateTemplateFallback(params)
  }
}

/**
 * Template-based fallback if OpenAI fails
 */
async function generateTemplateFallback(params: GenerationParams): Promise<StudyGuide> {
  const standards = retrieveRelevantStandards(
    params.grade,
    params.subject,
    [params.weakArea]
  )

  if (standards.length === 0) {
    return generateFallbackGuide(params)
  }

  const primaryStandard = standards[0]
  const prerequisites = getPrerequisiteChain(primaryStandard.id)
  const content = await generateContent(primaryStandard, prerequisites, params)

  const guide: StudyGuide = {
    id: `guide-${Date.now()}`,
    title: generateTitle(primaryStandard, params.weakArea),
    subject: params.subject,
    topic: params.weakArea,
    difficulty: params.difficulty,
    content,
    generatedAt: new Date().toISOString(),
    basedOnSurvey: 'latest'
  }

  return guide
}

/**
 * Generate title based on standard and learning style
 */
function generateTitle(standard: Standard, weakArea: string): string {
  return `${standard.domain}: ${weakArea}`
}

/**
 * Format mathematical expressions with LaTeX
 */
function formatWithLatex(text: string): string {
  // Replace common math expressions with LaTeX
  return text
    .replace(/dy\/dx/g, '$\\frac{dy}{dx}$')
    .replace(/d\/dx\[([^\]]+)\]/g, '$\\frac{d}{dx}[$1]$')
    .replace(/∫([^d]+)dx/g, '$\\int $1 \\, dx$')
    .replace(/∫₀²/g, '$\\int_0^2$')
    .replace(/∫₀¹/g, '$\\int_0^1$')
    .replace(/lim\(x→(\d+)\)/g, '$\\lim_{x \\to $1}$')
    .replace(/x²/g, '$x^2$')
    .replace(/x³/g, '$x^3$')
    .replace(/xⁿ/g, '$x^n$')
    .replace(/nxⁿ⁻¹/g, '$nx^{n-1}$')
    .replace(/e\^/g, '$e^')
    .replace(/F = ma/g, '$F = ma$')
    .replace(/KE₁ \+ PE₁ = KE₂ \+ PE₂/g, '$KE_1 + PE_1 = KE_2 + PE_2$')
    .replace(/p = mv/g, '$p = mv$')
    .replace(/m₁v₁ \+ m₂v₂ = m₁v₁' \+ m₂v₂'/g, '$m_1v_1 + m_2v_2 = m_1v_1\' + m_2v_2\'$')
}

/**
 * Generate content adapted to learning style
 */
async function generateContent(
  standard: Standard,
  prerequisites: Standard[],
  params: GenerationParams
) {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1500))

  const overview = generateOverview(standard, params.learningStyle, params.studentName)
  const keyPoints = generateKeyPoints(standard, prerequisites)
  const examples = generateExamples(standard, params.learningStyle)
  const practiceProblems = generatePracticeProblems(standard, params.difficulty)
  const resources = generateResources(standard, params.learningStyle, params.subject)

  return {
    overview,
    keyPoints,
    examples,
    practiceProblems,
    resources
  }
}

/**
 * Generate personalized overview
 */
function generateOverview(standard: Standard, learningStyle: string, studentName: string): string {
  const styleAdaptations = {
    visual: 'This guide uses diagrams, graphs, and visual representations to help you understand',
    auditory: 'This guide includes explanations you can read aloud and discuss with others to master',
    kinesthetic: 'This guide provides hands-on practice problems and real-world applications to help you learn',
    reading: 'This guide offers detailed written explanations and step-by-step procedures for'
  }

  const introduction = styleAdaptations[learningStyle] || styleAdaptations.reading

  return `Hi ${studentName}! ${introduction} **${standard.domain}**.

**Georgia Standard ${standard.code}:** ${standard.description}

This topic builds on your knowledge of ${standard.prerequisites.join(', ')}. By mastering this concept, you'll be prepared for more advanced topics in ${standard.subject}.

${getLearningStyleTip(learningStyle, standard.domain)}`
}

/**
 * Get learning style specific tip
 */
function getLearningStyleTip(style: string, topic: string): string {
  const tips = {
    visual: `📊 **Visual Learning Tip:** Draw diagrams and flowcharts as you work through this material. Create color-coded notes to distinguish different concepts.`,
    auditory: `🎧 **Auditory Learning Tip:** Read the examples out loud. Explain each step to yourself or a study partner. Record yourself working through problems and play them back.`,
    kinesthetic: `✋ **Hands-On Learning Tip:** Use physical objects to model problems when possible. Take frequent breaks to move around. Write out solutions by hand before typing them.`,
    reading: `📖 **Reading/Writing Tip:** Take detailed written notes. Create summaries in your own words. Write out the steps even if you can do them mentally.`
  }

  return tips[style] || tips.reading
}

/**
 * Generate key points from standards
 */
function generateKeyPoints(standard: Standard, prerequisites: Standard[]): string[] {
  const points: string[] = []

  // Add context from prerequisites
  if (prerequisites.length > 0) {
    points.push(`📚 **Foundation:** This builds on ${prerequisites.map(p => p.domain).join(', ')}`)
  }

  // Add main standard description as key point
  points.push(`🎯 **Main Concept:** ${standard.description}`)

  // Add vocabulary
  if (standard.keyVocabulary.length > 0) {
    points.push(`🔤 **Key Terms:** ${standard.keyVocabulary.slice(0, 5).join(', ')}`)
  }

  // Add Georgia standard reference
  points.push(`📋 **Georgia Standard:** ${standard.code} - ${standard.domain}`)

  return points
}

/**
 * Generate examples from standards
 */
function generateExamples(standard: Standard, learningStyle: string): Example[] {
  return standard.examples.slice(0, 3).map((example, index) => ({
    title: `Example ${index + 1}`,
    description: formatWithLatex(example),
    solution: generateSolution(example, standard, learningStyle)
  }))
}

/**
 * Generate solution based on example and learning style
 */
function generateSolution(example: string, standard: Standard, learningStyle: string): string {
  // For visual learners, add diagram hints
  if (learningStyle === 'visual') {
    return `💡 **Visual Approach:**
1. Draw a diagram representing the problem
2. Label all known values
3. Identify what you're solving for
4. Apply ${standard.domain} principles
5. Check your answer graphically

**Solution Steps:** ${example.includes('=') ? 'See worked example in resources section' : 'Practice this with the problems below'}`
  }

  // For auditory learners, add talk-through
  if (learningStyle === 'auditory') {
    return `🗣️ **Talk-Through Approach:**
1. Read the problem aloud
2. Explain what's being asked in your own words
3. Discuss the strategy with yourself or a partner
4. Solve step-by-step, explaining each step
5. Verbally check if your answer makes sense

**Solution Steps:** ${example.includes('=') ? 'Work through this talking out each step' : 'Explain your reasoning for each problem'}`
  }

  // For kinesthetic learners, add hands-on
  if (learningStyle === 'kinesthetic') {
    return `✋ **Hands-On Approach:**
1. Write out the problem on paper
2. Use manipulatives or drawings if applicable
3. Physically work through each step
4. Build the solution incrementally
5. Test your answer with a different method

**Solution Steps:** ${example.includes('=') ? 'Write this out completely by hand' : 'Practice repeatedly until it feels natural'}`
  }

  // Default: reading/writing style
  return `📝 **Step-by-Step Solution:**
1. Identify given information and what you're solving for
2. Choose the appropriate formula or method
3. Substitute values carefully
4. Solve systematically
5. Check your answer

**Detailed Solution:** ${example.includes('=') ? 'Apply the principles from ' + standard.domain : 'Use the practice problems section to develop this skill'}`
}

/**
 * Generate practice problems
 */
function generatePracticeProblems(standard: Standard, difficulty: string): Problem[] {
  const problems: Problem[] = []
  const baseExamples = standard.examples

  // Easy problems
  if (difficulty === 'beginner' || difficulty === 'intermediate') {
    problems.push({
      id: `prob-${standard.id}-easy-1`,
      question: baseExamples[0] || `Basic ${standard.domain} problem`,
      difficulty: 'easy',
      hint: `Review the definition of ${standard.keyVocabulary[0]}`,
      answer: 'Complete solution available after attempt'
    })
  }

  // Medium problems
  if (difficulty === 'intermediate' || difficulty === 'advanced') {
    problems.push({
      id: `prob-${standard.id}-med-1`,
      question: baseExamples[1] || `Intermediate ${standard.domain} problem`,
      difficulty: 'medium',
      hint: `Apply ${standard.domain} principles step by step`,
      answer: 'Work through using the examples above'
    })
  }

  // Hard problems
  if (difficulty === 'advanced') {
    problems.push({
      id: `prob-${standard.id}-hard-1`,
      question: baseExamples[2] || `Advanced ${standard.domain} problem`,
      difficulty: 'hard',
      hint: `Combine multiple concepts from ${standard.domain}`,
      answer: 'Challenge problem - consult teacher if stuck'
    })
  }

  return problems
}

/**
 * Generate curated resources
 */
function generateResources(standard: Standard, learningStyle: string, subject: string): Resource[] {
  const resources: Resource[] = []

  // Add learning-style appropriate resources
  if (learningStyle === 'visual') {
    resources.push({
      type: 'video',
      title: `Khan Academy: ${standard.domain}`,
      url: `https://www.khanacademy.org/search?search=${encodeURIComponent(standard.domain)}`,
      description: 'Visual explanations with step-by-step diagrams',
      duration: '10-15 min'
    })

    if (subject === 'Mathematics') {
      resources.push({
        type: 'tool',
        title: 'Desmos Graphing Calculator',
        url: 'https://www.desmos.com/calculator',
        description: 'Interactive graphing tool to visualize mathematical concepts',
      })
    }
  }

  if (learningStyle === 'auditory') {
    resources.push({
      type: 'video',
      title: `${subject} Lecture: ${standard.domain}`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(standard.domain + ' ' + subject)}`,
      description: 'Audio lectures and explained examples',
      duration: '15-20 min'
    })
  }

  // Subject-specific resources
  if (subject === 'Mathematics') {
    resources.push({
      type: 'exercise',
      title: 'IXL Practice - ' + standard.domain,
      url: `https://www.ixl.com/math/`,
      description: 'Adaptive practice problems with instant feedback'
    })

    resources.push({
      type: 'article',
      title: 'Paul\'s Online Math Notes',
      url: 'https://tutorial.math.lamar.edu/',
      description: 'Comprehensive written explanations and examples'
    })
  }

  if (subject === 'Physics') {
    resources.push({
      type: 'video',
      title: 'PhET Interactive Simulations',
      url: 'https://phet.colorado.edu/',
      description: 'Interactive physics simulations'
    })
  }

  // Georgia-specific resources
  resources.push({
    type: 'article',
    title: `Georgia Standards - ${standard.code}`,
    url: 'https://www.georgiastandards.org/',
    description: `Official Georgia Department of Education standards for ${standard.domain}`
  })

  return resources
}

/**
 * Fallback guide if no standards match
 */
function generateFallbackGuide(params: GenerationParams): StudyGuide {
  return {
    id: `guide-fallback-${Date.now()}`,
    title: `${params.weakArea} Study Guide - Grade ${params.grade}`,
    subject: params.subject,
    topic: params.weakArea,
    difficulty: params.difficulty,
    content: {
      overview: `This study guide covers ${params.weakArea} for ${params.subject}. While we're building content specific to this topic, here are some general strategies to help you succeed.`,
      keyPoints: [
        `Focus on understanding core concepts in ${params.weakArea}`,
        'Practice regularly with a variety of problems',
        'Ask your teacher for additional resources',
        'Form study groups with classmates'
      ],
      examples: [
        {
          title: 'General Approach',
          description: 'Break down complex problems into smaller steps',
          solution: 'Work through each step methodically'
        }
      ],
      practiceProblems: [],
      resources: [
        {
          type: 'article',
          title: 'Khan Academy',
          url: 'https://www.khanacademy.org',
          description: 'Free educational resources for all subjects'
        }
      ]
    },
    generatedAt: new Date().toISOString(),
    basedOnSurvey: 'latest'
  }
}
