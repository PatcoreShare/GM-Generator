# Warhammer Random Table Generator

A full-stack application for managing and rolling on random tables for Warhammer sandbox games.

## Features

- **Weighted Rolling**: Assign probabilities to outcomes.
- **Grimdark UI**: Themed aesthetic for immersive gaming.
- **Persistence**: Data saved to local JSON storage.
- **Import/Export**: Share your tables via JSON files.
- **Responsive**: Works on desktop and mobile.

## Quick Start (Docker)

To run the application using Docker Compose:

```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`.

## Manual Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Data Structure

Generators are stored in `data/generators.json`. You can also use the Import/Export feature in the UI to manage your tables.

## Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, shadcn/ui, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express.
- **Storage**: JSON-based file persistence.
