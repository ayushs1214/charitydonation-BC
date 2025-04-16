## Overview

ChainDonation is a Next.js application that facilitates secure and transparent donations to verified charities through blockchain technology. The platform provides a user-friendly interface for browsing charities, viewing donation addresses, and generating AI-powered trustworthiness reports.

## Core Features

- **Charity Listing**: Displays a list of verified charities with descriptions and donation addresses.
- **Donation Address Display**: Shows a QR code and a copyable address for each charity, enabling easy blockchain transactions.
- **Charity Verification and Storage**: Stores charity details (name, description, wallet address) in a JSON file for easy management.
- **AI-Powered Charity Monitoring**: Uses an AI tool to scan the web for information about listed charities and flags potential issues. Displays the latest report on the charity's profile.
- **Robust Error Handling**: Implements comprehensive error handling for blockchain transaction failures, invalid addresses, and API communication issues.
- **Dynamic and Responsive UI**: Provides a dynamic and responsive user interface that adapts to different screen sizes, ensuring a seamless experience on desktop and mobile platforms.

## Style Guidelines

- Primary color: Teal (#008080)
- Secondary color: Light Gray (#D3D3D3)
- Accent: Gold (#FFD700)
- Icons: Lucide React
- Layout: Grid-based layout system with consistent spacing
- Font: Clear and legible sans-serif font
- Dark mode: Option for users who prefer a darker interface

## Technologies Used

- **Next.js**: React framework for building performant web applications.
- **TypeScript**: Enhances code quality and type safety.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **ShadCN/UI**: Reusable components.
- **Genkit**: Extensible framework for building GenAI applications.
- **Lucide React**: Icons.
- **qrcode.react**: Library for generating QR codes.

## Setup Instructions

1.  **Clone the repository**:

    ```bash
    git clone [[repository-url]](https://github.com/ayushs1214/charitydonation-BC)
    cd ChainDonation
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Set up environment variables**:

    - Create a `.env` file in the root directory.
    - Add your Google GenAI API key:

      ```
      GOOGLE_GENAI_API_KEY=YOUR_API_KEY
      ```

4.  **Run the development server**:

    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Running Genkit in development

First, install the Genkit CLI:

```bash
npm install -g genkit-cli
```

Then, to run Genkit in development, use either:

```bash
npm run genkit:dev
```

This command starts Genkit in development mode and automatically monitors the code.

Or, run Genkit in watch mode:

```bash
npm run genkit:watch
```

5.  **Build the project**:

    ```bash
    npm run build
    ```

    This command creates an optimized build of the application in the `.next` directory.

6.  **Start the production server**:

    ```bash
    npm start
    ```

## Project Structure

```
ChainDonation/
├── .env                   # Environment variables
├── .gitignore              # Specifies intentionally untracked files that Git should ignore
├── .vscode/                # VS Code configuration files
├── components.json         # Configuration for Shadcn UI components
├── next.config.js          # Next.js configuration file
├── package.json            # Project dependencies and scripts
├── README.md               # Project documentation
├── src/
│   ├── ai/                # AI-related code (Genkit flows, prompts, schemas)
│   │   ├── ai-instance.ts  # Genkit AI instance setup
│   │   ├── dev.ts          # Development entry point for AI-related code
│   │   └── flows/          # Directory containing Genkit flows
│   │       └── monitor-charity-flow.ts  # AI flow for monitoring charity trustworthiness
│   ├── app/                # Next.js application directory
│   │   ├── globals.css     # Global CSS styles
│   │   ├── layout.tsx      # Root layout component
│   │   └── page.tsx        # Home page component
│   ├── components/        # Reusable React components
│   │   ├── ui/            # Shadcn UI components
│   │   ├── CharityDetails.tsx  # Component for displaying charity details
│   │   └── CharityList.tsx     # Component for listing charities
│   ├── data/               # Static data (charities.json)
│   │   └── charities.json  # JSON file containing charity information
│   ├── hooks/              # Custom React hooks
│   │   └── use-toast.ts    # Hook for managing toast notifications
│   ├── lib/                # Utility functions
│   │   └── utils.ts        # Utility functions
│   └── services/           # Services for external integrations (e.g., blockchain)
│       └── blockchain.ts   # Blockchain transaction service
├── tailwind.config.js      # Tailwind CSS configuration file
└── tsconfig.json           # TypeScript configuration file
```

## Folder Structure

*   **`.env`**: Contains environment-specific variables such as API keys.
*   **`.vscode`**: Holds workspace-specific settings for VS Code.
*   **`src/ai`**: Includes AI-related code like Genkit flows, prompts, and schemas.
*   **`src/app`**: Contains the core Next.js application components, including pages and layouts.
*   **`src/components`**: Houses reusable React components, further organized into UI components and specific feature components.
*   **`src/data`**: Contains static data, such as the `charities.json` file.
*   **`src/hooks`**: Includes custom React hooks for managing application state and functionality.
*   **`src/lib`**: Contains utility functions used throughout the application.
*   **`src/services`**: Includes services for external integrations, such as blockchain interactions.

## GenAI Setup

This application exclusively uses Genkit for GenAI related code. Genkit Flows wrap calls to LLMs.

To integrate GenAI-related functionality:

1.  Create a new Genkit Flow in the `src/ai/flows` directory.
2.  Include a documentation comment at the top of the file, explaining the exported interface of the file and the file's purpose.
3.  Include the `'use server';` directive at the beginning of the file, since it will be imported by Next.js React code.
4.  A global `var ai: Genkit;` object is pre-existing, which can be used to register things with Genkit using `ai.definePrompt(...)`, `ai.defineFlow(...)`, `ai.defineSchema(...)`, etc.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive commit messages.
4.  Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
