# iOS Style Calculator

A sophisticated iOS-style calculator built with React and TypeScript. Features basic arithmetic operations, history tracking, and a responsive design.

[Live Demo](https://kaibuidl.github.io/Calculator/)

## ✨ Features

- **iOS Visual Style**: Faithfully recreates the classic iOS calculator design, including frosted glass effects and smooth animations.
- **Basic Operations**: Supports addition, subtraction, multiplication, division, percentages, and sign toggling.
- **History Tracking**: Automatically saves the last 50 calculation records, accessible via a sidebar.
- **Responsive Layout**: Optimized for both desktop and mobile devices.
- **Keyboard Support**: Supports physical keyboard input for numbers, operators, Enter (equals), and Backspace.
- **Persistent Storage**: History records are automatically saved to the browser's LocalStorage.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [GitHub Pages](https://pages.github.com/)

## 🚀 Local Development

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Steps to Run

1. **Clone/Download the project**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start the development server**
   ```bash
   npm run dev
   ```
4. **Access the project**
   Open `http://localhost:3000/Calculator/` in your browser.

## 📦 Deployment

This project is configured with GitHub Actions for automated deployment. Whenever code is pushed to the `main` branch, it will automatically build and deploy to GitHub Pages.

Configuration file: `.github/workflows/deploy.yml`

## 📝 License

MIT License
