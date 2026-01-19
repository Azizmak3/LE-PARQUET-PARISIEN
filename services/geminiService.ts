import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { CalculationResult } from '../types';

// STRICT ENV VAR HANDLING: Use process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CHAT_MODEL = 'gemini-3-pro-preview';
const RENOVATE_MODEL = 'gemini-2.5-flash-image';
const GEN_MODEL = 'gemini-3-pro-image-preview';

// --- UTILS ---

/**
 * Helper to convert Base64 string back to Blob for efficient URL creation.
 * Includes strict sanitization to prevent mobile decoding errors.
 */
const base64ToBlob = (base64: string, mimeType: string): Blob => {
  try {
    // 1. Sanitize: Remove all non-base64 characters (newlines, spaces)
    const cleanBase64 = base64.replace(/[\r\n\s]/g, '');
    
    // 2. Decode
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  } catch (e) {
    console.error("Error converting base64 to blob", e);
    // Return a valid empty blob to prevent crash, caller should handle size check
    return new Blob([], { type: mimeType });
  }
};

/**
 * Resizes an image File to a Blob with strict mobile limits.
 * Uses 512px to ensure universal mobile compatibility.
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
        // MOBILE OPTIMIZATION: 512px is the safe safe limit for texture memory
        const MAX_SIZE = 512; 
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
          resolve(null);
          return;
        }

        // White background to prevent alpha channel issues
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        
        // standard jpeg quality for mobile
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.8);
      } catch (e) {
        console.error('[RESIZE] Error:', e);
        resolve(null);
      }
    };
    
    img.onerror = (e) => {
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
  console.log('[RENOVATE] Starting Client-Side renovation:', fileInput.name);

  try {
    // 1. Resize image (Critical for speed and MOBILE MEMORY)
    const blob = await resizeImageToBlob(fileInput);
    if (!blob) throw new Error("Erreur lors de la préparation de l'image.");

    // --- SAFE DEMO MODE ---
    if (!process.env.API_KEY) {
      console.warn("⚠️ [GEMINI] No API Key found. Running in DEMO MODE.");
      await new Promise(r => setTimeout(r, 1500));
      // Just return the input image as BLOB URL in demo mode
      // This confirms that if the image shows, the blob logic is working
      return URL.createObjectURL(blob);
    }

    // 2. Convert to Base64 for the SDK
    const base64Data = await blobToBase64(blob);

    // 3. Call Google Gemini Directly
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
        responseModalities: ["IMAGE"],
      }
    });

    console.log(`[RENOVATE] API responded in ${Date.now() - startTime}ms`);

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) throw new Error("L'IA n'a pas renvoyé de résultat.");
    
    const firstCandidate = candidates[0];
    const parts = firstCandidate.content?.parts;
    
    if (!parts || parts.length === 0) {
        throw new Error("Structure de réponse invalide.");
    }

    const imagePart = parts.find(p => p.inlineData);

    if (imagePart && imagePart.inlineData && imagePart.inlineData.data) {
        const resultBase64 = imagePart.inlineData.data;
        const resultMime = imagePart.inlineData.mimeType || 'image/jpeg';
        
        if (resultBase64.length < 100) {
           throw new Error("Generated image data is corrupted.");
        }
        
        // 4. USE DATA URI (Robust for Mobile)
        // Blob URLs can be revoked or fail in strict mobile webviews.
        // Data URIs are safer for immediate display.
        const dataUri = `data:${resultMime};base64,${resultBase64}`;
        
        console.log(`[GEMINI] Generated Data URI, length: ${dataUri.length}`);
        return dataUri;
    }

    throw new Error("Aucune image générée dans la réponse.");

  } catch (error: any) {
    console.error('[RENOVATE] ERROR:', error);
    if (error.message?.includes('400')) return null; 
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

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) return null;
    const parts = candidates[0].content?.parts;
    if (!parts) return null;

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        // For inspiration, we can also use Data URI for consistency, or keep Blob if it works.
        // Let's stick to blob here as high-res images might be large for Data URI
        const blob = base64ToBlob(part.inlineData.data, 'image/png');
        return URL.createObjectURL(blob);
      }
    }
    
    return null;
  } catch (error) {
    console.error('[INSPIRATION] Error:', error);
    return null;
  }
};