# Todo Summary Assistant

A full-stack application that helps users manage their todos and generate AI-powered summaries that can be shared directly to Slack. Built with React, Node.js, and integrated with Google's Gemini AI.

## Features

- ✨ Create, edit, and delete todo items
- 🤖 Generate AI-powered summaries of pending todos using Gemini
- 💬 Share summaries directly to Slack channels
- 🎯 Real-time updates and responsive design
- 🔐 Environment-based configuration

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- ShadcnUI for component library

### Backend
- Node.js with Express
- PostgreSQL with Drizzle ORM
- RESTful API architecture

### Integrations
- Google Gemini AI for todo summarization
- Slack Webhooks for sharing summaries

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- PostgreSQL database
- Google Cloud account for Gemini API
- Slack workspace with admin access

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-summary-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   Create a `.env` file in the root directory using `.env.example` as a template:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tododb

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Slack
SLACK_WEBHOOK_URL=your_slack_webhook_url
```

4. Initialize the database:
```bash
npm run db:migrate
```

5. Start the development servers:
```bash
# Start backend
npm run dev:backend

# Start frontend (in a new terminal)
npm run dev:frontend
```

The application should now be running at `http://localhost:5173`

## Integration Setup

### Gemini AI Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Gemini API
4. Create API credentials and copy your API key
5. Add the API key to your `.env` file

### Slack Integration
1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Create a new app in your workspace
3. Under "Incoming Webhooks":
   - Activate Incoming Webhooks
   - Click "Add New Webhook to Workspace"
   - Select the channel where summaries will be posted
4. Copy the Webhook URL and add it to your `.env` file

## Architecture Decisions

### Frontend Architecture
- **Component Structure**: Utilized a modular component architecture with ShadcnUI for consistent styling and better maintainability
- **State Management**: Implemented React Query for server state management and local state for UI interactions
- **TypeScript**: Used throughout for type safety and better developer experience

### Backend Architecture
- **RESTful API**: Designed with standard REST principles for predictable and scalable endpoints
- **Database Schema**:
  ```
  todos
    - id (uuid, primary key)
    - title (text)
    - description (text)
    - status (enum: pending, completed)
    - created_at (timestamp)
    - updated_at (timestamp)
  ```
- **ORM Choice**: Drizzle ORM for type-safe database operations and migrations

### Integration Architecture
- **AI Summary Generation**: 
  - Uses Gemini AI's text generation capabilities
  - Prompt engineering optimized for concise and relevant summaries
  - Rate limiting and error handling implemented
- **Slack Integration**:
  - Webhook-based approach for simplicity and reliability
  - Formatted messages for better readability
  - Error handling and retry mechanisms

## API Endpoints

```
GET /api/todos - Fetch all todos
POST /api/todos - Create a new todo
PUT /api/todos/:id - Update a todo
DELETE /api/todos/:id - Delete a todo
POST /api/summarize - Generate and send summary to Slack
```



