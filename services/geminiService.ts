import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from "../types.ts";

// Always initialize with named parameter and exclusive environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper to clean JSON string from model response.
 * Strips markdown code blocks if present.
 */
const cleanJsonResponse = (text: string): string => {
  return text.replace(/```json\n?|```/g, "").trim();
};

export const analyzePlasticImage = async (base64Image: string): Promise<ScanResult> => {
  try {
    // Strip header if present
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: `Analyze this image for a plastic recycling machine. 
            Determine if the object is a recyclable plastic item (bottle, container, etc.).
            Identify the plastic type (PET, HDPE, PVC, etc.) if possible.
            Estimate a rough weight in grams if it looks standard (e.g., a 500ml bottle is ~10-20g).
            
            Return ONLY a valid JSON object.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 }, // Minimize latency for classification
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isPlastic: { type: Type.BOOLEAN },
            plasticType: { type: Type.STRING, description: "Type of plastic or 'Unknown'" },
            estimatedWeight: { type: Type.NUMBER, description: "Weight in grams" },
            confidence: { type: Type.NUMBER, description: "Confidence score 0-1" },
            message: { type: Type.STRING, description: "Short user-friendly message" }
          },
          required: ["isPlastic", "message"]
        }
      }
    });

    const rawText = response.text;
    if (!rawText) throw new Error("No response from AI");
    
    const cleanedJson = cleanJsonResponse(rawText);
    return JSON.parse(cleanedJson) as ScanResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      isPlastic: false,
      message: "Could not analyze image. Please try again or enter details manually.",
      confidence: 0
    };
  }
};