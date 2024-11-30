# HealSmartly

HealSmartly is a modern healthcare management application built with React, TypeScript, and Vite. It provides an intuitive interface for managing healthcare-related tasks and information.

## Features

- 👥 Staff Management
  - Employee directory with detailed profiles
  - Shift scheduling and management
  - Points system for performance tracking
  - Recovery shift allocation
- 📅 Scheduling
  - Interactive calendar interface
  - Drag-and-drop shift management
  - Conflict detection
  - Shift swap requests
- 📊 Analytics Dashboard
  - Real-time staff performance metrics
  - Department-wise analytics
  - Custom date range reports
  - Export functionality
- 🔔 Notifications
  - Real-time alerts
  - Customizable notification preferences
  - Multi-channel delivery (in-app, email)
  - Notification grouping

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser

### Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
cd healsmartly-vite
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file:

```bash
cp .env.example .env
```

Update the environment variables in .env with your values.

4. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── assets/        # Static assets (images, fonts)
├── components/    # React components
│   ├── analytics/   # Analytics components
│   ├── attendance/  # Attendance tracking
│   ├── dashboard/   # Dashboard components
│   ├── layout/      # Layout components
│   ├── notifications/ # Notification components
│   ├── scheduling/   # Scheduling components
│   ├── staff/       # Staff management
│   └── ui/          # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/          # Utility functions and types
├── services/     # API and service functions
└── test/         # Test files
```

## Key Features Implementation

### Staff Management

- Employee profiles with certification tracking
- Points-based performance system
- Recovery shift allocation based on workload

### Scheduling System

- Interactive calendar with drag-and-drop
- Conflict detection and resolution
- Shift swap request workflow
- Department-wise schedule views

### Notification System

- Real-time notifications using WebSocket
- Customizable notification preferences
- Smart notification grouping
- Multi-channel delivery support

### Analytics Dashboard

- Real-time performance metrics
- Department efficiency tracking
- Custom date range analytics
- Data export functionality

## Contributing

1. Create a feature branch
2. Commit your changes (following conventional commits)
3. Push to the branch
4. Open a Pull Request

## Testing

The project uses Vitest for testing. Key test areas include:

- Component rendering and interaction
- Service function behavior
- Notification system
- Scheduling logic

Run tests with:

```bash
npm run test        # Run all tests
npm run test:ui     # Run with UI
npm run test:coverage # Generate coverage report
```

## License

MIT License

## Support

For support, please open an issue in the repository or contact the development team.
