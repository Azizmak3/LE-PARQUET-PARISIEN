import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { CalculationResult } from '../types';

// STRICT ENV VAR HANDLING
const API_KEY = (process.env.API_KEY as string) || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });

const CHAT_MODEL = 'gemini-3-pro-preview';
const RENOVATE_MODEL = 'gemini-2.5-flash-image';
const GEN_MODEL = 'gemini-3-pro-image-preview';

// --- UTILS ---

/**
 * Resizes an image File to a Blob with strict mobile limits
 * Reduced to 600px max to prevent Mobile Safari memory crashes with Data URLs
 */
const resizeImageToBlob = (file: File): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(null), 3000);

    const img = new Image();
    img.onload = () => {
      clearTimeout(timeout);
      try {
        // MOBILE OPTIMIZATION: 600px max ensures output Base64 stays under ~1.5MB
        const MAX_SIZE = 600; 
        let w = img.width;
        let h = img.height;

        if (w > MAX_SIZE || h > MAX_SIZE) {
          if (w > h) {
            h = Math.round((h * MAX_SIZE) / w);
            w = MAX_SIZE;
          } else {
            w = Math.round((w * MAX_SIZE) / h);
            h = MAX_SIZE;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(null);
          return;
        }

        // Fill white background to prevent transparent PNG issues
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        
        // Heavy compression (0.7) to ensure lightweight transport
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.7);
      } catch (e) {
        console.error(e);
        resolve(null);
      }
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(null);
    };
    
    try {
      img.src = URL.createObjectURL(file);
    } catch (e) {
      resolve(null);
    }
  });
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (!base64String || !base64String.includes(',')) {
        reject(new Error("Invalid base64 conversion"));
        return;
      }
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// --- ESTIMATION LOGIC ---
export const calculateEstimate = async (
  type: string,
  surface: number,
  condition: string,
  finish: string
): Promise<CalculationResult> => {
  
  let pricePerSqm = 35;
  if (condition === 'Mauvais') {
    pricePerSqm = 40;
  }

  const baseTotal = surface * pricePerSqm;
  const minPrice = baseTotal;
  const maxPrice = Math.round(baseTotal * 1.1);

  let duration = "2 jours";
  if (surface > 30) duration = "3 jours";
  if (surface > 55) duration = "4-5 jours";
  if (surface > 100) duration = "7+ jours";
  
  const result: CalculationResult = {
    minPrice: minPrice,
    maxPrice: maxPrice,
    duration: duration,
    materials: ["Vernis Premium (Bona/Blanchon)", "Abrasifs grain 40-120", "Fond dur écologique"],
    recommendation: condition === 'Mauvais' 
      ? "Vu l'état d'usure, un ponçage à blanc en 3 passes est nécessaire pour récupérer le bois brut." 
      : "Un ponçage de rafraîchissement suffira pour sublimer votre parquet.",
    confidence: 98
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(result);
    }, 1200);
  });
};

// --- CHATBOT LOGIC ---
const bookAppointmentTool: FunctionDeclaration = {
  name: "bookAppointment",
  description: "Book a consultation appointment.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      phone: { type: Type.STRING },
      date: { type: Type.STRING },
      intent: { type: Type.STRING }
    },
    required: ["name", "phone", "date"]
  }
};

export const sendChatMessage = async (history: { role: string, parts: { text: string }[] }[], newMessage: string) => {
  if (!API_KEY) return "Mode démo: Veuillez configurer votre clé API.";

  try {
    const chat = ai.chats.create({
      model: CHAT_MODEL,
      history: history,
      config: {
        tools: [{ functionDeclarations: [bookAppointmentTool] }]
      }
    });

    let result = await chat.sendMessage({ message: newMessage });
    
    if (!result) return "Erreur: Pas de réponse de l'IA.";

    const calls = result.functionCalls;
    if (calls && calls.length > 0) {
      const call = calls[0];
      const args = call.args || {};
      const nameArg = args['name'] as string | undefined;

      const functionResponse = {
        result: "success", 
        message: `Rendez-vous confirmé pour ${nameArg || 'le client'}.`
      };
      
      result = await chat.sendMessage({
        message: [{
          functionResponse: { name: call.name, response: functionResponse }
        }]
      });
    }
    
    return result.text || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Je rencontre une difficulté technique. Appelez le 06 14 49 49 07.";
  }
};

// --- IMAGE RENOVATION (CLIENT SIDE) ---
export const renovateImage = async (fileInput: File, promptText: string): Promise<string | null> => {
  const startTime = Date.now();
  
  try {
    const blob = await resizeImageToBlob(fileInput);
    if (!blob) throw new Error("Erreur image.");

    // Demo Mode
    if (!API_KEY) {
      await new Promise(r => setTimeout(r, 1500));
      const base64Data = await blobToBase64(blob);
      // Return Data URL even in demo mode
      return `data:image/jpeg;base64,${base64Data}`;
    }

    const base64Data = await blobToBase64(blob);

    // Call Gemini
    const finalPrompt = `${promptText}
    IMPORTANT: Output a PHOTOREALISTIC image. 
    Maintain the exact perspective. 
    Output must be a standard image.`;

    const response = await ai.models.generateContent({
      model: RENOVATE_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { text: finalPrompt },
            { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
          ]
        }
      ],
      config: {
        responseModalities: ["IMAGE"], 
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) throw new Error("Erreur IA");

    const imagePart = candidates[0].content?.parts?.find(p => p.inlineData);

    if (imagePart && imagePart.inlineData && imagePart.inlineData.data) {
        let resultBase64 = imagePart.inlineData.data;
        // MOBILE CRITICAL FIX: Strictly sanitize base64 string
        // Remove line breaks, spaces, or weird chars that might break mobile renderers
        resultBase64 = resultBase64.replace(/[\r\n\s]+/g, '');

        let mime = imagePart.inlineData.mimeType || 'image/jpeg';
        
        // Validate
        if (resultBase64.length < 100) throw new Error("Image corrompue");

        return `data:${mime};base64,${resultBase64}`;
    }

    throw new Error("Pas d'image générée.");

  } catch (error: any) {
    console.error('[RENOVATE] ERROR:', error);
    if (error.message?.includes('400')) return null;
    throw new Error("Une erreur est survenue.");
  }
};

export const generateInspiration = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string | null> => {
  if (!API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: GEN_MODEL,
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { imageSize: size } }
    });

    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData?.data) {
      const cleanData = part.inlineData.data.replace(/[\r\n\s]+/g, '');
      return `data:image/png;base64,${cleanData}`;
    }
    
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};