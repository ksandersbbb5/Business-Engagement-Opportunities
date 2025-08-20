import OpenAI from 'openai';

export default async function handler(req, res) {
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

  try {
    console.log('API called - checking OpenAI setup');
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not found');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { serviceAreas, bbbTopics, timeframe } = req.body;

    console.log('Making OpenAI request...');

    const prompt = `You are a business research expert. Find real, current business events in Massachusetts, Maine, Rhode Island, and Vermont for the next 90 days. Focus on:

- Small business networking events
- Chamber of Commerce meetings  
- Business conferences and trade shows
- Professional development workshops
- Entrepreneur meetups

For each event found, provide accurate information including real website links. Return up to 15-20 events per state.

Return results in this exact JSON format:

{
  "Massachusetts": [
    {
      "date": "March 15, 2025",
      "location": "Boston, MA - Convention Center",
      "cost": "$125 registration",
      "name": "New England Small Business Expo",
      "audienceType": "Small business owners, entrepreneurs (500+ attendees)",
      "contactInfo": "info@businessevent.com",
      "link": "https://www.businessevent.com",
      "whyBBBShouldBeThere": "Large networking opportunity to present on business ethics and recruit accredited members from diverse industries."
    }
  ],
  "Maine": [],
  "Rhode Island": [],
  "Vermont": []
}

Important: Only include real events with actual websites. Order states as: Massachusetts, Maine, Rhode Island, Vermont.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 6000,
    });

    console.log('OpenAI response received');

    let results;
    try {
      const responseText = completion.choices[0].message.content;
      console.log('Parsing OpenAI response...');
      
      // C
