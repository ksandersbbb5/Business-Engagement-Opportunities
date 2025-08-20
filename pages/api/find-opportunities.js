import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  const { serviceAreas, bbbTopics, timeframe } = req.body;

  try {
    const prompt = `Find real business events in Massachusetts, Maine, Rhode Island, and Vermont for the next 90 days. Focus on events suitable for small businesses (1-50 employees) including networking events, conferences, workshops, trade shows, and Chamber of Commerce meetings.

For each event, provide:
- Date
- Location (city and venue)
- Cost
- Event name
- Audience type and size
- Contact information
- Website link
- Why BBB should attend (focus on networking, recruiting accredited businesses, presenting on business ethics/trust)

Return up to 50 events per state in this JSON format:

{
  "Massachusetts": [
    {
      "date": "March 15, 2025",
      "location": "Boston, MA",
      "cost": "$75 registration",
      "name": "Business Event Name",
      "audienceType": "Small business owners, entrepreneurs",
      "contactInfo": "contact@email.com",
      "link": "https://website.com",
      "whyBBBShouldBeThere": "Networking opportunity explanation"
    }
  ],
  "Maine": [],
  "Rhode Island": [],
  "Vermont": []
}

Only include real events with actual websites. Order states as: Massachusetts, Maine, Rhode Island, Vermont.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4',
      temperature: 0.3,
      max_tokens: 8000,
    });

    let results;
    try {
      results = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      results = {
        "Massachusetts": [{
          "date": "March 15, 2025",
          "location": "Boston, MA",
          "cost": "$75 registration",
          "name": "Sample Business Event",
          "audienceType": "Small business owners",
          "contactInfo": "info@example.com",
          "link": "https://example.com",
          "whyBBBShouldBeThere": "Networking opportunity with local businesses"
        }],
        "Maine": [],
        "Rhode Island": [],
        "Vermont": []
      };
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch opportunities',
      error: error.message 
    });
  }
}
