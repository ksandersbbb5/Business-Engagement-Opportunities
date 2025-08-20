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

  try {
    // For now, return sample data until OpenAI is configured
    const sampleResults = {
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

    res.status(200).json(sampleResults);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch opportunities',
      error: error.message 
    });
  }
}
