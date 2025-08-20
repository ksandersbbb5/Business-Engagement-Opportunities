import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { serviceAreas, bbbTopics, timeframe } = req.body;

  try {
    const prompt = `You are a business research assistant helping the Better Business Bureau (BBB) find networking and engagement opportunities for their Business Engagement Coordinators.

TASK: Search the web and find real business events, networking opportunities, conferences, workshops, and trade shows in the following locations for the next ${timeframe}:

TARGET AREAS:
- Massachusetts (focus on counties: Barnstable, Bristol, Dukes, Essex, Middlesex, Nantucket, Norfolk, Plymouth, Suffolk)
- Maine  
- Rhode Island
- Vermont

FOCUS ON FINDING:
- Events suitable for small businesses (1-50 employees)
- Business networking events and Chamber of Commerce meetings
- Industry conferences and trade shows
- Business workshops and seminars
- Professional development events
- Entrepreneur meetups and startup events
- Small business expos and vendor fairs

BBB PRESENTATION TOPICS (for context):
${bbbTopics.join('\\n- ')}

SEARCH CRITERIA:
- Find up to 50 real events per state
- Look for events happening in the next 90 days
- Focus on events where BBB could provide value through presentations on business ethics, customer trust, dispute resolution, or accreditation benefits
- Include a mix of large expos and smaller networking events

FOR
