
import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
    type: Type.OBJECT,
    properties: {
        recipeName: {
            type: Type.STRING,
            description: "A creative and appealing name for the recipe.",
        },
        description: {
            type: Type.STRING,
            description: "A short, enticing description of the dish, around 1-2 sentences.",
        },
        ingredients: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
                description: "An ingredient required for the recipe, including quantity. e.g., '2 cups all-purpose flour'."
            },
            description: "A list of all ingredients needed for the recipe based on what was provided and common pantry staples.",
        },
        instructions: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
                description: "A single, clear step in the cooking instructions."
            },
            description: "Step-by-step instructions on how to prepare the dish.",
        },
    },
    required: ["recipeName", "description", "ingredients", "instructions"],
};


export const generateRecipe = async (userIngredients: string): Promise<Recipe> => {
    try {
        const prompt = `You are a world-class chef who specializes in creating delicious and accessible recipes from a limited set of ingredients. Based on the following ingredients, create a complete recipe: ${userIngredients}. You can assume basic pantry staples like salt, pepper, basic spices, oil, and water are available. If the provided ingredients are insufficient for a cohesive recipe, be creative and suggest a very simple but tasty preparation. Your response must be in JSON format matching the provided schema.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: recipeSchema,
                temperature: 0.8,
            },
        });

        const jsonText = response.text.trim();
        const recipeData = JSON.parse(jsonText);

        return recipeData as Recipe;

    } catch (error) {
        console.error("Error generating recipe from Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate recipe: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the recipe.");
    }
};
