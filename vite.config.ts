import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const netlifyMockPlugin = () => ({
  name: 'netlify-mock',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url === '/.netlify/functions/generate' && req.method === 'POST') {
        let bodyStr = '';
        req.on('data', (chunk: any) => { bodyStr += chunk.toString(); });
        req.on('end', async () => {
          try {
            const body = JSON.parse(bodyStr);
            const { imageBase64, prompt } = body;
            
            if (!imageBase64 || !prompt) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Missing imageBase64 or prompt" }));
              return;
            }

            const apiKey = process.env.VITE_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY;
            
            if (!apiKey) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "API Key not configured" }));
              return;
            }

            // Using dynamic import to avoid requiring genai in vite config build
            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey });

            const finalPrompt = `
            ACT AS A HIGH-END INTERIOR DESIGN PHOTO EDITOR.
            INPUT IMAGE: Use the provided image as the absolute ground truth for the room's geometry.
            TASK: Change the floor finish to: "${prompt}".
            
            STRICT CONSTRAINTS:
            1. REPAIR & CLEAN: Remove all stains, scratches, water damage, and signs of wear from the floor. The floor must look brand new and perfectly installed.
            2. EXACT MATCH: The walls, windows, furniture, ceiling, and lighting MUST be identical to the original image. Do not move, add, or remove any object.
            3. PERSPECTIVE LOCK: The new floor lines must follow the exact perspective of the original room.
            4. PHOTOREALISM: The floor texture must look like high-quality, real wood flooring.
            
            OUTPUT: The exact same photo, but with the renovated, pristine floor.`;

            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash-image",
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: finalPrompt },
                    { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }
                  ]
                }
              ],
              config: { responseModalities: ["IMAGE"] }
            });

            const candidates = response.candidates;
            if (!candidates || candidates.length === 0) throw new Error("L'IA n'a pas renvoyé de résultat.");
            
            const firstCandidate = candidates[0];
            const parts = firstCandidate.content?.parts;
            if (!parts || parts.length === 0) throw new Error("Structure de réponse invalide.");

            const imagePart = parts.find((p: any) => p.inlineData);
            if (imagePart && imagePart.inlineData && imagePart.inlineData.data) {
                const resultBase64 = imagePart.inlineData.data;
                const resultMime = imagePart.inlineData.mimeType || 'image/jpeg';
                const dataUri = `data:${resultMime};base64,${resultBase64}`;
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ imageBase64: dataUri }));
                return;
            }

            throw new Error("Aucune image générée.");
          } catch(err: any) {
            console.error('Mock server error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
        return;
      }
      next();
    });
  }
});

export default defineConfig(({ mode }) => {
  // Cast process to any to fix TS error: Property 'cwd' does not exist on type 'Process'
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Robust fallback logic for keys
  const apiKey = env.API_KEY || env.GEMINI_API_KEY || '';
  const supabaseUrl = env.SUPABASE_URL || '';
  const supabaseAnonKey = env.SUPABASE_ANON_KEY || '';
  
  // IMPORTANT: Since we moved Gemini API call from frontend to backend,
  // we do NOT inject API_KEY into frontend bundle for the generate endpoint.
  // We keep it for existing chat/inspiration endpoints that are still frontend.
  
  return {
    plugins: [react(), netlifyMockPlugin()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.SUPABASE_URL': JSON.stringify(supabaseUrl),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey)
    }
  };
});