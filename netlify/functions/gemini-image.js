exports.handler = async function(event, context) {
  // Setup CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed", headers };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable");
    }

    // Parse incoming body
    const { prompt, imageBase64, mimeType } = JSON.parse(event.body);

    if (!imageBase64 || !mimeType) {
      throw new Error("Missing imageBase64 or mimeType in request body");
    }

    // Call Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{
        parts: [
          { text: prompt || "Renovate this parquet flooring to look brand new." },
          { inlineData: { mimeType: mimeType, data: imageBase64 } }
        ]
      }],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"]
      }
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error:", errText);
      throw new Error(`Gemini API returned ${response.status}: ${errText}`);
    }

    const data = await response.json();

    // Extract the generated image from the response
    const part = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    
    if (!part) {
      console.error("No inlineData found in Gemini response", JSON.stringify(data));
      throw new Error("Gemini generation successful but no image returned.");
    }

    // Return successful response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        imageBase64: part.inlineData.data,
        mimeType: part.inlineData.mimeType || "image/jpeg"
      })
    };

  } catch (error) {
    console.error("Function Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Internal Server Error" })
    };
  }
};