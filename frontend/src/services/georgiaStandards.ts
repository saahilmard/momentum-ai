/**
 * Georgia Standards of Excellence (GSE) Knowledge Base
 * Real standards for Mathematics, Science, and English Language Arts
 */

export interface Standard {
  id: string
  grade: number
  subject: string
  domain: string
  code: string
  description: string
  examples: string[]
  prerequisites: string[]
  keyVocabulary: string[]
}

export const GEORGIA_STANDARDS: Standard[] = [
  // ========== MATHEMATICS - Grade 11 (Pre-Calculus) ==========
  {
    id: 'math-11-limits-001',
    grade: 11,
    subject: 'Mathematics',
    domain: 'Limits and Continuity',
    code: 'MGSE11.CALC.1',
    description: 'Understand the concept of a limit and estimate limits from graphs and tables of values.',
    examples: [
      'Find lim(x→2) of (x² - 4)/(x - 2)',
      'Determine limits from a graph showing function behavior',
      'Use a table of values to estimate lim(x→0) of sin(x)/x'
    ],
    prerequisites: ['Algebra 2', 'Functions', 'Graphing'],
    keyVocabulary: ['limit', 'approaches', 'left-hand limit', 'right-hand limit', 'does not exist']
  },
  {
    id: 'math-11-derivatives-001',
    grade: 11,
    subject: 'Mathematics',
    domain: 'Differential Calculus',
    code: 'MGSE11.CALC.2',
    description: 'Understand the derivative as the instantaneous rate of change and use basic differentiation rules.',
    examples: [
      'Find the derivative of f(x) = x³ + 2x² - 5x + 1',
      'Calculate the slope of the tangent line to y = x² at x = 3',
      'Apply the power rule: d/dx[xⁿ] = nxⁿ⁻¹'
    ],
    prerequisites: ['Limits', 'Slopes', 'Rate of Change'],
    keyVocabulary: ['derivative', 'differentiation', 'tangent line', 'rate of change', 'power rule']
  },
  {
    id: 'math-11-diffeq-001',
    grade: 11,
    subject: 'Mathematics',
    domain: 'Differential Equations',
    code: 'MGSE11.CALC.5',
    description: 'Solve separable differential equations and apply them to real-world problems.',
    examples: [
      'Solve dy/dx = ky (exponential growth/decay)',
      'Find the general solution to dy/dx = x²y',
      'Model population growth with P\'(t) = rP(1 - P/K)'
    ],
    prerequisites: ['Derivatives', 'Integration', 'Algebra'],
    keyVocabulary: ['differential equation', 'separable', 'initial condition', 'general solution', 'particular solution']
  },
  {
    id: 'math-11-integration-001',
    grade: 11,
    subject: 'Mathematics',
    domain: 'Integral Calculus',
    code: 'MGSE11.CALC.3',
    description: 'Understand integration as the reverse of differentiation and compute basic integrals.',
    examples: [
      'Find ∫(3x² + 2x - 1)dx',
      'Evaluate definite integral: ∫₀² x² dx',
      'Apply u-substitution to solve ∫2x·e^(x²) dx'
    ],
    prerequisites: ['Derivatives', 'Anti-derivatives', 'Area under curves'],
    keyVocabulary: ['integral', 'antiderivative', 'definite integral', 'indefinite integral', 'u-substitution']
  },

  // ========== PHYSICS - Grade 11 ==========
  {
    id: 'phys-11-newton-001',
    grade: 11,
    subject: 'Physics',
    domain: 'Classical Mechanics',
    code: 'SP1.a',
    description: 'Apply Newton\'s three laws of motion to analyze the motion of objects.',
    examples: [
      'Calculate net force: F_net = ma for a 5 kg object accelerating at 2 m/s²',
      'Identify action-reaction pairs in a rocket launch',
      'Analyze forces on an object at rest on an inclined plane'
    ],
    prerequisites: ['Kinematics', 'Vectors', 'Free body diagrams'],
    keyVocabulary: ['force', 'mass', 'acceleration', 'inertia', 'action-reaction', 'net force']
  },
  {
    id: 'phys-11-energy-001',
    grade: 11,
    subject: 'Physics',
    domain: 'Energy and Work',
    code: 'SP2.a',
    description: 'Understand and apply the work-energy theorem and conservation of energy.',
    examples: [
      'Calculate work: W = F·d·cos(θ)',
      'Apply conservation of energy: KE₁ + PE₁ = KE₂ + PE₂',
      'Find the kinetic energy of a 1000 kg car moving at 20 m/s'
    ],
    prerequisites: ['Newton\'s Laws', 'Algebra', 'Trigonometry'],
    keyVocabulary: ['work', 'energy', 'kinetic energy', 'potential energy', 'conservation', 'joule']
  },
  {
    id: 'phys-11-momentum-001',
    grade: 11,
    subject: 'Physics',
    domain: 'Momentum',
    code: 'SP3.a',
    description: 'Apply the law of conservation of momentum to analyze collisions.',
    examples: [
      'Calculate momentum: p = mv',
      'Solve elastic collision problems: m₁v₁ + m₂v₂ = m₁v₁\' + m₂v₂\'',
      'Analyze impulse: J = FΔt = Δp'
    ],
    prerequisites: ['Newton\'s Laws', 'Vectors', 'Algebra'],
    keyVocabulary: ['momentum', 'impulse', 'collision', 'elastic', 'inelastic', 'conservation']
  },

  // ========== ENGLISH - Grade 11 ==========
  {
    id: 'eng-11-lit-001',
    grade: 11,
    subject: 'English',
    domain: 'Literature Analysis',
    code: 'ELAGSE11-12RL1',
    description: 'Cite strong and thorough textual evidence to support analysis of what the text says explicitly as well as inferences drawn from the text.',
    examples: [
      'Analyze character development using specific quotes',
      'Support theme identification with textual evidence',
      'Make inferences about author\'s purpose based on text details'
    ],
    prerequisites: ['Reading comprehension', 'Critical thinking', 'Text analysis'],
    keyVocabulary: ['inference', 'textual evidence', 'explicit', 'implicit', 'citation', 'analysis']
  },
  {
    id: 'eng-11-rhetoric-001',
    grade: 11,
    subject: 'English',
    domain: 'Rhetorical Analysis',
    code: 'ELAGSE11-12RI6',
    description: 'Determine an author\'s point of view or purpose and analyze how style and content contribute to the power of the text.',
    examples: [
      'Identify rhetorical devices (ethos, pathos, logos)',
      'Analyze how diction and syntax affect tone',
      'Evaluate the effectiveness of argumentative strategies'
    ],
    prerequisites: ['Reading comprehension', 'Vocabulary', 'Literary devices'],
    keyVocabulary: ['rhetoric', 'ethos', 'pathos', 'logos', 'diction', 'syntax', 'tone']
  },

  // ========== MATHEMATICS - Grade 10 (Geometry) ==========
  {
    id: 'math-10-geo-001',
    grade: 10,
    subject: 'Mathematics',
    domain: 'Congruence and Similarity',
    code: 'MGSE10.G.SRT.5',
    description: 'Use congruence and similarity criteria for triangles to solve problems and prove relationships.',
    examples: [
      'Prove triangles congruent using SSS, SAS, ASA, AAS',
      'Use similar triangles to find unknown lengths',
      'Apply the AA similarity criterion'
    ],
    prerequisites: ['Basic geometry', 'Proportions', 'Proofs'],
    keyVocabulary: ['congruent', 'similar', 'proportion', 'corresponding parts', 'scale factor']
  },

  // ========== MATHEMATICS - Grade 9 (Algebra I) ==========
  {
    id: 'math-9-alg-001',
    grade: 9,
    subject: 'Mathematics',
    domain: 'Linear Equations',
    code: 'MGSE9-12.A.REI.3',
    description: 'Solve linear equations and inequalities in one variable, including equations with coefficients represented by letters.',
    examples: [
      'Solve: 3x + 7 = 22',
      'Solve inequality: 2x - 5 < 11',
      'Solve literal equation for a variable: A = πr² for r'
    ],
    prerequisites: ['Order of operations', 'Integers', 'Fractions'],
    keyVocabulary: ['equation', 'inequality', 'variable', 'coefficient', 'solution', 'solve']
  },
  {
    id: 'math-9-func-001',
    grade: 9,
    subject: 'Mathematics',
    domain: 'Functions',
    code: 'MGSE9-12.F.IF.1',
    description: 'Understand that a function from one set to another assigns exactly one output to each input.',
    examples: [
      'Determine if a relation is a function using vertical line test',
      'Evaluate f(x) = 2x² - 3x + 1 at x = 4',
      'Find domain and range of functions'
    ],
    prerequisites: ['Coordinates', 'Graphing', 'Algebra'],
    keyVocabulary: ['function', 'domain', 'range', 'input', 'output', 'relation']
  }
]

