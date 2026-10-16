# IsabiCasta

A lightweight, open-source web app inspired by the biblical practice of casting lots.  
It helps people make decisions when they are indecisive by providing simple, random selection tools.

**IsabiCasta works entirely in your browser.** No accounts, no backend, no analytics, no data leaves your device.

## Features

- **Onboarding** – A short, swipeable introduction with Scripture references (Jonah 1:7, Proverbs 16:33, Leviticus 16:8, Acts 1:26). Completion is remembered locally.
- **Flip a Coin** – Fair heads/tails with a smooth animation. Uses the browser’s cryptographic random number generator.
- **Cast Lots** – Enter multiple options (one per line). The app randomly selects one and displays it clearly.
- **Local History** – Recent activity is stored in `localStorage`. You can view or clear it at any time.
- **Privacy-first** – No network requests for decisions. Everything stays on your device.
- **Mobile-first** – Responsive, accessible, calm visual design.

> The app presents the biblical background respectfully and does **not** claim that a random result necessarily reveals God’s will.

## Tech Stack

- Vue 3 (Composition API)
- Vite
- Pure CSS (no UI framework)
- `crypto.getRandomValues` for unbiased randomness

## Requirements

- Node.js 18+ (recommended)
- npm or compatible package manager

## Setup

```bash
# Clone the repository (or download the source)
cd isabi-casta

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build for Production

```bash
npm run build
```

The static files will be generated in the `dist/` folder. You can deploy this folder to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, nginx, etc.).

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
isabi-casta/
├── public/           # Static assets (favicon, etc.)
├── src/
│   ├── components/
│   │   ├── Onboarding.vue
│   │   ├── MainView.vue
│   │   ├── CoinFlip.vue
│   │   ├── CastLots.vue
│   │   └── HistoryPanel.vue
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
├── vite.config.js
├── LICENSE
└── README.md
```

## License

MIT License – see [LICENSE](LICENSE).

## Contributing

Contributions are welcome. Please keep the app lightweight, privacy-respecting, and free of unnecessary dependencies.
