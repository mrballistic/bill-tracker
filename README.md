# 💰 Financial Bill Tracker

A personal financial bill tracker application designed to help individuals manage their bills and visualize spending patterns. This single-user web application provides a clean interface for tracking financial obligations and gaining insights through visual analytics.

## 🌐 Live Demo

Access the live application at: [https://mrballistic.github.io/bill-tracker](https://mrballistic.github.io/bill-tracker)

The application is deployed on GitHub Pages and uses localStorage for data persistence in the deployed environment.

## ✨ Features

- **💵 Bill Management**
  - ➕ Add, edit, view, and delete bills
  - ✅ Track payment status (paid/unpaid)
  - 🏷️ Categorize bills for better organization
  - 📝 Add notes for additional context

- **📊 Financial Analytics**
  - 🍩 Visual breakdown of spending by category
  - 📈 Monthly spending trends
  - 💲 Payment status tracking
  - 🔍 Customized financial insights

- **🎨 User Experience**
  - ✨ Clean, intuitive Material UI interface
  - 📱 Responsive design for desktop use
  - 🚀 Minimal setup required
  - 🔒 Privacy-focused (all data stored locally)

## 🛠️ Technology Stack

- **🔷 Frontend**: React 18 with Next.js 13+
- **📘 Language**: TypeScript 5.x
- **🎭 UI Library**: Material UI (MUI) v7
- **🧠 State Management**: React Context API
- **💾 Data Storage**: Local JSON files and localStorage for production
- **📊 Data Visualization**: Nivo (@nivo/pie, @nivo/bar) and Recharts libraries
- **🚀 Deployment**: GitHub Pages via GitHub Actions
- **🔍 Code Quality**: ESLint with TypeScript and React plugins
- **🎨 Design Standards**: Comprehensive UI/UX design principles

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js 18.17 or later
- npm or yarn

### ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bill-tracker.git
cd bill-tracker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to use the application.

## 📁 Project Structure

```
bill-tracker/
├── public/                # Static assets for browser (favicons, manifest, demo data)
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── site.webmanifest
│   ├── web-app-manifest-192x192.png
│   ├── web-app-manifest-512x512.png
│   └── data/
│       └── bills.json    # Demo/static data file (browser fetchable)
├── src/
│   ├── app/              # Next.js app directory (layout, pages, analytics)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── analytics/
│   │       └── page.tsx
│   ├── components/       # Reusable UI components (analytics, bills, layout, theme)
│   ├── contexts/         # React Context providers (BillContext)
│   ├── lib/              # Utility functions (billUtils, staticData)
│   ├── models/           # TypeScript interfaces (Bill)
│   └── __tests__/        # Unit and integration tests
├── memory-bank/          # Project documentation and context (see Memory Bank docs)
│   ├── activeContext.md
│   ├── progress.md
│   ├── systemPatterns.md
│   ├── techContext.md
│   ├── productContext.md
│   ├── projectbrief.md
│   └── ...
├── coverage/             # Automated test coverage reports
├── data/                 # (Legacy/unused) - not used for runtime data
├── next.config.ts        # Next.js configuration (static export, basePath)
├── package.json
├── README.md
└── ...
```

- All runtime/static assets (favicons, manifest, demo data) are in `public/`.
- Static data for demo/first load is fetched from `public/data/bills.json`.
- All user data is persisted in `localStorage`.
- The `src/` directory contains all app, component, context, utility, and test code.
- The `memory-bank/` folder contains all project documentation and context files.
- The `coverage/` folder contains automated test coverage reports.

## Static Data Loading Strategy

- On first load, the app checks `localStorage` for saved bills. If none are found or the array is empty, it fetches demo data from `/data/bills.json` (located in the `public` folder for browser access).
- All user changes are persisted to `localStorage`.
- This approach ensures compatibility with static exports (e.g., GitHub Pages) and provides a seamless demo experience.
- The fetch path respects the `basePath` (see `next.config.ts`) for static hosting.

## Static Export Compatibility

- The app is fully compatible with static export (`next export`) and can be deployed to GitHub Pages or any static host.
- Demo data is always available via `/data/bills.json` if no user data exists.

## Test Coverage & Reliability

- The project has strong automated test coverage for core logic, context, and UI components.
- Tests cover data loading, persistence, and user interactions.
- See the `coverage/` directory for detailed reports.

## 👨‍💻 Development

The application uses Next.js API routes to handle data persistence:

- 📄 Bills are stored in `data/bills.json`
- 🔄 All data is processed client-side with no external backend dependencies
- 🧩 State is managed with React Context API for simplicity

## 🎨 Design & Code Quality

### Design Principles
The project follows established UI/UX design principles:

- **Visual Hierarchy**: Clear organization of elements to guide user attention
- **Consistent UI**: Unified styling throughout the application
- **Accessibility**: Following WCAG guidelines for better usability
- **Responsive Design**: Adapts to different desktop screen sizes
- **Performance**: Optimized loading and rendering for smooth experience

### Code Quality Standards
The codebase is maintained with strict quality standards:

- **TypeScript**: Strict type-checking for improved code reliability
- **ESLint**: Configured with TypeScript and React-specific rules
- **Component Patterns**: Following React best practices for component organization
- **Semantic HTML**: Using appropriate HTML elements for better accessibility
- **Consistent Styling**: Structured MUI theming for visual consistency

## 📄 License

[MIT](LICENSE.md)
