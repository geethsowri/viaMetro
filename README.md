# 🚇 viaMetro.exe

**viaMetro** is a high-performance, neo-brutalist styled route finding application for the **Hyderabad Metro Rail** network. It provides users with the optimal path between any two stations, calculates fares, and estimates travel time using an efficient graph-based algorithm.

![viaMetro UI](https://img.shields.io/badge/Design-Neo--Brutalist-yellow)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%2B%20Vite-blue)
![Algorithm](https://img.shields.io/badge/Algorithm-BFS-green)

---

## 🚀 Key Features

- **Optimal Pathfinding**: Utilizes a Breadth-First Search (BFS) algorithm to calculate the shortest route across 120+ station segments.
- **Smart Fare Estimation**: Real-time fare calculation based on the official Hyderabad Metro fare chart, with a basic fallback for unknown segments.
- **Interchange Alerts**: Automatically identifies station changes (e.g., Ameerpet, MGBS) and notifies users of line switches.
- **Dark Mode Support**: Seamlessly toggle between light and dark themes with a persistent "OS-style" interface.
- **Fast Autocomplete**: Search through stations instantly with a filtered fuzzy-search input.
- **Optimized Performance**: Production bundle size reduced by **~30%** (~260KB) for sub-second loading.

## 🛠️ Tech Stack

- **Core**: [React](https://react.dev/)
- **Bundler**: [Vite](https://vitejs.dev/) (Optimized for HMR and size)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (Custom Neo-Brutalist Design System)
- **State Management**: React Hooks (`useState`, `useEffect`, `useRef`)

## 🏗️ Project Structure

```text
src/
├── components/          # Reusable UI components (Autocomplete, Results)
├── data/                # Metro network graph and fare JSON data
├── utils/               # BFS algorithm and route finder helpers
├── App.jsx              # Main application entry and layout
└── index.css            # Custom neo-brutalist theme and design tokens
```

## ⚙️ Development & Build

### Installation
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## 🎨 Design Philosophy

The application follows a **Neo-Brutalist** aesthetic, characterized by:
- High contrast black borders (`--border-thick: 4px`)
- Hard shadows (`box-shadow: 6px 6px 0px #000`)
- Vibrant accent colors (#ffde00)
- Monospaced typography for a retro "executable" feel

---

*Developed as a modern utility for the Hyderabad Metro commuters.*
