import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { db } from './backend/db/index.js';
import { seedDatabase, resetDatabase } from './backend/seed.js';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' })); // Allow image uploads
  app.use(cors());

  // Initialize DB
  seedDatabase();

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // --- API ROUTES ---

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date() });
  });

  app.post('/api/reset', (req, res) => {
    resetDatabase();
    res.json({ success: true });
  });

  // Materials & Prices
  app.get('/api/materials', (req, res) => {
    res.json(db.getState().materials);
  });

  // Recyclers
  app.get('/api/recyclers', (req, res) => {
    res.json(db.getState().recyclers);
  });

  app.get('/api/recyclers/match', (req, res) => {
    const { material } = req.query;
    const recyclers = db.getState().recyclers.filter(r => 
      r.materials_accepted.includes(material as string)
    );
    res.json(recyclers);
  });

  // Lots
  app.post('/api/lots', (req, res) => {
    const lot = { ...req.body, id: 'EW-' + Date.now(), created_at: new Date().toISOString() };
    const state = db.getState();
    state.lots.push(lot);
    db.save();
    res.json(lot);
  });

  app.get('/api/lots', (req, res) => {
    const { collector_id } = req.query;
    let lots = db.getState().lots;
    if (collector_id) {
      lots = lots.filter(l => l.collector_id === collector_id);
    }
    // sort by created desc
    lots.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json(lots);
  });

  app.get('/api/lots/:id', (req, res) => {
    const lot = db.getState().lots.find(l => l.id === req.params.id);
    if (lot) res.json(lot);
    else res.status(404).json({ error: 'Lot not found' });
  });

  app.put('/api/lots/:id', (req, res) => {
    const state = db.getState();
    const index = state.lots.findIndex(l => l.id === req.params.id);
    if (index !== -1) {
      state.lots[index] = { ...state.lots[index], ...req.body };
      db.save();
      res.json(state.lots[index]);
    } else {
      res.status(404).json({ error: 'Lot not found' });
    }
  });

  // Offers
  app.post('/api/offers', (req, res) => {
    const offer = { ...req.body, id: 'OFF-' + Date.now(), created_at: new Date().toISOString() };
    const state = db.getState();
    state.offers.push(offer);
    
    // Update lot status
    const lot = state.lots.find(l => l.id === offer.lot_id);
    if(lot) lot.status = 'OFFER_RECEIVED';
    
    db.save();
    res.json(offer);
  });

  app.get('/api/offers', (req, res) => {
    const { lot_id } = req.query;
    let offers = db.getState().offers;
    if (lot_id) {
      offers = offers.filter(o => o.lot_id === lot_id);
    }
    res.json(offers);
  });

  // Transactions
  app.post('/api/transactions', (req, res) => {
    const tx = { ...req.body, id: 'TX-' + Date.now(), created_at: new Date().toISOString() };
    const state = db.getState();
    state.transactions.push(tx);
    db.save();
    res.json(tx);
  });

  app.get('/api/transactions', (req, res) => {
    const { collector_id } = req.query;
    let txs = db.getState().transactions;
    if (collector_id) {
      txs = txs.filter(t => t.collector_id === collector_id);
    }
    txs.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json(txs);
  });

  app.put('/api/transactions/:id', (req, res) => {
    const state = db.getState();
    const index = state.transactions.findIndex(l => l.id === req.params.id);
    if (index !== -1) {
      state.transactions[index] = { ...state.transactions[index], ...req.body };
      db.save();
      res.json(state.transactions[index]);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
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
