import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

const CATEGORIES = ['Billing Issue', 'Technical Problem', 'Feature Request', 'General Inquiry', 'Unknown'];

export async function categorizeMessage(message) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a customer support triage assistant. Classify the customer message into exactly one of these categories:
- Billing Issue: payment problems, charges, refunds, subscriptions, invoices
- Technical Problem: bugs, errors, crashes, things not working
- Feature Request: suggestions, improvements, new functionality requests
- General Inquiry: questions, information requests, general help

Respond in this exact JSON format:
{"category": "<category name>", "reasoning": "<one sentence explanation>"}`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.3,
    });

    const content = response.choices[0].message.content.trim();

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (CATEGORIES.includes(parsed.category)) {
        return { category: parsed.category, reasoning: parsed.reasoning };
      }
    }

    // Fallback: keyword match on raw content
    const lower = content.toLowerCase();
    if (lower.includes('billing') || lower.includes('payment') || lower.includes('refund')) return { category: 'Billing Issue', reasoning: content };
    if (lower.includes('technical') || lower.includes('bug') || lower.includes('error')) return { category: 'Technical Problem', reasoning: content };
    if (lower.includes('feature') || lower.includes('suggestion') || lower.includes('improve')) return { category: 'Feature Request', reasoning: content };
    return { category: 'General Inquiry', reasoning: content };

  } catch (error) {
    console.warn('Groq API failed, using fallback:', error.message);
    return getFallbackCategorization(message);
  }
}

function getFallbackCategorization(message) {
  const lower = message.toLowerCase();

  if (lower.includes('bill') || lower.includes('payment') || lower.includes('charge') ||
      lower.includes('invoice') || lower.includes('refund') || lower.includes('subscription')) {
    return { category: 'Billing Issue', reasoning: 'Message contains billing-related keywords.' };
  }
  if (lower.includes('bug') || lower.includes('error') || lower.includes('broken') ||
      lower.includes('not working') || lower.includes('crash') || lower.includes('issue')) {
    return { category: 'Technical Problem', reasoning: 'Message describes a technical issue.' };
  }
  if (lower.includes('feature') || lower.includes('improve') || lower.includes('suggestion') ||
      lower.includes('would be great') || lower.includes('wish') || lower.includes('add')) {
    return { category: 'Feature Request', reasoning: 'Message suggests a product improvement.' };
  }
  return { category: 'General Inquiry', reasoning: 'Message appears to be a general question or inquiry.' };
}
