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
├── src/
│   ├── app/          # App router components  
│   │   └── api/      # API routes for data persistence
│   ├── components/   # Reusable UI components
│   │   ├── analytics/# Chart and analytics components
│   │   ├── bills/    # Bill form and table components
│   │   └── layout/   # Navigation and layout components
│   ├── contexts/     # React Context providers
│   ├── lib/          # Utility functions
│   ├── models/       # TypeScript interfaces
│   └── styles/       # Global styling
├── public/           # Static assets
└── data/             # Local data storage (JSON)
```

## 👨‍💻 Development

The application uses Next.js API routes to handle data persistence:

- 📄 Bills are stored in `data/bills.json`
- 🔄 All data is processed client-side with no external backend dependencies
- 🧩 State is managed with React Context API for simplicity

## 📄 License

[MIT](LICENSE.md)
