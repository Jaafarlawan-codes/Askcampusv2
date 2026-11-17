import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 0) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize Gemini AI client:', err);
  }
}

// AI Endpoint: Study Helper / Answer Explainer
app.post('/api/ai/explain', async (req, res) => {
  const { questionTitle, questionBody, courseCode, category } = req.body;

  if (!questionTitle) {
    return res.status(400).json({ error: 'Question title is required' });
  }

  if (!aiClient) {
    // High-quality mock smart fallback if no API key is provided
    return res.json({
      answer: `Here is a structured explanation for **${questionTitle}** (${courseCode || 'General Academics'}):\n\n` +
        `### Key Concepts & Approach\n` +
        `1. **Break down the core principles**: When approaching this in ${category || 'your coursework'}, first identify the given variables and constraints.\n` +
        `2. **Step-by-Step Logic**: Validate each formula or theorem applicable to this syllabus module. Test edge cases or typical exam traps.\n` +
        `3. **Campus Tip**: Check the professor's past midterms in the AskCampus library notes. Most professors reuse these exact core conceptual variations.\n\n` +
        `*Suggested next step: Ask your TA during office hours or check the course discussion thread.*`,
      source: 'fallback'
    });
  }

  try {
    const prompt = `You are "AskCampus Study Copilot", an encouraging, knowledgeable university senior tutor.
A university student asked the following academic or campus question:
Course: ${courseCode || 'Unspecified'}
Category: ${category || 'General'}
Title: ${questionTitle}
Details: ${questionBody || 'None provided'}

Provide a clear, engaging, step-by-step academic explanation or practical advice. Use markdown with bolding, bullet points, and code/math formatting if appropriate. Keep it structured, educational, and concise (under 250 words). Conclude with a helpful campus tip or study strategy.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({
      answer: response.text || 'Unable to generate explanation.',
      source: 'gemini'
    });
  } catch (error: any) {
    console.error('Gemini error:', error);
    return res.json({
      answer: `### Academic Overview for ${questionTitle}\n\n1. Review the primary lecture slides for ${courseCode || 'this course'}.\n2. Formulate the core theorem or derivation.\n3. Verify units and boundary conditions.\n\n*Note: AI Copilot experienced high demand, showing fallback guide.*`,
      source: 'fallback'
    });
  }
});

// AI Endpoint: Marketplace Resale Estimator & Description Generator
app.post('/api/ai/marketplace-estimate', async (req, res) => {
  const { title, category, condition, courseCode, originalPrice } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Item title is required' });
  }

  if (!aiClient) {
    const orig = Number(originalPrice) || 80;
    const conditionDiscount = condition === 'Brand New' ? 0.8 : condition === 'Like New' ? 0.65 : condition === 'Good' ? 0.45 : 0.3;
    const suggested = Math.max(5, Math.round(orig * conditionDiscount));

    return res.json({
      suggestedPrice: suggested,
      minPrice: Math.max(5, Math.round(suggested * 0.85)),
      maxPrice: Math.round(suggested * 1.2),
      quickPitch: `Selling "${title}" in ${condition.toLowerCase()} condition. Perfect for ${courseCode || 'upcoming semester classes'}. Saved me a lot during midterms!`,
      safeMeetupTips: 'Recommend meeting at Campus Library Ground Floor or Student Union during daytime hours.',
      source: 'fallback'
    });
  }

  try {
    const prompt = `You are AskCampus Price Advisor for university students buying and selling used textbooks, school supplies, and electronics.
Item: ${title}
Category: ${category}
Condition: ${condition}
Course: ${courseCode || 'N/A'}
Original Price: $${originalPrice || 'Unknown'}

Return a JSON object ONLY with the following shape:
{
  "suggestedPrice": number,
  "minPrice": number,
  "maxPrice": number,
  "quickPitch": "a friendly 2-sentence listing description that makes it easy for fellow students to buy",
  "safeMeetupTips": "1 sentence recommending a safe university campus spot (e.g. library lobby, student union)"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ ...parsed, source: 'gemini' });
  } catch (err: any) {
    console.error('Marketplace estimate error:', err);
    return res.json({
      suggestedPrice: 35,
      minPrice: 25,
      maxPrice: 45,
      quickPitch: `Great condition ${title}, ideal for ${courseCode || 'this semester'}.`,
      safeMeetupTips: 'Meet at Student Union or Library.',
      source: 'fallback'
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AskCampus server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
