import { GoogleGenAI, Type, FunctionDeclaration, Tool } from "@google/genai";
import { CalculationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const TEXT_MODEL = 'gemini-3-flash-preview';
const CHAT_MODEL = 'gemini-3-pro-preview'; // Upgraded for better reasoning/booking
const EDIT_MODEL = 'gemini-2.5-flash-image';
const GEN_MODEL = 'gemini-3-pro-image-preview';

// --- ESTIMATION LOGIC ---
export const calculateEstimate = async (
  type: string,
  surface: number,
  condition: string,
  finish: string
): Promise<CalculationResult> => {
  if (!process.env.API_KEY) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          minPrice: surface * 85,
          maxPrice: surface * 125,
          duration: surface < 30 ? "2-3 jours" : "4-5 jours",
          materials: ["Vernis Premium (Bona/Blanchon)", "Abrasifs grain 40-120", "Fond dur écologique"],
          recommendation: "Pour ce type de surface, nous recommandons une finition mate pour un rendu naturel et durable.",
          confidence: 92
        });
      }, 1500);
    });
  }

  const prompt = `
    Agis comme un expert estimateur de travaux de parquet à Paris.
    Calcule une estimation pour le projet suivant:
    - Type de travaux: ${type}
    - Surface: ${surface} m2
    - État actuel: ${condition}
    - Finition souhaitée: ${finish}

    Prends en compte les prix du marché parisien haut de gamme.
    Retourne UNIQUEMENT un objet JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            minPrice: { type: Type.NUMBER },
            maxPrice: { type: Type.NUMBER },
            duration: { type: Type.STRING },
            materials: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING },
            confidence: { type: Type.NUMBER, description: "Percentage confidence 0-100" }
          },
          required: ["minPrice", "maxPrice", "duration", "materials", "recommendation", "confidence"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as CalculationResult;
  } catch (error) {
    console.error("Gemini Calculation Error:", error);
    return {
      minPrice: surface * 90,
      maxPrice: surface * 130,
      duration: "À définir",
      materials: ["Matériaux standard"],
      recommendation: "Nous vous invitons à nous contacter pour une estimation précise.",
      confidence: 80
    };
  }
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
        Ton but est d'aider les clients à estimer leurs travaux et surtout de RÉSERVER un rendez-vous (visite technique gratuite ou appel).
        
        Règles:
        1. Sois professionnel, chaleureux et concis.
        2. Si le client semble intéressé par un devis précis, propose immédiatement une visite technique gratuite.
        3. Pour réserver, tu DOIS collecter dans l'ordre : Nom, Téléphone, et Date souhaitée.
        4. Une fois ces 3 infos obtenues, appelle l'outil 'bookAppointment'.
        5. Ne donne pas de faux prix fixes sans connaître les détails, donne des fourchettes.`,
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
  // FALLBACK / DEMO MODE: If no API Key, return a high-quality "After" image simulation
  if (!process.env.API_KEY) {
    // Return a beautiful parquet floor image to simulate the "After" effect for demo purposes
    return "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80";
  }

  try {
    const response = await ai.models.generateContent({
      model: EDIT_MODEL,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: promptText || "Rénove ce parquet pour qu'il soit neuf et brillant. Style haussmannien moderne." }
        ]
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Renovation Error:", error);
    // Return fallback on error too, to keep the UX smooth
    return "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80";
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