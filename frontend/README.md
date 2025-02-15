# Getting Started with Create React App

## Prerequisites

1. Install Node.js
   - Download and install Node.js from [nodejs.org](https://nodejs.org/)
   - Recommended version: 16.x or later
   - Verify installation by running:
     ```bash
     node --version
     npm --version
     ```

## Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Project Structure

```
frontend/
├── public/              # Static files and index.html
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── ui/        # Basic UI components (buttons, inputs, etc.)
│   │   └── shared/    # Shared complex components
│   ├── pages/         # Page components and routes
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and configurations
│   ├── api/           # API integration and services
│   ├── types/         # TypeScript type definitions
│   ├── context/       # React context providers
│   ├── styles/        # Global styles and Tailwind configurations
│   └── App.tsx        # Root application component
├── package.json       # Project dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

### Key Directories

- **components/**: Contains all reusable UI components
  - **ui/**: Basic UI elements built with shadcn/ui
  - **shared/**: Complex components used across multiple pages

- **pages/**: Page components and routing logic

- **hooks/**: Custom React hooks for shared functionality

- **lib/**: Utility functions, constants, and configurations

- **api/**: API integration layer with axios setup

- **context/**: Global state management using React Context

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


