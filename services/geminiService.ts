
import { GoogleGenAI, Modality } from "@google/genai";

const getApiKey = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set");
    }
    return apiKey;
};

// Function to generate initial set of wallpapers from a text prompt
export const generateInitialWallpapers = async (prompt: string): Promise<string[]> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });

    const fullPrompt = `A stunning, high-resolution, artistic phone wallpaper with a 9:16 aspect ratio. The vibe is: ${prompt}. Focus on aesthetic quality and composition.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: {
                numberOfImages: 4,
                outputMimeType: 'image/jpeg',
                aspectRatio: '9:16',
            },
        });
        
        return response.generatedImages.map(img => img.image.imageBytes);
    } catch (error) {
        console.error("Error generating initial wallpapers:", error);
        throw new Error("Failed to generate wallpapers. Please try a different prompt.");
    }
};

// Function to generate new wallpapers based on an existing image and a prompt
export const remixWallpaper = async (prompt: string, imageBase64: string): Promise<string[]> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });

    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
        },
    };

    const textPart = {
        text: `Remix this image with the following vibe: ${prompt}. Generate a new, unique wallpaper in a 9:16 aspect ratio, inspired by the original but distinct.`,
    };

    const generateSingleRemix = async (): Promise<string> => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [imagePart, textPart],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error('No image generated in remix');
    };

    try {
        const remixPromises = [
            generateSingleRemix(),
            generateSingleRemix(),
            generateSingleRemix(),
            generateSingleRemix(),
        ];
        
        const results = await Promise.all(remixPromises);
        return results;
    } catch (error) {
        console.error("Error remixing wallpaper:", error);
        throw new Error("Failed to remix the wallpaper. Please try again.");
    }
};
