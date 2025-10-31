import { GoogleGenAI } from "@google/genai";
import { ContentType, Tone, Length } from '../types';

// IMPORTANT: This check is for client-side safety, but the key is expected to be provided by the environment.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, you might show a message to the user or disable functionality.
  // For this example, we throw an error during development.
  console.warn("API key not found. Please ensure the API_KEY environment variable is set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = 'gemini-2.5-flash';

export const generateContent = async (
  contentType: ContentType,
  prompt: string,
  tone: Tone,
  length: Length
): Promise<string> => {
  const fullPrompt = `
    You are an expert content creator and marketing professional.
    Your task is to generate a high-quality piece of content based on the following specifications.

    **Content Type:** ${contentType}
    **Desired Tone:** ${tone}
    **Desired Length:** ${length}
    **Core Topic/Prompt:** "${prompt}"

    Please generate the content now. Provide only the requested content, without any extra commentary, introduction, or sign-off.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    if (error instanceof Error) {
        return `An error occurred while generating content: ${error.message}. This could be due to an invalid API key or network issues.`;
    }
    return "An unknown error occurred while generating content.";
  }
};
