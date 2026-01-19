const Busboy = require('busboy');

exports.handler = async function (event, context) {
  const startTime = Date.now();
  console.log('[GEMINI] Request started at', new Date().toISOString());

  // CORS Headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    // 1. PARSE MULTIPART WITH TIMEOUT
    const parseMultipart = () => new Promise((resolve, reject) => {
      const parseTimeout = setTimeout(() => {
        reject(new Error("Parsing timeout - file too large or corrupted"));
      }, 5000); // 5s max for parsing

      try {
        const busboy = Busboy({
          headers: event.headers,
          limits: { 
            fileSize: 5 * 1024 * 1024, // 5MB hard limit
            files: 1 
          }
        });

        const result = { prompt: "", fileBuffer: null, mimeType: "" };
        let fileLimitExceeded = false;

        busboy.on('file', (fieldname, file, info) => {
          const { mimeType } = info;
          const chunks = [];
          
          file.on('limit', () => {
            fileLimitExceeded = true;
            file.resume(); // Drain the stream
          });

          file.on('data', (data) => {
            if (!fileLimitExceeded) chunks.push(data);
          });

          file.on('end', () => {
            if (fileLimitExceeded) {
              console.log('[GEMINI] File size limit exceeded');
              return;
            }
            result.fileBuffer = Buffer.concat(chunks);
            result.mimeType = mimeType;
            console.log(`[GEMINI] File parsed: ${result.fileBuffer.length} bytes, ${mimeType}`);
          });
        });

        busboy.on('field', (fieldname, val) => {
          if (fieldname === 'prompt') {
            result.prompt = val;
            console.log(`[GEMINI] Prompt: "${val.substring(0, 50)}..."`);
          }
        });

        busboy.on('finish', () => {
          clearTimeout(parseTimeout);
          if (fileLimitExceeded) {
            reject(new Error("File too large (max 5MB)"));
          } else {
            resolve(result);
          }
        });

        busboy.on('error', (err) => {
          clearTimeout(parseTimeout);
          reject(err);
        });

        // Write body
        if (event.isBase64Encoded) {
          busboy.write(Buffer.from(event.body, 'base64'));
        } else {
          busboy.write(Buffer.from(event.body));
        }
        busboy.end();
      } catch (e) {
        clearTimeout(parseTimeout);
        reject(e);
      }
    });

    const { prompt, fileBuffer, mimeType } = await parseMultipart();
    console.log(`[GEMINI] Parsing complete in ${Date.now() - startTime}ms`);

    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error("No valid file uploaded");
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[GEMINI] Missing API key');
      throw new Error("Server configuration error");
    }

    // 2. CALL GEMINI WITH EXPLICIT INSTRUCTIONS AND CORRECT MODEL
    // Updated to use gemini-2.5-flash-image which is the current recommended model for standard image tasks
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`;
    
    // CRITICAL: Tell Gemini EXACTLY what to do
    const instructionPrompt = `${prompt}

CRITICAL INSTRUCTIONS:
- You MUST return a MODIFIED image, not the original
- Apply visible floor renovation: remove scratches, restore wood grain, add shine/finish
- Transform the floor to look professionally renovated
- The output MUST be visibly different from the input
- Ensure high quality photorealistic rendering`;

    const payload = {
      contents: [{
        parts: [
          { text: instructionPrompt },
          { 
            inlineData: { 
              mimeType: mimeType, 
              data: fileBuffer.toString('base64') 
            } 
          }
        ]
      }],
      generationConfig: {
        responseModalities: ["IMAGE"],
        temperature: 0.4 // Lower for consistent quality
      }
    };

    console.log(`[GEMINI] Calling API with ${fileBuffer.length} byte image`);
    const apiStartTime = Date.now();

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const apiDuration = Date.now() - apiStartTime;
    console.log(`[GEMINI] API responded in ${apiDuration}ms with status ${response.status}`);

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[GEMINI] API Error: ${errText.substring(0, 300)}`);
      throw new Error(`Gemini API returned ${response.status}`);
    }

    const data = await response.json();
    console.log(`[GEMINI] Response structure:`, {
      hasCandidates: !!data.candidates,
      candidatesCount: data.candidates?.length,
      firstCandidateHasContent: !!data.candidates?.[0]?.content,
      partsCount: data.candidates?.[0]?.content?.parts?.length
    });

    // 3. VALIDATE RESPONSE
    if (!data.candidates || data.candidates.length === 0) {
      console.error('[GEMINI] No candidates in response');
      throw new Error("AI returned no results");
    }

    const candidate = data.candidates[0];
    if (!candidate.content || !candidate.content.parts) {
      console.error('[GEMINI] Candidate missing content/parts');
      throw new Error("Invalid AI response structure");
    }

    const imagePart = candidate.content.parts.find(p => p.inlineData);
    
    if (!imagePart || !imagePart.inlineData || !imagePart.inlineData.data) {
      console.error('[GEMINI] No image data in response parts:', 
        candidate.content.parts.map(p => Object.keys(p))
      );
      throw new Error("AI returned no image data");
    }

    const resultBase64 = imagePart.inlineData.data;
    const resultMime = imagePart.inlineData.mimeType || "image/jpeg";

    console.log(`[GEMINI] SUCCESS: Returned ${resultBase64.length} chars of base64, type: ${resultMime}`);
    console.log(`[GEMINI] Total duration: ${Date.now() - startTime}ms`);

    return {
      statusCode: 200,
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        success: true,
        imageBase64: resultBase64,
        mimeType: resultMime,
        duration: Date.now() - startTime
      })
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[GEMINI] ERROR after ${duration}ms:`, error.message);
    console.error('[GEMINI] Stack:', error.stack);

    // Determine error type for better user messaging
    let userMessage = "Erreur technique. Veuillez réessayer.";
    let statusCode = 500;

    if (error.message.includes("timeout") || error.message.includes("Timeout")) {
      userMessage = "Le traitement a pris trop de temps. Essayez une image plus légère.";
      statusCode = 504;
    } else if (error.message.includes("too large") || error.message.includes("5MB")) {
      userMessage = "Image trop volumineuse. Maximum 5MB.";
      statusCode = 413;
    } else if (error.message.includes("No valid file")) {
      userMessage = "Fichier invalide ou corrompu.";
      statusCode = 400;
    } else if (error.message.includes("API")) {
      userMessage = "Service IA temporairement indisponible.";
      statusCode = 503;
    }

    return {
      statusCode: statusCode,
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ 
        success: false,
        error: userMessage,
        technicalDetails: error.message,
        duration: duration
      })
    };
  }
};