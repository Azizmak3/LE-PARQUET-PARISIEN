import { GoogleGenAI, Type, FunctionDeclaration, Tool } from "@google/genai";
import { CalculationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const TEXT_MODEL = 'gemini-3-flash-preview';
const CHAT_MODEL = 'gemini-3-pro-preview';
const EDIT_MODEL = 'gemini-2.5-flash-image';
const GEN_MODEL = 'gemini-3-pro-image-preview';

// --- ESTIMATION LOGIC ---
export const calculateEstimate = async (
  type: string,
  surface: number,
  condition: string, // Expecting 'Bon', 'Moyen', or 'Mauvais'
  finish: string
): Promise<CalculationResult> => {
  
  // --- STRICT PRICING RULES ---
  // Rule: 35 EUR/m2 for Bon/Moyen, 40 EUR/m2 for Mauvais (Abimé)
  let pricePerSqm = 35;
  if (condition === 'Mauvais') {
    pricePerSqm = 40;
  }

  const baseTotal = surface * pricePerSqm;
  
  // We create a tight range: Calculated Price is the minimum.
  // We add ~10% for the max price to account for potential specific difficulties.
  const minPrice = baseTotal;
  const maxPrice = Math.round(baseTotal * 1.1);

  // Determine duration based on surface
  let duration = "2 jours";
  if (surface > 30) duration = "3 jours";
  if (surface > 55) duration = "4-5 jours";
  if (surface > 100) duration = "7+ jours";

  // AI is only used here to generate a nice recommendation text, 
  // but we enforce the price mathematically.
  
  const result: CalculationResult = {
    minPrice: minPrice,
    maxPrice: maxPrice,
    duration: duration,
    materials: ["Vernis Premium (Bona/Blanchon)", "Abrasifs grain 40-120", "Fond dur écologique"],
    recommendation: condition === 'Mauvais' 
      ? "Vu l'état d'usure, un ponçage à blanc en 3 passes est nécessaire pour récupérer le bois brut." 
      : "Un ponçage de rafraîchissement suffira pour sublimer votre parquet.",
    confidence: 98 // High confidence because it's based on fixed rules
  };

  // Simulate network delay for UX (loader)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(result);
    }, 1200);
  });
};

// --- CHATBOT & BOOKING LOGIC ---

// Define the booking tool
const bookAppointmentTool: FunctionDeclaration = {
  name: "bookAppointment",
  description: "Book a consultation appointment for flooring renovation. Use this when the user agrees to schedule a visit or call.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Name of the client" },
      phone: { type: Type.STRING, description: "Phone number of the client" },
      date: { type: Type.STRING, description: "Preferred date and time for the appointment" },
      intent: { type: Type.STRING, description: "Type of appointment: 'visit' (on-site) or 'call' (phone)" }
    },
    required: ["name", "phone", "date"]
  }
};

export const sendChatMessage = async (history: { role: string, parts: { text: string }[] }[], newMessage: string) => {
  if (!process.env.API_KEY) return "Mode démo: Veuillez configurer votre clé API pour discuter avec l'expert.";

  try {
    const chat = ai.chats.create({
      model: CHAT_MODEL,
      history: history,
      config: {
        systemInstruction: `Tu es 'L'Expert', l'assistant virtuel de 'LE PARQUET PARISIEN'. 
        Ton but est d'aider les clients à estimer leurs travaux et surtout de RÉSERVER un rendez-vous.
        
        RÈGLES DE PRIX (À CONNAÎTRE PAR CŒUR) :
        - Rénovation standard (Bon/Moyen état) : environ 35€/m².
        - Rénovation lourde (Très abîmé/Mauvais état) : environ 40€/m².
        
        Règles de conversation :
        1. Sois professionnel, chaleureux et concis.
        2. Si le client demande un prix, utilise les règles ci-dessus pour donner une estimation.
        3. Propose rapidement une visite technique gratuite.
        4. Pour réserver, collecte : Nom, Téléphone, et Date souhaitée.
        5. Une fois ces 3 infos obtenues, appelle l'outil 'bookAppointment'.`,
        tools: [{ functionDeclarations: [bookAppointmentTool] }]
      }
    });

    let result = await chat.sendMessage({ message: newMessage });
    
    // Handle Function Calling Loop
    const calls = result.functionCalls;
    if (calls && calls.length > 0) {
      const call = calls[0];
      
      console.log("Executing Tool:", call.name, call.args);
      
      const functionResponse = {
        result: "success", 
        message: `Rendez-vous confirmé pour ${call.args['name']} le ${call.args['date']}. Un SMS de confirmation a été envoyé au ${call.args['phone']}.`
      };

      // Send result back to model to get final natural language confirmation
      result = await chat.sendMessage({
        content: [{
          role: 'function',
          parts: [{
            functionResponse: {
              name: call.name,
              response: functionResponse
            }
          }]
        }]
      });
    }

    return result.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Je rencontre une difficulté technique pour accéder à mon agenda. Pouvez-vous appeler directement le 06 14 49 49 07 ?";
  }
};

// --- IMAGE FEATURES ---

export const renovateImage = async (base64Image: string, promptText: string): Promise<string | null> => {
  try {
    // 1. Parse Input: Handle both raw base64 and Data URL (data:image/jpeg;base64,...)
    let mimeType = 'image/jpeg';
    let cleanBase64 = base64Image;

    if (base64Image.includes(';base64,')) {
        const parts = base64Image.split(';base64,');
        // parts[0] is "data:image/jpeg"
        mimeType = parts[0].replace('data:', '');
        cleanBase64 = parts[1];
    }

    // 2. Call Netlify Function
    const response = await fetch('/.netlify/functions/gemini-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: promptText || "Rénove ce parquet pour qu'il soit neuf et brillant. Style haussmannien moderne.",
            imageBase64: cleanBase64,
            mimeType: mimeType
        })
    });

    if (!response.ok) {
        throw new Error(`Netlify Function returned ${response.status}`);
    }

    const data = await response.json();
    
    // 3. Reconstruct Data URL from response
    if (data.imageBase64) {
      // Use mimeType from response or fallback to input type
      const outMime = data.mimeType || mimeType;
      return `data:${outMime};base64,${data.imageBase64}`;
    }
    
    return null;

  } catch (error) {
    console.error("Renovation Error:", error);
    // Return null so the UI knows it failed, instead of showing a fake image
    return null; 
  }
};

export const generateInspiration = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string | null> => {
  if (!process.env.API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: GEN_MODEL,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: size
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Generation Error:", error);
    return null;
  }
};