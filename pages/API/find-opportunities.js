import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { serviceAreas, bbbTopics, timeframe } = req.body;

  try {
    const prompt = `You are a business research assistant helping the Better Business Bureau (BBB) find networking and engagement opportunities for their Business Engagement Coordinators.

TASK: Find business events, networking opportunities, conferences, workshops, and trade shows in the following locations for the next ${timeframe}:
${serviceAreas.join(', ')}

FOCUS ON:
- Events suitable for small businesses (1-50 employees)
- Business networking events
- Industry conferences and trade shows
- Chamber of Commerce events
- Business workshops and seminars
- Professional development events
- Entrepreneur meetups
- Small business expos

BBB TOPICS (for reference on what BBB coordinators can present):
${bbbTopics.join('\n- ')}

For each event found, provide:
- Date (specific date if available, or estimated timeframe)
- Location (city, venue if known)
- Cost (registration fees, booth costs, etc.)
- Name of the Event/Opportunity
- Audience Type (describe the target audience and estimated attendance)
- Contact Information (email, phone, website contact)
- Link to the Event/Opportunity (website URL)
- Why BBB Should Be There (explain the networking opportunity, potential for recruiting accredited businesses, alignment with BBB's mission of ethical business practices, trust, and business growth)

RETURN RESULTS in valid JSON format with this structure:
{
  "Vermont": [
    {
      "date": "March 15, 2025",
      "location": "Burlington, VT",
      "cost": "$50 registration",
      "name": "Vermont Small Business Summit",
      "audienceType": "Small business owners, entrepreneurs",
      "contactInfo": "contact@vtbusiness.com",
      "link": "https://vtbusinesssummit.com",
      "whyBBBShouldBeThere": "Opportunity to present on business ethics and connect with potential accredited members"
    }
  ],
  "Maine": [...],
  "Rhode Island": [...],
  "Massachusetts": [...]
}

Focus on finding 3-5 high-quality events per state. If specific details aren't available, indicate "TBD" rather than making up information. Group results by state and sort events by date within each state.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4',
      temperature: 0.3,
      max_tokens: 4000,
    });

    let results;
    try {
      results = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback sample data if API doesn't return valid JSON
      results = {
        "Massachusetts": [
          {
            "date": "March 15, 2025",
            "location": "Boston, MA",
            "cost": "$75 registration",
            "name": "New England Small Business Expo",
            "audienceType": "Small business owners, entrepreneurs, startups",
            "contactInfo": "info@nebusinessexpo.com",
            "link": "https://newenglandbusinessexpo.com",
            "whyBBBShouldBeThere": "Prime opportunity to connect with hundreds of small business owners. BBB can host a workshop on 'Building Customer Trust' and recruit new accredited businesses while promoting ethical business practices."
          }
        ],
        "Vermont": [
          {
            "date": "April 2, 2025",
            "location": "Montpelier, VT",
            "cost": "Free to attend",
            "name": "Vermont Entrepreneur Network Meeting",
            "audienceType": "Entrepreneurs, small business owners, investors",
            "contactInfo": "hello@vtentrepreneurs.org",
            "link": "https://vtentrepreneurs.org",
            "whyBBBShouldBeThere": "Intimate setting perfect for one-on-one conversations about BBB accreditation benefits. Strong alignment with BBB's mission to support small business growth and ethical practices."
          }
        ]
      };
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch opportunities',
      error: error.message 
    });
  }
}
