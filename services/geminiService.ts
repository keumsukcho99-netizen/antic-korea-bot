import { GoogleGenAI, Type } from "@google/genai";
import { AppraisalResult, AppraisalConfig } from "../types";

export async function analyzeArtifact(imageBases: string[], config: AppraisalConfig): Promise<AppraisalResult> {
  // process.env.API_KEY는 플랫폼에서 자동으로 주입됩니다.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const model = 'gemini-3-pro-preview';

  const imageParts = imageBases.map(base64 => ({
    inlineData: { 
      mimeType: "image/jpeg", 
      data: base64.includes(',') ? base64.split(',')[1] : base64 
    }
  }));

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: `이 유물을 분석하십시오. 카테고리: ${config.category}. 작가와 시대를 정밀 고증하고 학술적 근거를 바탕으로 JSON으로 출력하십시오.` },
        ...imageParts
      ]
    },
    config: {
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }],
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          category: { type: Type.STRING },
          period: { type: Type.STRING },
          description: { type: Type.STRING },
          confidenceScore: { type: Type.NUMBER },
          coreAnalysis: {
            type: Type.OBJECT,
            properties: {
              sealsAndSignatures: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, score: { type: Type.NUMBER } }, required: ["content", "score"] },
              historicalValue: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, score: { type: Type.NUMBER } }, required: ["content", "score"] },
              academicVerification: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, score: { type: Type.NUMBER } }, required: ["content", "score"] },
              materialAndStorage: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, score: { type: Type.NUMBER } }, required: ["content", "score"] }
            },
            required: ["sealsAndSignatures", "historicalValue", "academicVerification", "materialAndStorage"]
          },
          analysis: {
            type: Type.OBJECT,
            properties: {
              artifactDetails: { type: Type.STRING },
              historicalSignificance: { type: Type.STRING },
              conditionReport: { type: Type.STRING }
            },
            required: ["artifactDetails", "historicalSignificance", "conditionReport"]
          },
          estimatedValue: {
            type: Type.OBJECT,
            properties: {
              min: { type: Type.NUMBER },
              max: { type: Type.NUMBER },
              currency: { type: Type.STRING },
              note: { type: Type.STRING }
            },
            required: ["min", "max", "currency", "note"]
          }
        },
        required: ["title", "category", "period", "description", "confidenceScore", "coreAnalysis", "analysis", "estimatedValue"]
      }
    }
  });

  const text = response.text || '{}';
  const data = JSON.parse(text);
  
  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    imageUrls: imageBases,
    ...data,
    isDonated: config.allowDigitalMuseum
  };
}
