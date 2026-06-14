/**
 * Urgency Scorer - Rule-based urgency calculation
 */

export function calculateUrgency(message) {
  let urgencyScore = 30

  // High-urgency keywords increase score
  const urgentKeywords = ['urgent', 'asap', 'emergency', 'critical', 'immediately', 'right now', 'broken', 'down', 'can\'t access', 'lost data', 'security']
  urgentKeywords.forEach(word => {
    if (message.toLowerCase().includes(word)) urgencyScore += 25
  })

  // ALL CAPS signals frustration — increase urgency
  if (message === message.toUpperCase() && message.replace(/\s/g, '').length > 10) {
    urgencyScore += 30
  }

  // Exclamation marks signal urgency
  const exclamationCount = (message.match(/!/g) || []).length
  urgencyScore += Math.min(exclamationCount * 10, 30)

  // Polite tone suggests lower urgency
  const politeWords = ['please', 'thank', 'thanks', 'appreciate', 'kindly', 'whenever']
  politeWords.forEach(word => {
    if (message.toLowerCase().includes(word)) urgencyScore -= 10
  })

  // Positive sentiment lowers urgency
  const positiveWords = ['happy', 'love', 'great', 'excellent', 'wonderful', 'awesome']
  positiveWords.forEach(word => {
    if (message.toLowerCase().includes(word)) urgencyScore -= 15
  })

  // Off-hours and weekends increase urgency (issues outside business hours are more critical)
  const now = new Date()
  if (now.getDay() === 0 || now.getDay() === 6) urgencyScore += 10
  if (now.getHours() < 9 || now.getHours() > 17) urgencyScore += 10

  if (urgencyScore >= 60) return 'High'
  if (urgencyScore >= 30) return 'Medium'
  return 'Low'
}
