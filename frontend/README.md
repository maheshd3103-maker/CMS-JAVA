# CMS React Frontend

This is the React frontend for the Complaint Management System.

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The React app will run on `http://localhost:3000`

### Backend Integration

Make sure your Spring Boot backend is running on `http://localhost:8080` before starting the React frontend.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

### Features

- User registration and login
- User dashboard with account information
- Complaint submission and tracking
- Manager dashboard with analytics
- Responsive design
- Real-time data from Spring Boot API

### Project Structure

```
src/
├── components/          # Reusable components
│   └── Sidebar.js      # Navigation sidebar
├── pages/              # Page components
│   ├── HomePage.js     # Landing page
│   ├── LoginPage.js    # User login
│   ├── UserDashboard.js # User dashboard
│   └── ...
├── services/           # API service layer
│   └── api.js         # Axios API calls
├── App.js             # Main app component
└── index.js           # Entry point
```

### API Integration

The frontend communicates with the Spring Boot backend through REST APIs:

- User authentication: `/api/login`, `/api/register`
- User data: `/api/user/{id}`
- Complaints: `/api/complaint/*`
- Manager dashboard: `/api/manager/dashboard`

### Styling

The application uses custom CSS with a consistent design system:
- Primary color: #2c3e50
- Secondary colors: #3498db, #27ae60, #e74c3c
- Responsive grid layouts
- Card-based UI components