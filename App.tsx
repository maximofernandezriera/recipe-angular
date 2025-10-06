
import React, { useState, useCallback } from 'react';
import type { Recipe } from './types';
import { generateRecipe } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import RecipeCard from './components/RecipeCard';
import LoadingIcon from './components/LoadingIcon';

const App: React.FC = () => {
    const [ingredients, setIngredients] = useState<string>('');
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasGenerated, setHasGenerated] = useState<boolean>(false);

    const handleGenerateRecipe = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ingredients.trim()) {
            setError("Please list the ingredients you have.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setRecipe(null);
        setHasGenerated(true);

        try {
            const result = await generateRecipe(ingredients);
            setRecipe(result);
        } catch (err) {
            const errorMessage = err instanceof Error 
                ? `An error occurred: ${err.message}`
                : "An unknown error occurred. Please try again.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [ingredients]);
    
    return (
        <div className="flex flex-col min-h-screen bg-black bg-opacity-50 font-sans text-white">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
                <div className="w-full max-w-2xl text-center backdrop-blur-sm bg-white/10 p-6 rounded-2xl shadow-lg border border-white/20">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-100">What's in your kitchen?</h2>
                    <p className="text-gray-300 mb-6">List your ingredients below, separated by commas, and let AI create a unique recipe for you!</p>
                    
                    <form onSubmit={handleGenerateRecipe} className="flex flex-col gap-4">
                        <textarea
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="e.g., chicken breast, tomatoes, rice, onion, garlic"
                            className="w-full p-4 rounded-lg bg-gray-800 bg-opacity-70 border-2 border-gray-600 focus:border-green-400 focus:ring-green-400 text-white transition-all duration-300 h-32 resize-none placeholder-gray-400"
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg text-lg transition-transform transform hover:scale-105 duration-300 flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <LoadingIcon />
                                    Generating...
                                </>
                            ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V7.618a1 1 0 011.447-.894L9 9m0 11l6-3m-6 3V9m6 8l5.447 2.724A1 1 0 0021 16.382V7.618a1 1 0 00-.553-.894L15 4m-6 5v8m6-8v8m0-8L9 9" /></svg>
                                  Generate Recipe
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="w-full max-w-4xl mt-10">
                    {isLoading && (
                        <div className="text-center p-6 backdrop-blur-sm bg-white/10 rounded-2xl">
                            <p className="text-lg animate-pulse">Our AI chef is thinking... 🍳</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500 bg-opacity-80 text-white p-4 rounded-lg text-center shadow-lg">
                             <p className="font-bold">Oops!</p>
                             <p>{error}</p>
                        </div>
                    )}

                    {recipe && <RecipeCard recipe={recipe} />}

                    {!isLoading && !recipe && !error && hasGenerated && (
                        <div className="text-center p-6 backdrop-blur-sm bg-white/10 rounded-2xl">
                             <p className="text-lg">Something went wrong, but no error was caught. Please try again.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;
