# System Patterns: Financial Bill Tracker

## Architecture Overview
The Financial Bill Tracker follows a simple, component-based architecture using React and Next.js. The application uses a client-side approach with local data persistence.

```
┌─────────────────────────────────────┐
│             Next.js App             │
│  ┌───────────────┐ ┌──────────────┐ │
│  │  Bill Entry   │ │  Analytics   │ │
│  │    Page       │ │    Page      │ │
│  └───────┬───────┘ └──────┬───────┘ │
│          │                │         │
│  ┌───────┴────────────────┴───────┐ │
│  │        Context API            │ │
│  │     (State Management)        │ │
│  └───────────────┬───────────────┘ │
│                  │                 │
│  ┌───────────────┴───────────────┐ │
│  │       Local Storage API       │ │
│  │         (JSON Files)          │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Key Design Patterns

### Component Pattern
- **Container/Presentational Split**: Logic components separate from UI components
- **Composition**: Building complex UIs from smaller, reusable components
- **Component Hierarchy**: Organized structure flowing down from page components

### Data Flow Pattern
- **Context API**: Central state management for application data
- **Unidirectional Data Flow**: Changes flow down through component hierarchy
- **Local Storage Integration**: Persistence layer using browser's storage API

### Form Management
- **Controlled Components**: Form fields tied directly to React state
- **Validation System**: Client-side validation before data submission
- **Feedback Loop**: Immediate user feedback on form interactions

## Key Component Relationships

```
┌───────────────────┐      ┌───────────────────┐
│    BillContext    │◄────►│   LocalStorage    │
└────────┬──────────┘      └───────────────────┘
         │
         ▼
┌───────────────────┐      ┌───────────────────┐
│     BillForm      │─────►│     BillTable     │
└───────────────────┘      └───────────────────┘
         │                          │
         ▼                          ▼
┌───────────────────┐      ┌───────────────────┐
│  Form Components  │      │ Table Components  │
└───────────────────┘      └───────────────────┘


┌───────────────────┐      ┌───────────────────┐
│    BillContext    │─────►│  Chart Components │
└───────────────────┘      └───────────────────┘
                                    │
                                    ▼
                           ┌───────────────────┐
                           │    Analytics      │
                           │    Dashboard      │
                           └───────────────────┘
```

## Data Loading & Persistence
- On app load, check `localStorage` for bills
- If `localStorage` is empty or blank, fetch demo data from `/data/bills.json` (in `public/`)
- All user changes are saved to `localStorage`
- Fetch path uses `basePath` for static hosting (see `next.config.ts`)

## Static Export Compatibility
- App is designed for static export (e.g., GitHub Pages)
- Demo data is always available for first-time/static users

## Testing
- Strong test coverage for data loading, persistence, and UI
- Coverage reports available in `coverage/`
