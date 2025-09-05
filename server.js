import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Static files
app.use(express.static(__dirname));

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyACTn4Bu6WEiorcSvMRz-XdMEost1wVWHU';

function sanitizeToShortPlainText(input) {
  if (!input) return '';
  let text = String(input);
  // Remove markdown bullets, asterisks, underscores and excessive newlines
  text = text.replace(/[\*•·]+/g, ' ');
  text = text.replace(/^[\s\-\d\.)]+(?=\w)/gm, '');
  text = text.replace(/[_`]+/g, '');
  text = text.replace(/\s*\n+\s*/g, ' ');
  text = text.replace(/\s{2,}/g, ' ').trim();
  // Keep only first 2–3 sentences
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length > 3) {
    text = sentences.slice(0, 3).join(' ');
  }
  // Fallback: if still too long, hard cut
  if (text.length > 350) text = text.slice(0, 350).replace(/\s+\S*$/, '') + '…';
  return text;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: 'You are AI Health Assistant. Respond in 2 to 3 short sentences. Use plain text only—no bullets, no lists, no asterisks, no markdown. If symptoms may be serious, include a brief safety note.'
            }
          ]
        },
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 110,
          topK: 40,
          topP: 0.9
        },
        contents: [ { role: 'user', parts: [ { text: message } ] } ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return res.status(500).json({ error: 'Gemini API request failed' });
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
    const reply = sanitizeToShortPlainText(raw);
    return res.json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to get response from Gemini: ' + err.message });
  }
});

// AI Symptom Checker endpoint
app.post('/api/analyze-symptoms', async (req, res) => {
  try {
    const { symptoms } = req.body || {};
    if (!symptoms || typeof symptoms !== 'string') {
      return res.status(400).json({ error: 'symptoms are required' });
    }

    const prompt = `You are a medical AI assistant. Analyze the following symptoms and provide a comprehensive response in this exact JSON format:

{
  "analysis": "Brief analysis of the symptoms",
  "riskLevel": "low/moderate/high/critical",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "medicalHelp": "When to seek medical attention",
  "confidence": 85
}

Symptoms: ${symptoms}

Important: Only respond with valid JSON. Be medically accurate but conservative. Always emphasize consulting healthcare professionals.`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return res.status(500).json({ error: 'Gemini API request failed' });
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
    
    // Try to parse the AI response
    try {
      let jsonStart = aiResponse.indexOf('{');
      let jsonEnd = aiResponse.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No JSON found in response');
      }
      
      const jsonString = aiResponse.substring(jsonStart, jsonEnd);
      const parsed = JSON.parse(jsonString);
      
      // Validate required fields
      const required = ['analysis', 'riskLevel', 'recommendations', 'medicalHelp'];
      for (const field of required) {
        if (!parsed[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
      
      return res.json(parsed);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Return fallback response
      return res.json({
        analysis: `I've analyzed your symptoms: "${symptoms}". While I can provide general guidance, it's important to consult with a healthcare professional for accurate diagnosis.`,
        riskLevel: 'moderate',
        recommendations: [
          'Monitor your symptoms closely',
          'Keep a symptom diary',
          'Stay hydrated and get adequate rest',
          'Consider over-the-counter remedies for symptom relief',
          'Consult a healthcare provider for proper evaluation'
        ],
        medicalHelp: 'Seek medical attention if symptoms worsen, persist for more than a few days, or if you experience severe symptoms like difficulty breathing, chest pain, confusion, or high fever.',
        confidence: 75
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to analyze symptoms: ' + err.message });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


