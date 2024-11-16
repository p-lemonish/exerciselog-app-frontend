# ExerciseLog Frontend

The ExerciseLog Frontend is a React application designed to complement the ExerciseLog Backend. It provides a user-friendly interface for users to log, plan, and manage their exercise routines effectively.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure login and registration integrated with the backend API.
- **Exercise Planning**: Plan future exercises and workouts with customizable sets, reps, and weights.
- **Workout Management**: Start, edit, and delete planned workouts.
- **Exercise Logging**: Log completed workouts and track performance over time.
- **Profile Management**: Update personal information and change passwords securely.
- **Responsive Design**: Mobile-friendly interface with a bottom navigation bar for easy access.

## Technologies Used

- **React** (with Hooks)
- **React Router** for routing
- **Axios** for API requests
- **Material-UI (MUI)** for UI components and styling
- **Context API** for state management
- **Vite** for fast development and build tooling

## Prerequisites

- **Node.js** (version 14 or higher)
- **npm** or **yarn** package manager
- **Git** (for cloning the repository)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/exerciselog-frontend.git
   cd exerciselog-frontend
   ```

2. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

## Configuration

Create a `.env` file in the root directory of the project with the following content:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

- **VITE_API_BASE_URL**: The base URL of the backend API. Replace `http://localhost:8080/api` with the actual URL where your backend is running.

**Note**: Ensure that the `.env` file is included in your `.gitignore` to prevent sensitive information from being committed to version control.

## Running the Application

To start the development server, run:

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

To create an optimized production build, run:

```bash
npm run build
```

Or with yarn:

```bash
yarn build
```

The build output will be in the `dist` directory.

## Deployment

### Static Hosting

Since the frontend is a static React application, it can be hosted on platforms like:

- **Netlify**
- **Vercel**
- **GitHub Pages**
- **Render.com**

### Docker Deployment (Optional)

1. **Build Docker Image**

   ```bash
   docker build -t exerciselog-frontend .
   ```

2. **Run Docker Container**

   ```bash
   docker run -p 80:80 exerciselog-frontend
   ```

   The application will be available at `http://localhost`.

## Project Structure

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── services/
│   └── api.jsx
├── theme/
│   ├── theme.jsx
│   └── CustomThemeProvider.jsx
├── context/
│   └── AuthContext.jsx
├── components/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Layout/
│   │   ├── BottomNavBar.jsx
│   │   └── PageLayout.jsx
│   ├── PlannedExercises/
│   │   ├── AddPlannedExercise.jsx
│   │   └── PlannedExerciseList.jsx
│   ├── Workouts/
│   │   ├── AddWorkout.jsx
│   │   ├── StartWorkout.jsx
│   │   └── Workouts.jsx
│   ├── ExerciseLogs/
│   │   ├── ExerciseLogRow.jsx
│   │   └── ExerciseLogs.jsx
│   ├── Profile/
│   │   └── Profile.jsx
│   ├── NumberInput.jsx
│   ├── LoadingScreen.jsx
│   ├── PrivateRoute.jsx
│   └── ErrorHandler.jsx
```

### Key Components

- **App.jsx**: Main application component that sets up routing and context providers.
- **AuthContext.jsx**: Context for managing authentication state throughout the app.
- **api.jsx**: Axios instance configured with interceptors for handling API requests and JWT tokens.
- **CustomThemeProvider.jsx**: Provides theme customization using Material-UI, supporting light and dark modes.
- **PrivateRoute.jsx**: Higher-order component for protecting routes that require authentication.

### Components Overview

- **Auth**
  - **Login.jsx**: Component for user login.
  - **Register.jsx**: Component for user registration.
- **PlannedExercises**
  - **PlannedExerciseList.jsx**: Displays a list of planned exercises.
  - **AddPlannedExercise.jsx**: Form for adding or copying planned exercises.
- **Workouts**
  - **Workouts.jsx**: Lists planned workouts with options to start, edit, or delete.
  - **AddWorkout.jsx**: Form for adding or editing a workout.
  - **StartWorkout.jsx**: Interface for starting a workout and logging exercise data.
- **ExerciseLogs**
  - **ExerciseLogs.jsx**: Displays logs of completed exercises with filtering options.
  - **ExerciseLogRow.jsx**: Component for rendering individual exercise logs.
- **Profile**
  - **Profile.jsx**: User profile page with options to change password and logout.
- **Layout**
  - **PageLayout.jsx**: Common layout component for pages, handling headers and content area.
  - **BottomNavBar.jsx**: Bottom navigation bar for easy access to main sections.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**.
2. **Create a new branch**: `git checkout -b feature/your-feature-name`.
3. **Commit your changes**: `git commit -m 'Add some feature'`.
4. **Push to the branch**: `git push origin feature/your-feature-name`.
5. **Open a pull request**.

Please ensure your code follows the project's coding standards and conventions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note**: Ensure that all environment variables are correctly set and that sensitive information is not exposed. Always follow best practices for security, especially when dealing with authentication and state management.