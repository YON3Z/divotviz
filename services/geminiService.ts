import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const streamDivotAnalysis = async (
  prompt: string, 
  onChunk: (text: string) => void
): Promise<void> => {
  try {
    const modelId = 'gemini-2.5-flash';
    const systemInstruction = `You are a Quantum Physics and Neuroscience expert specializing in "Divot Theory". 
    You interpret data visualizations related to memory formation, quantum phase fields, and entropy.
    
    The user is looking at a dashboard with 4 panels:
    1. (A) "Tiled Valley" Topology: A 3D surface representing a Quantum Phase Field.
    2. (B) "Goldilocks" Zone: A correlation graph peaking at 0.5.
    3. (C) Paternal Leakage Collapse: A bar chart showing cluster stability dropping as leakage increases.
    4. (D) Memory Self-Organization: A 3D sphere showing engram formation.
    
    Keep your answers concise, scientific but accessible, and "cool". Use terms like "decoherence", "phase space", and "attractor basins".`;

    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const responseStream = await chat.sendMessageStream({ message: prompt });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Error streaming from Gemini:", error);
    onChunk("\n\n[System Error: Unable to establish quantum link with the AI model.]");
  }
};