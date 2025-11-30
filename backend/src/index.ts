import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { generateStudyGuideWithAI } from './services/openaiStudyGuide'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Momentum AI Backend is running' })
})

// Generate study guide endpoint
app.post('/api/study-guide/generate', async (req, res) => {
  try {
    const params = req.body

    if (!params.subject || !params.topic || !params.grade) {
      return res.status(400).json({
        error: 'Missing required fields: subject, topic, grade'
      })
    }

    const studyGuide = await generateStudyGuideWithAI(params)
    res.json(studyGuide)
  } catch (error) {
    console.error('Study guide generation error:', error)
    res.status(500).json({
      error: 'Failed to generate study guide',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

const server = app.listen(PORT, () => {
  console.log(`🚀 Momentum AI Backend running on port ${PORT}`)
  console.log(`📚 Study guide generation endpoint: http://localhost:${PORT}/api/study-guide/generate`)
  console.log(`✅ Server is ready to accept requests`)
})

// Keep the process alive
server.on('error', (error) => {
  console.error('Server error:', error)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})
