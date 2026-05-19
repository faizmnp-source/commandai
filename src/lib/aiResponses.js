/**
 * AI Response engine — Phase 1 (rule-based mock)
 * Phase 2+: replace with real LLM API calls (OpenAI / Anthropic / Gemini)
 */

const RESPONSES = {
  revenue: `📈 Your revenue this month is <strong>$24,800</strong>, up 12% from last month ($22,150).<br/><br/>
Top sources:<br/>
• Services — 67% ($16,600)<br/>
• Products — 33% ($8,200)<br/><br/>
Best day: May 15 at $3,400. You're on track to beat last month's record.`,

  invoice: `📋 You have <strong>7 pending invoices</strong> totalling $12,600:<br/><br/>
<span style="color:#ef4444;font-weight:600;">🔴 Overdue (3) — $4,200</span><br/>
• #1038 · Zara Ltd · $1,800 · 12 days late<br/>
• #1041 · BuildCo · $1,400 · 7 days late<br/>
• #1039 · Nova Inc · $1,000 · 5 days late<br/><br/>
Want me to send payment reminders to all three?`,

  techcorp: `✉️ Here's a draft follow-up for TechCorp (Sarah Johnson):<br/><br/>
<em style="background:#f0fdf4;display:block;padding:10px;border-radius:8px;margin-top:6px;border-left:3px solid #34d399;">
Hi Sarah,<br/><br/>
I wanted to follow up on our conversation from last week. We'd love to show you how CommandAI can streamline TechCorp's operations. Could we schedule a 20-min call this week?<br/><br/>
Best,<br/>Faizan
</em><br/>
Shall I send this, or would you like to edit it first?`,

  customers: `👥 Your <strong>top 5 customers</strong> by revenue this month:<br/><br/>
🥇 Apex Co. — $4,200<br/>
🥈 TechCorp — $3,800 <em>(pending)</em><br/>
🥉 Zara Ltd — $2,900<br/>
4. BuildCo — $2,400<br/>
5. Nova Inc — $1,800<br/><br/>
142 active customers total · 8 added this week 📊`,

  tasks: `✅ You have <strong>18 open tasks</strong> across 4 projects:<br/><br/>
<span style="color:#ef4444;font-weight:600;">🔴 Overdue (3)</span><br/>
• Q2 Financial Report · due May 16<br/>
• Client onboarding · BuildCo<br/>
• Team performance review<br/><br/>
🟡 Due today (4)<br/>
• Product demo prep · Inventory reorder · Invoice follow-ups · Call with Sarah<br/><br/>
Want me to reprioritize your task list?`,

  team: `🧑‍💼 Your team overview:<br/><br/>
• 8 active team members<br/>
• 2 on leave this week<br/>
• 94% attendance rate this month<br/><br/>
Top performer: Ahmed K. (12 tasks completed this week)<br/>
Next payroll: May 31 · Est. $18,400`,

  default: `I've got that noted. Based on your current business data, everything looks healthy overall — revenue trending up, a few invoices to chase, and your pipeline is active.<br/><br/>
Ask me anything specific — I can pull numbers, draft emails, or flag priorities for you. 🧠`,
}

/**
 * Get an AI response for a given message
 * @param {string} message
 * @returns {string} HTML response
 */
export function getAIResponse(message) {
  const m = message.toLowerCase()
  if (m.includes('revenue') || m.includes('sales') || m.includes('money') || m.includes('income'))
    return RESPONSES.revenue
  if (m.includes('invoice') || m.includes('payment') || m.includes('overdue') || m.includes('unpaid'))
    return RESPONSES.invoice
  if (m.includes('techcorp') || m.includes('follow') || m.includes('draft') || m.includes('email') || m.includes('sarah'))
    return RESPONSES.techcorp
  if (m.includes('customer') || m.includes('client') || m.includes('top') || m.includes('best'))
    return RESPONSES.customers
  if (m.includes('task') || m.includes('project') || m.includes('todo') || m.includes('deadline'))
    return RESPONSES.tasks
  if (m.includes('team') || m.includes('staff') || m.includes('employee') || m.includes('payroll'))
    return RESPONSES.team
  return RESPONSES.default
}

export const SUGGESTIONS = [
  "What's my revenue this month?",
  'Show overdue invoices',
  'Draft follow-up for TechCorp',
  'Who are my top customers?',
  'What tasks are overdue?',
  "How's my team doing?",
]
