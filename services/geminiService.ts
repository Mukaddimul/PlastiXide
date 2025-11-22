import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from "../types";

// Initialize the client
// Note: In a real app, do not expose API keys on the client side. 
// This is for the hackathon/demo context.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzePlasticImage = async (base64Image: string): Promise<ScanResult> => {
  try {
    // Strip header if present
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
            
            Return JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
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

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ScanResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      isPlastic: false,
      message: "Could not analyze image. Please try again.",
      confidence: 0
    };
  }
};