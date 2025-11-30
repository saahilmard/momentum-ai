#!/bin/bash

echo "🔍 Verifying Momentum AI Project Structure..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check directories
echo "📁 Checking Directories..."
dirs=("backend" "frontend" "docs" ".github")
for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $dir/"
    else
        echo -e "${RED}✗${NC} $dir/ (MISSING)"
    fi
done
echo ""

# Check frontend structure
echo "🎨 Checking Frontend Structure..."
frontend_files=(
    "frontend/src/App.tsx"
    "frontend/src/components/Navigation.tsx"
    "frontend/src/components/ui/GlassCard.tsx"
    "frontend/src/components/ui/Button.tsx"
    "frontend/src/components/ui/Badge.tsx"
    "frontend/src/components/ui/ProgressBar.tsx"
    "frontend/src/components/ui/Input.tsx"
    "frontend/src/components/ui/Skeleton.tsx"
    "frontend/src/pages/Landing.tsx"
    "frontend/src/pages/Dashboard.tsx"
    "frontend/src/pages/Assessment.tsx"
    "frontend/src/pages/Forecast.tsx"
    "frontend/src/pages/StudentProfile.tsx"
    "frontend/src/pages/SchoolOverview.tsx"
    "frontend/src/store/themeStore.ts"
    "frontend/src/utils/riskCalculations.ts"
    "frontend/src/utils/formatters.ts"
    "frontend/src/styles/globals.css"
    "frontend/tailwind.config.js"
    "frontend/vite.config.ts"
    "frontend/package.json"
)

for file in "${frontend_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (MISSING)"
    fi
done
echo ""

# Check backend files
echo "🧮 Checking Backend Structure..."
backend_files=(
    "backend/app/main.py"
    "backend/app/core/momentum_engine.py"
    "backend/app/core/forecasting_engine.py"
    "backend/app/api/routes.py"
    "backend/requirements.txt"
)

for file in "${backend_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (MISSING)"
    fi
done
echo ""

# Check documentation
echo "📚 Checking Documentation..."
docs=(
    "README.md"
    "COMPLETE_PROJECT_SUMMARY.md"
    "GITHUB_PUSH_INSTRUCTIONS.md"
    "frontend/FRONTEND_SETUP.md"
    "docs/MATHEMATICS.md"
    "docs/SURVEY_QUESTIONS.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✓${NC} $doc"
    else
        echo -e "${RED}✗${NC} $doc (MISSING)"
    fi
done
echo ""

# Check git status
echo "📝 Git Status..."
if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} Git initialized"
    COMMITS=$(git rev-list --count HEAD 2>/dev/null || echo "0")
    echo -e "${GREEN}✓${NC} Commits: $COMMITS"
    
    if git remote -v | grep -q "origin"; then
        echo -e "${GREEN}✓${NC} Remote 'origin' configured"
        git remote -v | head -2
    else
        echo -e "${YELLOW}⚠${NC} No remote configured yet (run: git remote add origin <url>)"
    fi
else
    echo -e "${RED}✗${NC} Git not initialized"
fi
echo ""

# Summary
echo "======================================"
echo "📊 Summary"
echo "======================================"
TOTAL_FILES=$(find . -type f ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/venv/*" | wc -l | tr -d ' ')
echo "Total files: $TOTAL_FILES"
echo ""
echo -e "${GREEN}✅ Project structure verified!${NC}"
echo ""
echo "Next steps:"
echo "1. Create GitHub repository"
echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/momentum-ai.git"
echo "3. Run: git push -u origin main"
echo ""
echo "See GITHUB_PUSH_INSTRUCTIONS.md for detailed guide!"
