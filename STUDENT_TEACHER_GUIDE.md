# 🎓 Student & Teacher Guide - Momentum AI

## Overview

Momentum AI now features complete student and teacher perspectives with AI-powered personalization. Students complete weekly surveys and receive customized study materials, while teachers monitor class-wide analytics and provide targeted interventions.

---

## 🔐 Getting Started

### Demo Accounts

**Student Account:**
- Email: `student@demo.com`
- Password: `demo123`

**Teacher Account:**
- Email: `teacher@demo.com`
- Password: `demo123`

### First Time Login

1. Navigate to `/login` or click "Sign In" on the landing page
2. Select your role (Student or Teacher)
3. Use demo credentials or enter your own
4. You'll be redirected to your role-specific dashboard

---

## 👨‍🎓 Student Features

### 1. Weekly Momentum Survey

**Purpose:** Track academic wellness and predict potential struggles before they become serious.

**How It Works:**
- Complete a 10-question survey every week (takes 2-3 minutes)
- Questions cover: stress, motivation, confidence, sleep, social support, time management, and more
- Use slider interface (1-10 scale) to rate your current state
- Submit to generate your Momentum Score

**What Happens After:**
1. **Momentum Score calculated** (0-100 scale)
2. **Risk level assigned** (Low, Medium, High, Critical)
3. **AI generates personalized study materials** based on your responses
4. **Teacher notified** if you're struggling (High/Critical risk)
5. **Dashboard updated** with your latest score and trends

**Access:** `Student Dashboard → "Take Survey Now"` or navigate to `/student/survey`

**Survey Questions:**
- Stress levels
- Motivation for coursework
- Confidence in understanding material
- Sleep quality
- Social support
- Time management
- Academic concerns
- Class engagement
- Resilience to setbacks
- Comfort seeking help

---

### 2. AI-Powered Study Resources

**Purpose:** Get personalized study guides, practice problems, and resources tailored to YOUR needs.

**How AI Personalization Works:**

