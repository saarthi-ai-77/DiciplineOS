# DisciplineOS

DisciplineOS is a high-performance tracking system designed for individuals who value extreme discipline and data integrity. It tracks build hours, learning progress, and daily execution with a focus on consistency.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase (Auth + Postgres)
- **State Management**: React Query

## Features

- **Authentication**: Secure Email/Password authentication via Supabase.
- **Daily Logging**: Track outreach, delivery, build hours, and learning hours.
- **Immutable Data**: Logs are immutable once saved, enforcing truth and accountability.
- **Advanced Execution Metrics**: 
  - **Weekly Delta**: Percent change in build volume vs. last week.
  - **7-Day Moving Average**: Trend lines on execution charts.
  - **Time-to-Log**: Performance analysis based on log submission time.
- **Granular Project Tracking**: 
  - Define multiple active projects.
  - Log specific hours per project.
  - Dedicated per-project consistency heatmaps.
- **Custom Discipline Buffers**: Define your own binary habits (e.g., Gym, Deep Work) in a modular system.
- **Historical Search**: Command-line style search to filter notes and recall historical execution details.
- **30-Day Consistency Heatmap**: Visual feedback of your recent execution streak.
- **Streak & Completion Rates**: Immediate feedback on long-term discipline.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase Account

### Setup

1.  **Clone the Repository**:
    ```bash
    git clone <your-repo-url>
    cd DisciplineOS
    ```

2.  **Install Dependencies**:
    ```bash
    cd frontend
    npm install
    ```

3.  **Database Setup**:
    - Go to your Supabase Project -> SQL Editor.
    - Copy the contents of `supabase/setup.sql` and run it.

4.  **Environment Variables**:
    - Create a `.env` file in the `frontend` directory based on `.env.example`.
    - Fill in your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

5.  **Run Locally**:
    ```bash
    npm run dev
    ```

## UX Philosophy

- **No Gamification**: Progress is its own reward.
- **No Motivational Text**: Action speaks louder than words.
- **Reliability**: Fail silently on duplicates, ensure data integrity at the database level.
- **Transparency**: Clear "NOT LOGGED" states to highlight missed days.

## Deployment

This app is optimized for deployment on **Vercel**. Ensure you add the environment variables in your Vercel project settings.
