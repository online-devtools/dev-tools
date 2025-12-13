# GEMINI.md

## Project Overview

This is a web application that provides a collection of developer tools. It is built with [Next.js](https://nextjs.org/) and [TypeScript](https://www.typescriptlang.org/). The application is designed to be a one-stop shop for developers, offering a variety of tools for encoding/decoding, security, data formatting, and more. All the tools are client-side, which means that no data is sent to the server, ensuring user privacy.

The project is well-structured, with a clear separation of concerns. The `app` directory contains the pages for each tool, the `components` directory contains the React components used throughout the application, and the `utils` directory contains utility functions. The application is styled with [Tailwind CSS](https://tailwindcss.com/).

## Building and Running

To build and run the project, you need to have Node.js (version 18.0 or higher) and npm (or yarn) installed.

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.

3.  **Build for production:**

    ```bash
    npm run build
    ```

4.  **Run the production server:**

    ```bash
    npm run start
    ```

## Development Conventions

*   **Linting:** The project uses ESLint for linting. You can run the linter with the following command:

    ```bash
    npm run lint
    ```

*   **Testing:** The project uses Vitest for testing. You can run the tests with the following command:

    ```bash
    npm run test
    ```

*   **Styling:** The project uses Tailwind CSS for styling. The configuration is in the `tailwind.config.ts` file.

*   **Components:** The project uses React components, which are located in the `components` directory. Each tool has its own component, which is then used in the corresponding page in the `app` directory.

*   **Routing:** The project uses the Next.js App Router. Each tool has its own page in the `app` directory.

*   **Internationalization:** The project uses a custom solution for internationalization, which is located in the `contexts/LanguageContext.tsx` file. The translations for both Korean and English are stored in the same file. The `LanguageProvider` component detects the browser language and sets the initial language. It also provides a `t` function for translating keys into the current language.
