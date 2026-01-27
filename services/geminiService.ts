import { GoogleGenAI, Modality, Type } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY가 없습니다.");
  return new GoogleGenAI({ apiKey });
};

let audioCtx: AudioContext | null = null;
export const getSharedAudioCtx = () => {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

export const getAppraisal = async (notes: string, images: { data: string, mimeType: string }[] = []) => {
  const ai = getAI();
  const prompt = `당신은 황실 유물 감정소의 수석 큐레이터 '고산'입니다. 
  사용자가 올린 유물을 정밀 분석하여 품격 있는 구어체로 설명해주세요.
  답변의 마지막에는 반드시 아래 형식의 JSON 데이터를 포함해야 합니다:
  {
    "certificate": {
      "id": "CERT-${Math.floor(Math.random() * 900000 + 100000)}",
      "itemName": "유물 명칭",
      "period": "추정 시기",
      "rarity": "희귀도 (국보급/희귀/정교함/보통 중 택1)",
      "estimatedValue": "추정 감정가",
      "summary": "유물의 가치를 담은 한 줄 요약"
    }
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        ...images.map(img => ({ inlineData: img })),
        { text: notes },
        { text: prompt }
      ]
    }
  });

  return response.text;
};

export const interpretAncientBook = async (parts: any[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts: [...parts, { text: "이 고서를 판독하고 번역하여 해설을 제공해 주십시오." }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          originalText: { type: Type.STRING },
          translation: { type: Type.STRING },
          commentary: { type: Type.STRING },
          era: { type: Type.STRING },
          authorNote: { type: Type.STRING },
        },
        required: ["originalText", "translation", "commentary", "era"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const generateSpeech = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text.substring(0, 500) }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
};

export async function decodeAudio(base64: string): Promise<AudioBuffer | null> {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const ctx = getSharedAudioCtx();
  const dataInt16 = new Int16Array(bytes.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}
