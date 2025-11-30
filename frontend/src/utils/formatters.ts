import { format, formatDistanceToNow } from 'date-fns'

export const formatDate = (date: string | Date): string => {
  try {
    return format(new Date(date), 'MMM dd, yyyy')
  } catch {
    return 'Invalid date'
  }
}

export const formatDateTime = (date: string | Date): string => {
  try {
    return format(new Date(date), 'MMM dd, yyyy h:mm a')
  } catch {
    return 'Invalid date'
  }
}

export const formatRelativeTime = (date: string | Date): string => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch {
    return 'Invalid date'
  }
}

export const formatPercentage = (value: number, decimals: number = 0): string => {
  return `${(value * 100).toFixed(decimals)}%`
}

export const formatNumber = (value: number, decimals: number = 0): string => {
  return value.toFixed(decimals)
}

export const formatScore = (score: number): string => {
  return score.toFixed(1)
}
