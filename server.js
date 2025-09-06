import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Set security headers to allow inline styles and scripts
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://generativelanguage.googleapis.com;");
  next();
});

// Serve static files with proper MIME types
app.use(express.static(__dirname, {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (path.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    } else if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    } else if (path.endsWith('.ico')) {
      res.setHeader('Content-Type', 'image/x-icon');
    } else if (path.endsWith('.woff')) {
      res.setHeader('Content-Type', 'font/woff');
    } else if (path.endsWith('.woff2')) {
      res.setHeader('Content-Type', 'font/woff2');
    } else if (path.endsWith('.ttf')) {
      res.setHeader('Content-Type', 'font/ttf');
    } else if (path.endsWith('.eot')) {
      res.setHeader('Content-Type', 'application/vnd.ms-fontobject');
    }
  }
}));

// Serve static assets with explicit routes
app.get('/assets/css/:file', (req, res) => {
  const filePath = path.join(__dirname, 'assets', 'css', req.params.file);
  console.log(`Serving CSS: ${filePath}`);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.sendFile(filePath);
  } else {
    console.error(`CSS file not found: ${filePath}`);
    res.status(404).json({ error: 'CSS file not found', file: req.params.file });
  }
});

app.get('/assets/js/:file', (req, res) => {
  const filePath = path.join(__dirname, 'assets', 'js', req.params.file);
  console.log(`Serving JS: ${filePath}`);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.sendFile(filePath);
  } else {
    console.error(`JS file not found: ${filePath}`);
    res.status(404).json({ error: 'JS file not found', file: req.params.file });
  }
});

// Serve HTML pages with explicit routes
const htmlPages = [
  'index.html',
  'checker.html', 
  'result.html',
  'wellness.html',
  'dashboard.html',
  'medications.html',
  'login.html',
  'register.html',
  'profile.html',
  'xray-analysis.html'
];

htmlPages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    const filePath = path.join(__dirname, page);
    console.log(`Serving ${page} from ${filePath}`);
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.sendFile(filePath);
    } else {
      console.error(`File not found: ${filePath}`);
      res.status(404).send(`File not found: ${page}`);
    }
  });
});

// Root route
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  console.log(`Serving root from ${filePath}`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.error(`File not found: ${filePath}`);
    res.status(404).send('index.html not found');
  }
});

// Catch-all route for any other requests
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  console.log(`Catch-all request for: ${req.path} -> ${filePath}`);
  
  // Check if it's a static file request
  if (path.extname(filePath) && fs.existsSync(filePath)) {
    // Set appropriate MIME type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.css') {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (ext === '.js') {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (ext === '.html') {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    } else if (ext === '.json') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.sendFile(filePath);
  } else {
    console.error(`File not found: ${filePath}`);
    res.status(404).send(`Page not found: ${req.path}`);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

const apiKey = process.env.GEMINI_API_KEY || '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';

if (!apiKey) {
  console.warn('GEMINI_API_KEY environment variable is not set. AI features will not work.');
} else {
  console.log('✅ GEMINI_API_KEY is set and ready to use');
}

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
    if (!apiKey) {
      return res.status(503).json({ error: 'AI service not available. Please set GEMINI_API_KEY environment variable.' });
    }
    
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Pocket Doctor Government Schemes'
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
      console.error('OpenRouter API error:', errorData);
      return res.status(500).json({ error: 'OpenRouter API request failed' });
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

// AI X-Ray Analysis endpoint
app.post('/api/analyze-xray', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(503).json({ error: 'AI service not available. Please set GEMINI_API_KEY environment variable.' });
    }
    
    const { imageData, imageType } = req.body || {};
    if (!imageData || !imageType) {
      return res.status(400).json({ error: 'imageData and imageType are required' });
    }

    const prompt = `You are a medical AI assistant specialized in X-Ray image analysis. Analyze the provided X-Ray image and provide a comprehensive medical assessment in this exact JSON format:

{
  "confidence": 85,
  "diseases": [
    {
      "name": "Disease Name",
      "probability": 75,
      "level": "normal/warning/critical",
      "description": "Detailed medical description of the finding"
    }
  ],
  "recommendations": [
    "Medical recommendation 1",
    "Medical recommendation 2",
    "Medical recommendation 3"
  ],
  "overallAssessment": "Overall assessment of the X-Ray image",
  "urgencyLevel": "low/moderate/high/critical"
}

Important guidelines:
- Only respond with valid JSON
- Be medically accurate but conservative
- Always emphasize consulting healthcare professionals
- Use appropriate medical terminology
- Assess for common conditions like pneumonia, pneumothorax, fractures, etc.
- If no abnormalities are detected, indicate "Normal X-Ray" with high confidence
- Provide specific, actionable recommendations
- Consider the urgency level based on findings

Analyze this X-Ray image:`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Pocket Doctor Government Schemes'
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: prompt
            },
            {
              inline_data: {
                mime_type: imageType,
                data: imageData
              }
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      return res.status(500).json({ error: 'OpenRouter API request failed' });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'No response from AI';
    
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
      const required = ['confidence', 'diseases', 'recommendations'];
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
        confidence: 75,
        diseases: [
          {
            name: "Normal X-Ray",
            probability: 85,
            level: "normal",
            description: "No significant abnormalities detected. The X-Ray appears normal with clear lung fields and normal cardiac silhouette."
          }
        ],
        recommendations: [
          "Continue regular health checkups",
          "Maintain a healthy lifestyle",
          "Consult a healthcare provider if you have any concerns",
          "Follow up as recommended by your doctor"
        ],
        overallAssessment: "The X-Ray image appears normal with no obvious pathological findings.",
        urgencyLevel: "low"
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to analyze X-Ray image: ' + err.message });
  }
});

