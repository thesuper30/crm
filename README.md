# Agency OS - Molten Shuttle

A comprehensive client management system designed for digital marketing agencies. Built with Next.js 16 and modern web technologies.

## Features

### 🎯 Client Pipeline Management
- Drag-and-drop Kanban board for managing clients through stages (Inquiry → Proposal → Closed)
- Real-time health tracking and priority management
- Visual indicators for client status and engagement

### 📊 Active Client Directory
- Centralized view of all active/closed clients
- Quick access to client portals and information
- Exportable client lists

### 👥 Team Management
- Team member profiles with workload tracking
- Task assignment and capacity planning
- Skill-based team organization

### ✅ Task Management
- Comprehensive task system with priorities and statuses
- "Today's Focus" board for daily task management
- Client-specific task filtering
- Task detail panel with checklists and notes

### 📢 Campaign Management
- SEO and Performance Marketing campaign tracking
- Platform-specific metrics (Google Ads, Meta Ads, LinkedIn Ads)
- Real-time performance analytics (CTR, conversions, organic traffic)
- Budget and timeline management

### 🚀 Client Portal
- Dedicated client login system
- Real-time project overview
- Task tracking (Agency tasks vs. Client pending)
- Request submission system
- Secure messaging with agency team
- Campaign performance visibility

### 📝 Request Management
- Incoming work request queue
- Request approval/rejection workflow
- Automatic task creation from approved requests

## Tech Stack

- **Framework**: Next.js 16.1.4 with Turbopack
- **UI**: React 19 with custom components
- **Drag & Drop**: @dnd-kit/core for Kanban functionality
- **Icons**: lucide-react
- **Styling**: CSS Modules with custom design system
- **State Management**: React Context API
- **Data Persistence**: LocalStorage with cross-tab sync

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── ActionMenu.js   # Dropdown menu for actions
│   ├── ClientCard.js   # Client card component
│   ├── CampaignBoard.js # Campaign management
│   ├── TaskDetailPanel.js
│   └── ClientPortal/   # Client-facing components
├── context/            # React Context providers
│   ├── ClientContext.js
│   ├── TaskContext.js
│   ├── CampaignContext.js
│   └── ...
├── data/              # Mock data and constants
├── campaigns/         # Campaign pages
├── clients/          # Client detail pages
├── directory/        # Active clients directory
├── portal/          # Client portal pages
├── tasks/           # Task management
├── team/            # Team management
└── today/           # Today's focus board
```

## Key Features Implemented

### Recent Updates
- ✅ Refined Delete UI with ActionMenu component
- ✅ SSR-safe context providers
- ✅ Clickable client cards in directory
- ✅ Cross-tab data synchronization
- ✅ Campaign hierarchy (SEO, Performance, Mixed)
- ✅ Automated metrics calculation (CTR, conversion rates)

### Security
- Client portal authentication
- Role-based access (Agency vs. Client)
- Secure data persistence

## Development

The application uses:
- Server-side rendering (SSR) for optimal performance
- Client-side state management for real-time updates
- localStorage for data persistence (demo purposes)
- Context API for global state management

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- Real-time collaboration features
- Advanced analytics and reporting
- Email notifications
- Calendar integration
- File upload and management
- API integrations (Google Analytics, Facebook Ads, etc.)

## License

Private - All Rights Reserved

## Author

Built for modern digital marketing agencies to streamline client management and operations.
