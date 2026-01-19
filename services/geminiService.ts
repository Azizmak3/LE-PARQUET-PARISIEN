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
 * Reduced to 512px max to ensure Data URL stays < 500KB for instant mobile rendering
 */
const resizeImageToBlob = (file: File): Promise<Blob | null> => {
  return new Promise((resolve) => {
    // Extended timeout for older mobile devices processing high-res inputs
    const timeout = setTimeout(() => {
        console.warn('[RESIZE] Timed out');
        resolve(null);
    }, 4500);

    const img = new Image();
    img.onload = () => {
      clearTimeout(timeout);
      try {
        // MOBILE OPTIMIZATION: 512px is the sweet spot for mobile screens
        const MAX_SIZE = 512; 
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

        // Fill white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        
        // High compression (0.6) for lightweight transport
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.6);
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
    return result.text || "Je n'ai pas compris.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Désolé, le service est indisponible.";
  }
};

// --- IMAGE RENOVATION LOGIC ---
export const renovateImage = async (file: File, prompt: string): Promise<string | null> => {
  if (!API_KEY) {
    console.error("Missing API Key");
    return null;
  }

  try {
    const blob = await resizeImageToBlob(file);
    if (!blob) return null;

    const base64Data = await blobToBase64(blob);

    const response = await ai.models.generateContent({
      model: RENOVATE_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: blob.type,
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    if (response.candidates && response.candidates.length > 0 && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Renovate Image Error:", error);
    return null;
  }
};

// --- INSPIRATION GENERATION LOGIC ---
export const generateInspiration = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string | null> => {
  if (!API_KEY) {
    console.error("Missing API Key");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: GEN_MODEL,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1"
        }
      }
    });

    if (response.candidates && response.candidates.length > 0 && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Generate Inspiration Error:", error);
    return null;
  }
};
