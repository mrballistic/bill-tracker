# Technical Context: Financial Bill Tracker

## Technology Stack
- **Frontend Framework**: React 18 with Next.js 13+
- **Language**: TypeScript 5.x
- **UI Library**: Material UI (MUI) v5
- **State Management**: React Context API
- **Data Storage**: Local JSON files via Next.js API routes
- **Data Visualization**: Recharts library
- **Build Tool**: Next.js built-in build system
- **Development Environment**: npm for package management

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

## Technical Constraints
- **Browser Support**: Modern browsers only (Chrome, Firefox, Safari, Edge)
- **Storage Limitations**: Local storage constraints based on browser limits
- **No Backend Services**: All data processing happens client-side
- **Single User**: No authentication or user management required
- **Performance**: Needs to handle hundreds of bill entries efficiently

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
