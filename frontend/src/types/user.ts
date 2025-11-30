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
