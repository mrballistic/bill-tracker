# Technical Context: Financial Bill Tracker

## Technology Stack
- **Frontend Framework**: React 18 with Next.js 13+ (static export mode supported)
- **Language**: TypeScript 5.x
- **UI Library**: Material UI (MUI) v7
- **State Management**: React Context API
- **Data Storage**: Local JSON files via Next.js API routes
- **Data Visualization**: Nivo (@nivo/pie, @nivo/bar) and Recharts libraries
- **Build Tool**: Next.js built-in build system
- **Development Environment**: npm for package management
- **Linting**: ESLint with TypeScript and React plugin rules
- **Design Standards**: Comprehensive UI/UX design principles documented

## Development Setup
```bash
# Development server
npm run dev

# Production build
npm run build

# Run production build
npm start

# Run linting
npm run lint
```
- Demo data file: `public/data/bills.json` (browser-accessible for static hosting)
- Data loading logic in `src/contexts/BillContext.tsx`
- Uses `localStorage` for persistence
- Fetch path respects `basePath` for static hosting

## Technical Constraints
- **Browser Support**: Modern browsers only (Chrome, Firefox, Safari, Edge)
- **Storage Limitations**: Local storage constraints based on browser limits
- **No Backend Services**: All data processing happens client-side
- **Single User**: No authentication or user management required
- **Performance**: Needs to handle hundreds of bill entries efficiently
- Must work with static export (no server-side code at runtime)
- Demo data must be accessible via browser fetch

## Dependencies
### Core Dependencies
- `react`, `react-dom`: UI library
- `next`: Framework for server-rendered React applications
- `typescript`: Type checking and developer experience

### UI Dependencies
- `@mui/material`: UI component library
- `@mui/icons-material`: Icon set
- `@emotion/react`, `@emotion/styled`: Styling system for MUI

### Functionality Dependencies
- `recharts`: For creating data visualizations
- `uuid`: For generating unique IDs for bills
- `date-fns`: For date manipulation and formatting

### Development Dependencies
- `eslint`: Code quality and consistency
- `prettier`: Code formatting
- `@types/*`: TypeScript type definitions

## Code Quality and Standards
### Linting Configuration
- **ESLint**: Configured with TypeScript and React-specific rules
  - TypeScript rules focus on type safety and best practices
  - React rules enforce component patterns and prevent common pitfalls
  - Core JavaScript rules catch potential errors and enforce consistent style

### Design Principles
- **Visual Design**: Clean visual hierarchy, consistent styling, and proper typography
- **Interaction Design**: Intuitive navigation, familiar UI components, clear calls-to-action
- **Accessibility**: Following WCAG guidelines for web accessibility
- **Responsive Design**: Desktop-focused layouts with consistent component spacing
- **Performance**: Optimized assets and efficient rendering

## Project Structure
```
bill-tracker/
├── src/
│   ├── app/          # App router components  
│   ├── components/   # Reusable UI components
│   ├── contexts/     # React Context providers
│   ├── lib/          # Utility functions
│   ├── models/       # TypeScript interfaces
│   ├── pages/        # Page components/routes
│   └── styles/       # Global styling
├── public/           # Static files
└── package.json      # Project configuration
```

## Test Coverage
- Strong automated test coverage for logic and UI
- Coverage reports in `coverage/`
