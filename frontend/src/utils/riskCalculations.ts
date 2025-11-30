export const getRiskLevel = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (score >= 70) return 'low'
  if (score >= 50) return 'medium'
  if (score >= 30) return 'high'
  return 'critical'
}

export const getRiskColor = (level: string) => {
  const colors = {
    low: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/30 dark:text-green-300',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300',
    high: 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
    critical: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/30 dark:text-red-300',
  }
  return colors[level as keyof typeof colors] || colors.medium
}

export const getRiskLabel = (level: string): string => {
  const labels = {
    low: 'LOW RISK',
    medium: 'MEDIUM RISK',
    high: 'HIGH RISK',
    critical: 'CRITICAL RISK',
  }
  return labels[level as keyof typeof labels] || 'UNKNOWN'
}

export const getMomentumDescription = (score: number): string => {
  if (score >= 80) return 'Excellent momentum - Student is thriving!'
  if (score >= 70) return 'Good momentum - Student is doing well'
  if (score >= 50) return 'Moderate momentum - Student needs support'
  if (score >= 30) return 'Low momentum - Intervention recommended'
  return 'Critical - Immediate intervention required'
}
