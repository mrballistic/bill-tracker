# Active Context: Financial Bill Tracker

## Current Focus
The project is in the initial setup and planning phase. We have established the technical brief and are now creating the foundational documentation in the memory bank.

## Recent Changes
- Created the project structure based on Next.js
- Defined the technical requirements and stack in the tech-brief.md
- Established the memory bank documentation system

## Next Steps
1. **Project Setup**
   - Initialize the Next.js project with TypeScript
   - Install required dependencies (MUI, Recharts, UUID)
   - Configure ESLint and Prettier

2. **Core Structure Development**
   - Create basic page layouts for bill entry and analytics
   - Implement the navigation between pages
   - Set up the data model and Context API structure

3. **Feature Implementation**
   - Develop the bill entry form and validation
   - Create the bills table with CRUD operations
   - Implement the local storage persistence layer
   - Build the analytics dashboard components

## Active Decisions
- **Storage Approach**: Using JSON files via Next.js API routes instead of browser localStorage for better data persistence and size limitations
- **UI Design**: Following Material Design principles with a clean, minimal interface
- **State Management**: Using Context API instead of Redux for simplicity, given the application's scope
- **Analytics Focus**: Determining which visualizations will provide the most value (monthly trends, category breakdowns, paid vs. unpaid)