The system analyzes:
- **Your weak areas** (from grades and self-assessment)
- **Learning style** (visual, auditory, kinesthetic, reading)
- **Survey responses** (stress, confidence, motivation)
- **Course struggles** (which classes you're struggling in)

Then generates:
- **Custom study guides** with examples and practice problems
- **Resource recommendations** (videos, articles, interactive tools)
- **Practice tests** adaptive to your level
- **Concept maps** for visual learners
- **Step-by-step tutorials** for complex topics

**Features:**
- Filter by subject (Mathematics, Physics, English, etc.)
- Filter by difficulty (Beginner, Intermediate, Advanced)
- AI match score (shows how well each resource fits your needs)
- One-click generation of new study guides

**Access:** `/student/resources`

**Example Study Guide:**
```
Title: "Differential Equations Fundamentals"
Subject: Mathematics
Difficulty: Intermediate
Tailored for: Visual learners

Includes:
- Overview with visual diagrams
- 4 key concepts broken down
- 2 worked examples with solutions
- 5 practice problems (easy → hard)
- 3 curated external resources (videos, tools)
- Generated based on your Week 4 survey
```

---

### 3. Dashboard

**Your Command Center** showing:

**Key Metrics:**
- Current Momentum Score with trend indicator
- GPA and active courses
- Surveys completed
- Learning style

**Momentum Trend Chart:**
- Line graph showing your scores over the last 4 weeks
- Identify patterns (improving, declining, stable)

**Courses Needing Attention:**
- Highlighted courses where you're struggling
- One-click access to study materials for that subject
- Current grade display

**Quick Actions:**
- View study resources
- Survey history
- My progress tracking

**Access:** `/student/dashboard` (default landing after login)

---

### 4. Progress Tracking

**Survey History:**
- View all past survey submissions
- See how your momentum has changed over time
- Compare responses week-to-week

**Learning Analytics:**
- Which study materials you've accessed
- Time spent on different subjects
- Improvement metrics

**Access:** `/student/history` or `/student/profile`

---

## 👩‍🏫 Teacher Features

### 1. Class Analytics Dashboard

**Real-Time Class Overview:**

**Key Metrics Cards:**
- Total students in your classes
- Average class momentum score
- Number of students needing attention
- Number showing improvement

**Risk Distribution Chart (Pie Chart):**
- Visual breakdown of class risk levels
- Low, Medium, High, Critical categories
- Click to filter student list

**Momentum Trends Chart (Bar Chart):**
- How many students are improving vs. declining
- Weekly trend analysis

**Access:** `/teacher/dashboard` (default landing after login)

---

### 2. Student Monitoring

**Student List Features:**

**For Each Student, See:**
- Name and email
- Current momentum score with visual progress bar
- Risk level badge (color-coded)
- Trend indicator (↗ improving, → stable, ↘ declining)
- Enrolled courses
- Last survey date

**Interaction Tools:**
- Click student row → view detailed profile
- Message button → send direct message
- Filter by risk level
- Search by name/email

**At-Risk Alerts:**
- Automatic notification when students need attention
- Red banner showing count of struggling students
- One-click filter to view only at-risk students

**Access:** Main section of `/teacher/dashboard`

---

### 3. Individual Student Insights

Click any student to see:
- Complete survey history
- Momentum score trends over time
- Course performance breakdown
- Generated study materials they've received
- Intervention history

**What Teachers Can Do:**
- Send personalized messages
- Flag for additional support
- View AI-generated recommendations
- Track intervention effectiveness

**Access:** Click student in list or `/teacher/student/:studentId`

---

### 4. Intervention Tools

**Quick Actions:**
- Send class announcements
- Access detailed analytics
- Use intervention tools

**Planned Features** (ready for backend):
- Schedule one-on-one meetings
- Create custom study plans
- Share resources with students
- Send automated check-ins

---

## 🤖 How AI Powers the System

### 1. Survey Analysis

When a student completes the survey:

```
Input: 10 question responses (1-10 scale)
↓
AI Processing:
- Calculate momentum score (weighted average)
- Identify concerning patterns (high stress + low confidence = red flag)
- Compare to historical data (is this declining?)
- Analyze weak areas from academic data
↓
Output:
- Risk level assignment
- Personalized recommendations
- Alert triggers for teachers
```

### 2. Study Guide Generation

**Inputs:**
- Student's weak subjects (e.g., "Differential Equations")
- Learning style (e.g., "Visual")
- Recent survey responses (stress level, confidence)
- Course performance data

**AI Process:**
1. Select appropriate topics from weak areas
2. Generate overview in student-friendly language
3. Create visual examples (for visual learners)
4. Generate practice problems with graduated difficulty
5. Curate external resources matching learning style
6. Add motivational elements based on confidence level

**Output:** Complete study guide document

### 3. Resource Matching

**Algorithm:**
```
For each available resource:
  Match Score =
    (subject_match × 40%) +
    (difficulty_match × 30%) +
    (learning_style_match × 20%) +
    (current_need_urgency × 10%)

Sort by Match Score
Return top 10 resources
```

### 4. Advanced Statistical Modeling (Backend Ready)

The system is designed to integrate with:
- **PDEs** for modeling academic trajectory
- **Catastrophe Theory** for predicting collapse points
- **SDEs** for uncertainty in student behavior
- **Lyapunov Analysis** for stability assessment
- **ARIMA** for time-series forecasting
- **Bayesian GP** for adaptive predictions
- **Q-Learning/RL** for intervention optimization

---

## 🎯 Student Workflow Example

### Week 1: First Survey
1. Alex logs in Monday morning
2. Sees "Weekly Survey Due" alert
3. Completes 10-question survey (3 minutes)
4. Gets Momentum Score: 62 (Medium Risk)
5. AI generates study guide for "Calculus - Limits"
6. Dashboard shows: "You're doing okay, but watch your stress levels"

### Week 2: Using Resources
1. Alex reviews AI-generated study guide
2. Watches recommended video (visual learner)
3. Completes practice problems
4. Takes weekly survey: Score improves to 68
5. Teacher receives notification: "Alex trending upward"

### Week 3: Struggling
1. Alex's score drops to 45 (High Risk)
2. Identified weak area: "Differential Equations"
3. AI generates targeted study materials
4. Teacher alerted automatically
5. Teacher sends supportive message
6. Alex receives notification: "Your teacher wants to help"

### Week 4: Recovery
1. With support and resources, score recovers to 72
2. New study guide generated for next topic
3. Dashboard shows clear upward trend
4. Success story! 🎉

---

## 🔒 Privacy & Data

**What's Tracked:**
- Survey responses (aggregated for analytics)
- Momentum scores and trends
- Study material access
- Course performance

**What's NOT Tracked:**
- Specific study content viewed
- Time spent per resource (optional)
- Personal conversations

**Data Usage:**
- Improve AI recommendations
- Help teachers identify students who need support
- Predict and prevent academic struggles

---

## 🚀 Technical Details

### Frontend Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.tsx                 # Authentication
│   │   ├── student/
│   │   │   ├── StudentDashboard.tsx  # Student home
│   │   │   ├── WeeklySurvey.tsx      # 10-question survey
│   │   │   └── StudyResources.tsx    # AI-powered materials
│   │   └── teacher/
│   │       └── TeacherDashboard.tsx  # Class analytics
│   ├── components/
│   │   ├── ProtectedRoute.tsx        # Role-based access
│   │   └── Navigation.tsx            # Role-aware nav
│   ├── store/
│   │   ├── authStore.ts              # Authentication state
│   │   └── themeStore.ts             # Dark/light mode
│   └── types/
│       └── user.ts                   # TypeScript interfaces
```

### Authentication Flow

```typescript
// Login
authStore.login(email, password)
  → Validate credentials (currently mock)
  → Set user object with role
  → Persist to localStorage
  → Redirect to role-specific dashboard

// Protected Routes
<ProtectedRoute requiredRole="student">
  → Check isAuthenticated
  → Check user.role matches
  → Render component or redirect
</ProtectedRoute>
```

### Mock Data vs. Real Backend

**Currently Using Mock Data:**
- User authentication (hardcoded demo accounts)
- Student information
- Survey history
- Study guides

**Ready for Backend Integration:**
- All API calls stubbed
- TypeScript interfaces defined
- State management in place
- Just swap mock data with real API calls

**Example Backend Integration:**
```typescript
// Current (Mock)
const studyGuides = mockStudyGuides

// Future (Real API)
const studyGuides = await api.get('/student/study-guides', {
  params: { weak_areas, learning_style }
})
```

---

## 📊 Key Metrics & Analytics

### Student Metrics
- **Momentum Score:** 0-100 (weighted survey responses)
- **Risk Level:** Low (70+), Medium (50-69), High (30-49), Critical (<30)
- **Trend:** Improving, Stable, Declining

### Teacher Metrics
- **Class Average:** Mean momentum score
- **At-Risk Count:** Students in High/Critical
- **Engagement Rate:** % completing weekly surveys
- **Intervention Success:** Improvement after support

### AI Performance (Future)
- **Prediction Accuracy:** How often we predict struggles correctly
- **Resource Effectiveness:** Student improvement after using materials
- **Early Detection:** Days before collapse that we identify risk

---

## 🛠️ Development & Deployment

### Local Development

```bash
cd /Users/saahilmardhekar/Desktop/momentum-ai/frontend
npm install
npm run dev
```

Visit `http://localhost:3000/login`

### Production Build

```bash
npm run build
# Output: dist/ folder ready for deployment
```

### Deploy to Vercel

```bash
# Option 1: CLI
npx vercel --prod

# Option 2: Dashboard
1. Go to vercel.com
2. Import GitHub repo: saahilmard/momentum-ai
3. Set root directory: frontend
4. Deploy!
```

---

## 🎨 Design System

### Color Coding

**Risk Levels:**
- 🟢 **Low:** Green (#10b981)
- 🟡 **Medium:** Yellow/Amber (#f59e0b)
- 🟠 **High:** Orange/Red (#ef4444)
- 🔴 **Critical:** Dark Red (#7f1d1d)

**Categories:**
- **Stress:** Red tones
- **Academic:** Blue tones
- **Social:** Green tones
- **Wellness:** Purple tones

### Glassmorphism Theme
- Frosted glass effects (`backdrop-filter: blur(12px)`)
- Subtle transparency
- Smooth animations
- Dark and light mode support

---

## 📝 Future Enhancements

### Student Side
- [ ] Study session timer with break reminders
- [ ] Peer study group matching (based on courses/learning style)
- [ ] Achievement badges and milestones
- [ ] Export study guides as PDF
- [ ] Mobile app for on-the-go surveys
- [ ] Push notifications for survey reminders

### Teacher Side
- [ ] Bulk messaging to at-risk students
- [ ] Custom intervention templates
- [ ] Comparison across multiple classes
- [ ] Semester-long trend analysis
- [ ] Export reports for administration
- [ ] Integration with LMS (Canvas, Blackboard)

### AI Features
- [ ] Conversational AI tutor (ChatGPT-like)
- [ ] Automatic weak area detection from quiz results
- [ ] Adaptive difficulty in practice problems
- [ ] Predictive alerts ("You might struggle with next week's topic")
- [ ] Natural language processing of survey free-response
- [ ] Computer vision for handwritten work analysis

---

## 🤝 Support & Feedback

**For Students:**
- Having trouble with a study guide? Contact your teacher
- Survey not loading? Check your internet connection
- Forgot password? Contact support

**For Teachers:**
- Need help interpreting analytics? See user guide
- Want to request new features? Submit feedback
- Technical issues? Contact IT support

**Demo Environment:**
- This is a demo with mock data
- Survey submissions won't affect real grades
- Teacher actions are simulated

---

## 📚 Related Documentation

- [QUICK_START.md](./QUICK_START.md) - Fast deployment guide
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Full deployment instructions
- [frontend/FRONTEND_SETUP.md](./frontend/FRONTEND_SETUP.md) - Technical setup
- [GITHUB_PUSH_INSTRUCTIONS.md](./GITHUB_PUSH_INSTRUCTIONS.md) - Git workflow

---

## 🎯 Summary

**For Students:**
- Complete weekly 2-minute surveys
- Get AI-powered study materials tailored to YOU
- Track your momentum and stay ahead of struggles

**For Teachers:**
- Monitor entire class at a glance
- Get alerted when students need help
- Provide targeted interventions based on data

**For Administrators:**
- Predict and prevent academic failure
- Data-driven student support
- Scalable across entire institution

**Built with:**
- React + TypeScript
- Framer Motion (animations)
- Recharts (visualizations)
- Tailwind CSS (styling)
- Zustand (state management)
- Ready for backend integration (FastAPI, PostgreSQL)

---

## 🚀 Ready to Deploy!

Your enhanced Momentum AI platform is ready to go live:

```bash
cd /Users/saahilmardhekar/Desktop/momentum-ai/frontend
npm run build
npx vercel --prod
```

**GitHub:** https://github.com/saahilmard/momentum-ai

**Next Steps:**
1. Deploy to Vercel (3 minutes)
2. Share live URL with students/teachers
3. Integrate with real backend API
4. Start collecting real survey data!

---

Made with ❤️ for academic success
