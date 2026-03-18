# Architecture Guidelines

This document outlines the standard architecture of the Arnold application. Following these guidelines ensures maintainability, scalability, and code clarity.

## 1. Directory Structure

```text
arnold/
├── src/
│   ├── components/       # Reusable UI components (Buttons, Inputs, Cards).
│   ├── screens/          # Application views mapped directly to navigation routes.
│   ├── navigation/       # Routing and navigation stacks (React Navigation).
│   ├── services/         # API, Supabase, and third-party interactions. 
│   ├── hooks/            # Custom React hooks containing abstracted logic.
│   ├── utils/            # Helper functions, formatters, and constants.
│   ├── store/            # State management (Context API, Zustand, Redux).
│   ├── types/            # Global TypeScript definitions and interfaces.
│   └── constants/        # Shared hardcoded configurations (e.g. Colors.ts).
├── docs/                 # Application rules, schemas, and UI guidelines.
├── assets/               # Local images, fonts.
├── App.tsx               # Entry point containing app providers.
```

## 2. Principles

### Container-Presenter Pattern
For complex screens, consider dividing components into a 'Container' (handles data fetching, business logic, state) and a 'Presenter' (receives props and only renders UI).

### Custom Hooks
Business logic, repetitive component data fetching, and state manipulations should live within `hooks/` to promote DRY code and separate logic from UI.

### Services Layer
Do not place direct database interactions or HTTP requests inside components.
Create specific files inside `services/` (like `supabase.ts`, `authService.ts`, `workoutService.ts`) to manage interaction with external APIs.

### Typing
All components MUST type their incoming `props`. Provide `types/` for data models received from API and database structures.

## 3. Global State
Avoid excessive global state if not necessary. Use `Context API` or simple `Zustand` stores for app-wide contexts like Authentication State, Theming, or User Preferences.
