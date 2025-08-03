# Cookwise App Blueprint

## Overview

Cookwise is an AI-powered recipe assistant built to help beginner and experienced cooks alike. It provides personalized recipes based on a user's culinary profile, allows for on-demand recipe generation from user prompts, and offers a "Surprise Me" feature for culinary discovery.

## Core Features

- **User Profiling**: An interactive onboarding quiz captures the user's food preferences, allergies, dietary goals, cooking level, and time availability.
- **AI Recipe Generation**: Utilizes Genkit with Google's `gemini-2.5-flash` model to generate personalized recipes. It can operate in three modes:
    1.  **Profile-Based**: Creates a recipe based on the user's saved preferences.
    2.  **Prompt-Based**: Takes a specific user request (e.g., "a quick pasta dish") and tailors it to the user's profile (allergies, etc.).
    3.  **Surprise Me**: Generates a recipe from a different cuisine to encourage discovery, while still adhering to critical allergies and restrictions.
- **Recipe Display**: Presents recipes in a clean, structured card format, with ingredients, instructions, and nutritional information clearly separated. Markdown rendering is supported for better readability.
- **Recipe Saving**: Users can save their favorite recipes to a personal collection, which is stored in the browser's `localStorage`.
- **Preference Settings**: A dedicated settings page allows users to update their culinary profile at any time.

## Tech Stack

- **Framework**: Next.js (utilizing the App Router)
- **Language**: TypeScript
- **UI Components**: Radix UI primitives via ShadCN UI for a consistent and accessible component library.
- **Styling**: Tailwind CSS for utility-first styling.
- **AI/Generative**: Genkit, with Google Gemini (`gemini-2.5-flash`) as the generative model.
- **Schema Validation**: Zod is used to define the structure for AI inputs and outputs.
- **Forms**: React Hook Form manages form state and validation for onboarding and settings.
- **Icons**: `lucide-react` for a clean and consistent icon set.

## Design System

### Color Palette

The application's theme is defined with HSL CSS variables in `src/app/globals.css`. The palette is based on a clean, green-toned theme.

- **Primary**: `hsl(142 71% 45%)` - A vibrant green used for primary buttons, links, and important UI elements.
- **Background**: `hsl(150 15% 97%)` - A very light, off-white with a hint of green, used for the main page background.
- **Accent**: `hsl(150 30% 91%)` - A subtle, light green used for hover states and secondary UI elements.
- **Card**: `hsl(150 15% 100%)` - Pure white, providing a clean backdrop for content within cards.
- **Text (Foreground)**: `hsl(224 71.4% 4.1%)` - A dark, high-contrast color for body text and headlines.
- **Borders**: `hsl(150 15% 90%)` - A light gray used for element borders and separators.

### Typography

- **Headlines**: 'Playfair Display' (serif) is used for headings to add a touch of elegance.
- **Body Text**: 'PT Sans' (sans-serif) is used for all body copy, ensuring clarity and readability.
