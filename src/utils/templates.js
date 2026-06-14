/**
 * Recommendation Templates - Maps categories and urgency to recommended actions
 */

const actionTemplates = {
  "Billing Issue": "Route to the billing team. Ask the customer to provide their account email and a description of the charge in question. Check the billing portal for recent transactions.",
  "Technical Problem": "Route to technical support. Ask the customer for steps to reproduce the issue, their browser/OS version, and any error messages. Check the status page for known outages.",
  "Feature Request": "Thank the customer for their feedback. Log the request in the product feedback tracker. Let them know the team reviews all suggestions.",
  "General Inquiry": "Respond with relevant FAQ links. If the question isn't covered, escalate to a support agent for a personalized response.",
  "Unknown": "Flag for manual review by a senior support agent."
}

export function getRecommendedAction(category, urgency) {
  return actionTemplates[category] || "No recommendation available. Please review manually."
}

export function getAvailableCategories() {
  return Object.keys(actionTemplates)
}

/**
 * Escalate if High urgency + Technical or Billing issue, or any critical keyword
 */
export function shouldEscalate(category, urgency, message) {
  if (urgency === 'High' && (category === 'Technical Problem' || category === 'Billing Issue')) return true
  const criticalKeywords = ['emergency', 'security', 'data loss', 'lost data', 'hacked', 'breach']
  return criticalKeywords.some(kw => message.toLowerCase().includes(kw))
}
