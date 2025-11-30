import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types/user'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })

        try {
          // TODO: Replace with actual API call
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Mock user data for demonstration
          const mockUser: User = {
            id: email.includes('student') ? 'student-001' : 'teacher-001',
            email,
            firstName: email.includes('student') ? 'Alex' : 'Dr. Sarah',
            lastName: email.includes('student') ? 'Johnson' : 'Martinez',
            role: email.includes('student') ? 'student' : 'teacher',
            createdAt: '2024-01-15T00:00:00Z',
            lastLogin: new Date().toISOString(),
            studentInfo: email.includes('student') ? {
              studentId: 'STU2024001',
              grade: 11,
              gpa: 3.2,
              currentCourses: [
                {
                  id: 'calc-101',
                  name: 'Calculus I',
                  code: 'MATH-101',
                  teacher: 'Dr. Martinez',
                  credits: 4,
                  currentGrade: 78,
                  struggling: true
                },
                {
                  id: 'eng-201',
                  name: 'English Literature',
                  code: 'ENG-201',
                  teacher: 'Prof. Williams',
                  credits: 3,
                  currentGrade: 88
                },
                {
                  id: 'phys-101',
                  name: 'Physics I',
                  code: 'PHYS-101',
                  teacher: 'Dr. Chen',
                  credits: 4,
                  currentGrade: 82
                }
              ],
              learningStyle: 'visual',
              subjects: ['Mathematics', 'Physics', 'English'],
              weakAreas: ['Differential Equations', 'Newton\'s Laws'],
              surveyHistory: [],
              lastSurveyDate: '2024-01-22T00:00:00Z',
              nextSurveyDue: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
              riskLevel: 'medium',
              momentumScore: 62
            } : undefined,
            teacherInfo: !email.includes('student') ? {
              teacherId: 'TCH2024001',
              department: 'Mathematics',
              courses: [
                {
                  id: 'calc-101',
                  name: 'Calculus I',
                  code: 'MATH-101',
                  teacher: 'Dr. Martinez',
                  credits: 4
                },
                {
                  id: 'calc-102',
                  name: 'Calculus II',
                  code: 'MATH-102',
                  teacher: 'Dr. Martinez',
                  credits: 4
                }
              ],
              students: ['student-001', 'student-002', 'student-003']
            } : undefined
          }

          set({ user: mockUser, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      }
    }),
    {
      name: 'momentum-auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
