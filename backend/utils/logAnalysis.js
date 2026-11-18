import { GoogleGenAI } from '@google/genai';
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const logAnalysis = async (data) => {
  try {
    const response = await ai.interactions.create({
      model: 'gemini-3.5-flash-lite',
      input: 'You are a senior software debugging assistant. Analyze the log provided below. Your task: 1. Identify the primary error. 2. Categorize the error. 3. Estimate severity as LOW, MEDIUM, HIGH or CRITICAL. 4. Explain the probable root cause. 5. Recommend a practical fix. 6. Provide debugging steps. 7. Do not invent information that cannot be inferred from the log. Return JSON only using: {"errorType":"<ERROR_TYPE>", "category": "<CATEGORY>", "severity":"<SEVERITY>", "rootCause":"<ROOT_CAUSE>","fixRecommendation":"<FIX_RECOMMENDATION>","debuggingSteps":[] }' + data,
    });
    
    // console.log(response.output_text);

    const cleanText = response.output_text.replace(/```json\s*|\s*```/g, "").trim();

    const jsonObject = JSON.parse(cleanText);

    return jsonObject;
    
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export default logAnalysis;
