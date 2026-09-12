import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import cors from 'cors';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' })); // Allow image uploads
  app.use(cors());

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // --- API ROUTES ---

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date() });
  });

  // AI Classification
  app.post('/api/ai/classify', async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!process.env.GEMINI_API_KEY) {
        // Fallback for demo if no key
        return res.json({ category: 'PCB', confidence: 0.94 });
      }

      // Convert base64 to format expected by Gemini
      const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: "Analyze this image of e-waste. Classify it strictly into one of these categories: PCB, Cable, Battery, Motor, Mixed Plastics. Return ONLY a JSON object with 'category' (string) and 'confidence' (number between 0 and 1). Do not include markdown formatting." },
              { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
            ]
          }
        ]
      });
      
      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      try {
        const parsed = JSON.parse(cleanJson);
        res.json(parsed);
      } catch (e) {
        console.error("Failed to parse Gemini output:", cleanJson);
        res.json({ category: 'PCB', confidence: 0.85 }); // Fallback
      }
      
    } catch (error) {
      console.error('AI Error:', error);
      res.status(500).json({ error: 'AI classification failed', fallback: { category: 'PCB', confidence: 0.94 } });
    }
  });


  // --- FRONTEND MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
