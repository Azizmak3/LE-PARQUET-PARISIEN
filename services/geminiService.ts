import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { CalculationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const CHAT_MODEL = 'gemini-3-pro-preview';
// Using 2.5 Flash Image for renovation as it's faster and supports edit-like instructions well
const RENOVATE_MODEL = 'gemini-2.5-flash-image';
const GEN_MODEL = 'gemini-3-pro-image-preview';

// --- UTILS ---

/**
 * Resizes an image File to a Blob with max dimension 800px for mobile compatibility
 */
const resizeImageToBlob = (file: File): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.error('[RESIZE] Timeout after 3s');
      resolve(null);
    }, 3000);

    const img = new Image();
    
    img.onload = () => {
      clearTimeout(timeout);
      try {
        const MAX_SIZE = 800; // Reduced for mobile reliability
        let w = img.width;
        let h = img.height;

        console.log(`[RESIZE] Original: ${w}x${h}`);

        if (w > MAX_SIZE || h > MAX_SIZE) {
          if (w > h) {
            h = Math.round((h * MAX_SIZE) / w);
            w = MAX_SIZE;
          } else {
            w = Math.round((w * MAX_SIZE) / h);
            h = MAX_SIZE;
          }
        }

        console.log(`[RESIZE] Resized to: ${w}x${h}`);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          console.error('[RESIZE] No canvas context');
          resolve(null);
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);
        
        // Convert to JPEG with moderate compression
        canvas.toBlob((blob) => {
          if (blob) {
            console.log(`[RESIZE] Final blob: ${blob.size} bytes (${blob.type})`);
            resolve(blob);
          } else {
            console.error('[RESIZE] toBlob returned null');
            resolve(null);
          }
        }, 'image/jpeg', 0.8);
      } catch (e) {
        console.error('[RESIZE] Error:', e);
        resolve(null);
      }
    };
    
    img.onerror = (e) => {
      clearTimeout(timeout);
      console.error('[RESIZE] Image load error:', e);
      resolve(null);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data:image/jpeg;base64, prefix
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
  if (!process.env.API_KEY) return "Mode démo: Veuillez configurer votre clé API.";

  try {
    const chat = ai.chats.create({
      model: CHAT_MODEL,
      history: history,
      config: {
        tools: [{ functionDeclarations: [bookAppointmentTool] }]
      }
    });

    let result = await chat.sendMessage({ message: newMessage });
    
    const calls = result.functionCalls;
    if (calls && calls.length > 0) {
      const call = calls[0];
      const functionResponse = {
        result: "success", 
        message: `Rendez-vous confirmé pour ${call.args['name']}.`
      };
      result = await chat.sendMessage({
        message: [{
          functionResponse: { name: call.name, response: functionResponse }
        }]
      });
    }
    return result.text;
  } catch (error) {
    return "Je rencontre une difficulté technique. Appelez le 06 14 49 49 07.";
  }
};

// --- IMAGE RENOVATION (CLIENT SIDE) ---
export const renovateImage = async (fileInput: File, promptText: string): Promise<string | null> => {
  const startTime = Date.now();
  console.log('[RENOVATE] Starting Client-Side renovation:', fileInput.name);

  try {
    // 1. Resize image (Critical for speed)
    console.log('[RENOVATE] Resizing image...');
    const blob = await resizeImageToBlob(fileInput);
    if (!blob) throw new Error("Erreur lors de la préparation de l'image.");

    // 2. Convert to Base64 for the SDK
    const base64Data = await blobToBase64(blob);

    // 3. Call Google Gemini Directly (Bypasses Netlify Timeout)
    console.log('[RENOVATE] Calling Gemini API directly...');
    
    const finalPrompt = `${promptText}

CRITICAL INSTRUCTIONS:
- Return a modified image of the floor provided.
- Apply high-quality renovation: remove scratches, fix wear, make it look new.
- Maintain the perspective and layout of the room exactly.
- Ensure the result is photorealistic.`;

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
        responseModalities: ["IMAGE"], // Force image output
      }
    });

    console.log(`[RENOVATE] API responded in ${Date.now() - startTime}ms`);

    // 4. Extract Image
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) throw new Error("L'IA n'a pas renvoyé de résultat.");
    
    const parts = candidates[0].content.parts;
    const imagePart = parts.find(p => p.inlineData);

    if (imagePart && imagePart.inlineData) {
        const resultBase64 = imagePart.inlineData.data;
        const resultMime = imagePart.inlineData.mimeType || 'image/jpeg';
        // Create Blob URL
        const byteCharacters = atob(resultBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const resultBlob = new Blob([byteArray], { type: resultMime });
        return URL.createObjectURL(resultBlob);
    }

    throw new Error("Aucune image générée dans la réponse.");

  } catch (error: any) {
    console.error('[RENOVATE] ERROR:', error);
    if (error.message?.includes('400')) return null; // Bad Request usually means safety filter or bad image
    throw new Error(error.message || "Une erreur est survenue pendant la génération.");
  }
};

export const generateInspiration = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string | null> => {
  if (!process.env.API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: GEN_MODEL,
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { imageSize: size } }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error('[INSPIRATION] Error:', error);
    return null;
  }
};