/**
 * Retrieve relevant standards based on student profile
 */
export function retrieveRelevantStandards(
  grade: number,
  subject: string,
  weakAreas: string[]
): Standard[] {
  // Filter by grade and subject
  let relevant = GEORGIA_STANDARDS.filter(
    std => std.grade === grade && std.subject === subject
  )

  // If weak areas specified, prioritize those
  if (weakAreas.length > 0) {
    relevant = relevant.filter(std =>
      weakAreas.some(area =>
        std.domain.toLowerCase().includes(area.toLowerCase()) ||
        std.description.toLowerCase().includes(area.toLowerCase()) ||
        std.keyVocabulary.some(vocab => area.toLowerCase().includes(vocab.toLowerCase()))
      )
    )
  }

  return relevant
}

/**
 * Get prerequisite chain for a standard
 */
export function getPrerequisiteChain(standardId: string): Standard[] {
  const standard = GEORGIA_STANDARDS.find(s => s.id === standardId)
  if (!standard) return []

  const chain: Standard[] = [standard]
  const prereqNames = standard.prerequisites

  // Find standards that match prerequisites
  GEORGIA_STANDARDS.forEach(std => {
    if (prereqNames.some(prereq =>
      std.domain.toLowerCase().includes(prereq.toLowerCase()) ||
      std.description.toLowerCase().includes(prereq.toLowerCase())
    )) {
      chain.unshift(std)
    }
  })

  return chain
}

/**
 * Generate difficulty-appropriate vocabulary list
 */
export function getVocabularyByDifficulty(
  standards: Standard[],
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): string[] {
  const allVocab = standards.flatMap(s => s.keyVocabulary)
  const unique = [...new Set(allVocab)]

  // For now, return all; in production, this would filter by complexity
  return unique
}
