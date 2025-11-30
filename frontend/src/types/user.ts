export type UserRole = 'student' | 'teacher' | 'admin'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  studentInfo?: StudentInfo
  teacherInfo?: TeacherInfo
  createdAt: string
  lastLogin: string
}

export interface StudentInfo {
  studentId: string
  grade: number
  currentCourses: Course[]
  gpa: number
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  subjects: string[]
  weakAreas: string[]
  surveyHistory: SurveySubmission[]
  lastSurveyDate: string | null
  nextSurveyDue: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  momentumScore: number
}

export interface TeacherInfo {
  teacherId: string
  department: string
  courses: Course[]
  students: string[]
}

export interface Course {
  id: string
  name: string
  code: string
  teacher: string
  credits: number
  currentGrade?: number
  struggling?: boolean
}

export interface SurveySubmission {
  id: string
  date: string
  week: number
  responses: Record<string, number>
  momentumScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  recommendations: string[]
}

export interface StudyGuide {
  id: string
  title: string
  subject: string
  topic: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  content: {
    overview: string
    keyPoints: string[]
    examples: Example[]
    practiceProblems: Problem[]
    resources: Resource[]
  }
  generatedAt: string
  basedOnSurvey: string
}

export interface Example {
  title: string
  description: string
  solution?: string
}

export interface Problem {
  id: string
  question: string
  difficulty: 'easy' | 'medium' | 'hard'
  answer?: string
  hint?: string
}

export interface Resource {
  type: 'video' | 'article' | 'exercise' | 'tool'
  title: string
  url: string
  description: string
  duration?: string
}

export interface SupportMaterial {
  id: string
  type: 'study_guide' | 'practice_test' | 'concept_map' | 'tutorial'
  subject: string
  topic: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  matchScore: number
  createdAt: string
}

// New features for emotional intelligence and data modeling
export interface MomentumWeek {
  id: string
  weekNumber: number
  startDate: string
  endDate: string
  momentumScore: number
  completedBlocks: number
  targetBlocks: number
  emotionalState: 'high-hope' | 'neutral' | 'low-hope' | 'panic'
  interventions: Intervention[]
  notes: PersonalNote[]
}

export interface Intervention {
  id: string
  type: 'study_plan' | 'affirmation' | 'teacher_outreach' | 'easier_chunking' | 'counselor_referral'
  triggeredBy: 'low_momentum' | 'disengaged_weeks' | 'panic_pattern' | 'manual'
  status: 'suggested' | 'accepted' | 'declined' | 'completed'
  impact?: number  // RL reward signal
  createdAt: string
}

export interface PersonalNote {
  id: string
  date: string
  content: string
  mood?: 'proud' | 'struggling' | 'hopeful' | 'overwhelmed'
  privacy: 'private' | 'share_with_teacher' | 'share_with_counselor'
  weeklyReflection?: boolean
}

export interface ComebackStory {
  id: string
  title: string
  preview: string
  fullStory: string
  situation: string  // "failed precalc" | "almost dropped out" | "chronic absences"
  outcome: string    // "got into MIT" | "graduated with honors"
  keyLessons: string[]
  isAnonymized: boolean
  createdAt: string
}

export interface GradeBand {
  range: 'A/B' | 'B/C' | 'C/D' | 'D/F' | 'unsure'
  why: string  // Student's explanation
  context?: string  // Optional: "family issues", "just tough material", etc.
}

export interface PrivacySettings {
  shareGradesWithTeachers: boolean
  shareEmotionalStatesWithTeachers: boolean
  shareWithCounselors: boolean
  allowParentSummaries: boolean
  dataRetentionMonths: number
}
