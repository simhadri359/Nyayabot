// Fix: Use GoogleGenAI for initialization
import { GoogleGenAI, Part } from "@google/genai";
import { Message } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

// Fix: Initialize GoogleGenAI with a named apiKey parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function* sendMessageStream(
    history: Message[],
    newMessage: { parts: Part[] },
    systemInstruction: string
): AsyncGenerator<string> {
    try {
        const chat = ai.chats.create({
          // Fix: Use the 'gemini-2.5-flash' model
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: systemInstruction,
          },
          history: history.map(msg => ({
              role: msg.role,
              parts: msg.parts,
          }))
        });

        const result = await chat.sendMessageStream({ message: newMessage.parts });
        
        for await (const chunk of result) {
            // Fix: Access text directly from the chunk
            if (chunk.text) {
                yield chunk.text;
            }
        }
    } catch (error) {
        console.error("Error in sendMessageStream:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get response from AI: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the AI.");
    }
}
