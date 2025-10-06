# AI Recipe Generator

This application generates creative recipes based on ingredients you have on hand, powered by the Google Gemini API. It's built with React, TypeScript, and styled with Tailwind CSS.

![Screenshot of the AI Recipe Generator app interface, showing an input area for ingredients and a generated recipe card.](https://i.imgur.com/example.png) <!-- It's good practice to add a screenshot -->

## ✨ Features

- **Dynamic Recipe Generation**: Leverages the Gemini API to create unique recipes from a user-provided list of ingredients.
- **Structured JSON Output**: Uses a response schema to ensure the API returns data in a consistent and predictable format.
- **Responsive Design**: The interface is fully responsive and works beautifully on devices of all sizes, from mobile phones to desktops.
- **User-Friendly Interface**: A clean, intuitive UI with clear instructions, loading indicators, and error handling to provide a smooth user experience.
- **Modern Tech Stack**: Built with React 18 and TypeScript for a robust and type-safe codebase.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) (with hooks)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Model**: [Google Gemini API](https://ai.google.dev/)

---

## 🚀 Development Walkthrough

This project was built incrementally, focusing on a clean separation of concerns. Here is a step-by-step breakdown of its development.

### Step 1: Project Scaffolding & Setup

The foundation of the project was established with an `index.html` file. This file serves as the entry point for the browser.

- **`index.html`**:
    - Includes the Tailwind CSS CDN for rapid and utility-first styling.
    - Defines a root `<div>` with the ID `root`, which is the mounting point for our React application.
    - Sets up an `importmap` to manage modern ES module imports directly in the browser, simplifying dependency management for React and the Gemini SDK.
    - Links to `index.tsx` as a module to kickstart the application.

- **`index.tsx`**:
    - Uses `ReactDOM.createRoot` to initialize the React 18 concurrent renderer.
    - Renders the main `App` component inside `<React.StrictMode>` to catch potential problems.

- **`metadata.json`**:
    - A simple JSON file to store basic information about the application, like its name and description.

### Step 2: Core Application Structure & State

The main application logic resides in `App.tsx`.

- **`App.tsx`**:
    - This functional component uses React hooks (`useState`, `useCallback`) to manage the application's state.
    - **State Variables**:
        - `ingredients` (string): Stores the user's input from the textarea.
        - `recipe` (Recipe | null): Holds the generated recipe object returned from the API.
        - `isLoading` (boolean): Tracks the loading state during the API call to show/hide spinners and disable buttons.
        - `error` (string | null): Captures any errors that occur during the process.
        - `hasGenerated` (boolean): A flag to track if the user has attempted to generate a recipe at least once.

### Step 3: Building the UI Components

To create a modular and maintainable UI, the interface was broken down into several reusable components.

- **`Header.tsx`**: A stateless component that displays the application title and tagline.
- **`Footer.tsx`**: A simple component for the page footer, displaying copyright info.
- **`LoadingIcon.tsx`**: An SVG-based spinner that provides visual feedback during asynchronous operations.
- **`RecipeCard.tsx`**: A presentational component responsible for displaying the generated recipe in a structured and visually appealing card layout. It takes a `recipe` object as a prop.

The main UI in `App.tsx` brings these components together and includes the form for user input, consisting of a `<textarea>` and a submit button. Conditional rendering is used extensively to display:
1. The initial form.
2. The loading state.
3. An error message, if any.
4. The final `RecipeCard` component.

### Step 4: Integrating the Gemini API Service

All interaction with the Gemini API is encapsulated within a dedicated service file to separate concerns.

- **`services/geminiService.ts`**:
    - **Initialization**: It initializes the `GoogleGenAI` client using the `API_KEY`.
    - **Schema Definition**: A `recipeSchema` is defined. This is a crucial step that instructs the Gemini model to return a JSON object with a specific structure (`recipeName`, `description`, `ingredients`, `instructions`). This eliminates the need for fragile string parsing and ensures type safety.
    - **`generateRecipe` Function**:
        - This `async` function takes the user's ingredients as input.
        - It constructs a detailed prompt, instructing the AI to act as a world-class chef and to use the provided ingredients.
        - It calls `ai.models.generateContent` with the prompt, model name (`gemini-2.5-flash`), and the configuration object containing `responseMimeType: "application/json"` and the `responseSchema`.
        - It parses the JSON response and returns it, strongly typed as a `Recipe` object (defined in `types.ts`).
        - Includes robust `try...catch` blocks for error handling.

### Step 5: Connecting UI to Logic

The final step was to link the user's actions in the UI to the Gemini service.

- In `App.tsx`, the `handleGenerateRecipe` function is the orchestrator.
- It's wrapped in `useCallback` for performance optimization, preventing re-creation on every render.
- **Execution Flow**:
    1. Prevents the default form submission.
    2. Performs basic validation to ensure the ingredients field is not empty.
    3. Sets `isLoading` to `true` and clears any previous recipes or errors.
    4. Calls the `generateRecipe` function from `geminiService.ts`.
    5. On success, it updates the `recipe` state with the result.
    6. On failure, it catches the error and updates the `error` state.
    7. In the `finally` block, it sets `isLoading` back to `false`, re-enabling the UI.

This structured approach results in a clean, maintainable, and efficient application that provides an excellent user experience.