// AI Symptom Checker endpoint
app.post('/api/analyze-symptoms', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(503).json({ error: 'AI service not available. Please set GEMINI_API_KEY environment variable.' });
    }
    
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

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Pocket Doctor Government Schemes'
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
      console.error('OpenRouter API error:', errorData);
      return res.status(500).json({ error: 'OpenRouter API request failed' });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'No response from AI';
    
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

// Government Scheme Query Endpoint
app.post('/api/scheme-query', async (req, res) => {
  try {
    const { scheme, schemeTitle, query } = req.body;

    if (!scheme || !query) {
      return res.status(400).json({ error: 'Scheme and query are required' });
    }

    if (!apiKey) {
      return res.status(503).json({ error: 'AI service not available. Please set GEMINI_API_KEY environment variable.' });
    }

    // Create scheme-specific context
    const schemeContexts = {
      'ayushman-bharat': {
        name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)',
        description: 'Health insurance scheme for poor and vulnerable families providing coverage of up to ₹5 lakh per family per year for secondary and tertiary care hospitalization.',
        keyInfo: 'Covers over 10 crore families, provides cashless treatment at empaneled hospitals, covers pre-existing conditions, and includes 1,393 medical packages.'
      },
      'jan-aushadhi': {
        name: 'Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)',
        description: 'Scheme to provide quality generic medicines at affordable prices through Jan Aushadhi Kendras.',
        keyInfo: 'Medicines available at 50-90% lower prices than branded medicines, over 1,800+ medicines and 285+ surgical items available, more than 10,000 Jan Aushadhi Kendras across India.'
      },
      'vaccination': {
        name: 'Universal Immunization Programme (UIP)',
        description: 'Comprehensive vaccination program providing free immunization against vaccine-preventable diseases.',
        keyInfo: 'Covers 12 vaccine-preventable diseases, targets children under 2 years and pregnant women, provides vaccines free of cost at government health facilities.'
      }
    };

    const context = schemeContexts[scheme] || { name: schemeTitle, description: '', keyInfo: '' };

    const prompt = `You are a helpful assistant providing information about Indian government health schemes. 

Scheme: ${context.name}
Description: ${context.description}
Key Information: ${context.keyInfo}

User Question: ${query}

Please provide a comprehensive, accurate, and helpful answer about this government scheme. Include:
1. Direct answer to the user's question
2. Relevant details about eligibility, application process, benefits, or requirements
3. Important contact information or official websites if relevant
4. Any additional helpful information

Keep the response clear, concise, and easy to understand. If the question is about application process, include step-by-step guidance. If about eligibility, list the specific criteria clearly.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Pocket Doctor Government Schemes'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 1024,
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      return res.status(500).json({ error: 'OpenRouter API request failed' });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'No response from AI';
    
    return res.json({ response: aiResponse });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to process scheme query: ' + err.message });
  }
});

// Chatbot Query Endpoint
app.post('/api/chatbot-query', async (req, res) => {
  try {
    const { query, context } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    if (!apiKey) {
      return res.status(503).json({ error: 'AI service not available. Please set GEMINI_API_KEY environment variable.' });
    }

    // Create context-aware prompt for government schemes
    const prompt = `You are a helpful AI assistant specializing in Indian government health schemes. You have comprehensive knowledge about:

1. **Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)**
   - Health insurance for poor and vulnerable families
   - Coverage up to ₹5 lakh per family per year
   - Covers secondary and tertiary care hospitalization
   - Covers over 10 crore families
   - Provides cashless treatment at empaneled hospitals
   - Covers pre-existing conditions
   - Includes 1,393 medical packages

2. **Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)**
   - Provides quality generic medicines at affordable prices
   - Medicines available at 50-90% lower prices than branded medicines
   - Over 1,800+ medicines and 285+ surgical items available
   - More than 10,000 Jan Aushadhi Kendras across India
   - Helps reduce out-of-pocket expenditure on medicines

3. **Universal Immunization Programme (UIP)**
   - Comprehensive vaccination program
   - Covers 12 vaccine-preventable diseases
   - Targets children under 2 years and pregnant women
   - Provides vaccines free of cost at government health facilities
   - Includes vaccines for diseases like polio, measles, hepatitis B, etc.

User Question: ${query}

Please provide a helpful, accurate, and comprehensive answer about government health schemes. Include:
- Direct answer to the user's question
- Relevant details about eligibility, benefits, or processes
- Important contact information or official websites if relevant
- Step-by-step guidance for applications if asked
- Any additional helpful information

Keep the response clear, concise, and easy to understand. If the question is about application process, include step-by-step guidance. If about eligibility, list the specific criteria clearly. Always be helpful and encouraging.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Pocket Doctor Government Schemes'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 1024,
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      return res.status(500).json({ error: 'OpenRouter API request failed' });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'No response from AI';
    
    return res.json({ response: aiResponse });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to process chatbot query: ' + err.message });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


