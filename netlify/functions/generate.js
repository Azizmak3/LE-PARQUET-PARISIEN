const { GoogleGenAI } = require("@google/genai");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { imageBase64, prompt } = body;

    if (!imageBase64 || !prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing imageBase64 or prompt" }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "GEMINI_API_KEY is not configured" }),
      };
    }

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

    const ai = new GoogleGenAI({ apiKey });
    
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
      config: {
        responseModalities: ["IMAGE"],
      }
    });

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
        
        const dataUri = `data:${resultMime};base64,${resultBase64}`;
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: dataUri }),
        };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Aucune image générée dans la réponse." }),
    };

  } catch (error) {
    console.error("Error generating image:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal Server Error" }),
    };
  }
};
