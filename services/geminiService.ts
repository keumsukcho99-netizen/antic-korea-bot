import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppraisalResult } from "../types";

// Vite에서는 import.meta.env로 환경변수를 가져옵니다
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiService = {
  async analyzeImage(
    imageBase64: string,
    mimeType: string
  ): Promise<AppraisalResult> {
    try {
      if (!API_KEY) {
        throw new Error("API Key가 설정되지 않았습니다.");
      }

      // 최신 모델인 gemini-1.5-flash 사용 (속도가 빠름)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        당신은 40년 경력의 한국 고미술 감정 전문가입니다.
        이 유물의 사진을 보고 다음 정보를 JSON 형식으로 분석해 주세요.
        반드시 다음 형식을 엄격히 지켜야 합니다:
        {
          "name": "유물 추정 명칭",
          "era": "추정 시대 (예: 고려시대 12세기)",
          "estimatedValue": "추정 가치 (원화 및 달러)",
          "description": "유물의 특징, 문양, 기법에 대한 3줄 이상의 상세한 설명",
          "confidence": 80 (확신하는 정도를 0~100 사이 숫자로)
        }
        설명은 한국어로 품격 있고 전문적인 어조로 작성해 주세요.
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();

      // JSON 부분만 추출 (혹시 모를 마크다운 제거)
      const cleanText = text.replace(/```json|```/g, "").trim();
      
      return JSON.parse(cleanText) as AppraisalResult;
    } catch (error) {
      console.error("AI 분석 중 오류 발생:", error);
      throw new Error("분석에 실패했습니다. 다시 시도해 주세요.");
    }
  },
};
