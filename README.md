# 🐾 Iris & Dahlia's Pet Center

A browser-based pet care simulation game built with React and Vite. Care for a shelter full of adorable animals before time runs out — feed them, play with them, keep them clean, and accept new arrivals to earn as many coins as possible!

## Gameplay

- **Setup** — Choose a countdown timer (1–15 minutes) and how many pets to start with (1–5).
- **Care for your pets** — Click a pet card to reveal actions:
  | Action | Cost | Effect |
  |--------|------|--------|
  | 🍼 Feed | 1 coin | +30 Hunger |
  | 🎾 Play | 2 coins | +20 Happiness, −15 Energy, −10 Cleanliness |
  | 🛁 Clean | 3 coins | Cleanliness → 100 |
- **Accept new pets** — Click "Accept New Pet" for a +20 coin deposit, adding a fresh animal to your shelter.
- **Sleeping pets** — When a pet's energy hits 10 or below it falls asleep automatically (earning you 30 coins). It wakes up once energy is fully restored.
- **Staying power** — Each pet has a "days remaining" counter. When it reaches 0 the pet leaves the shelter.
- **Game over** — When the countdown expires your total coin balance is your final score.

### Pet Types

20 different animals: Kitten, Puppy, Bunny, Chick, Hamster, Panda, Snake, Lizard, Tiger, Lion, Bear, Unicorn, Fox, Frog, Turtle, T-Rex, Brontosaurus, Sloth, Otter, and Hedgehog.

## Tech Stack

| Tool | Purpose |
|------|---------|
| [React 18](https://react.dev/) | UI & state management |
| [Vite](https://vitejs.dev/) | Dev server & bundler |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Lucide React](https://lucide.dev/) | Icons |

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

## Project Structure

```
src/
├── App.jsx                  # Root component
├── main.jsx                 # React entry point
├── index.css                # Global styles
└── components/
    ├── PetShop.jsx          # Main game component (state, game loop, UI)
    └── PetShop.css          # Game styles
```
