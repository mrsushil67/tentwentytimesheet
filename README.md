# Timesheet Management System

A **web-based Timesheet Management System** built with **React + TypeScript** that allows users to view, filter, and manage weekly timesheets. 

The app displays weekly summaries, total logged hours, and allows filtering by status (Completed, Incomplete, Missing).

## 🚀 Features
- View weekly timesheet summaries
- Filter timesheets by **status** (Completed, Incomplete, Missing)
- Paginate timesheet data
- View detailed tasks for each week
- Responsive and clean UI using **Tailwind CSS**
- Modular React components for maintainability
- Proper validation for user inputs and API responses

## 🧩 Tech Stack
- **Frontend Framework:** React (with TypeScript)
- **Styling:** Tailwind CSS, Styled Components (for component-level customization)
- **Utilities & Helpers:**
  - Custom date formatting and grouping via `formatDate.ts`
  - Reusable components for Pagination and Tables

## ⚙️ Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/timesheet-management-app.git
   cd timesheet-management-app
Install dependencies:

bash
Copy code
npm install
Run the development server:

bash
Copy code
npm run dev
Open the app in your browser:
Visit: http://localhost:3000

📁 Project Structure
graphql
Copy code
src/
├── components/
│   ├── Table.tsx              # Table component for displaying timesheet data
│   ├── Pagination.tsx         # Pagination component for navigating pages
├── pages/
│   ├── TimesheetList.tsx      # Displays the list of timesheets
│   ├── TimesheetsDashboard.tsx# Dashboard showing summary of timesheets
├── services/
│   ├── timesheetService.ts    # Handles API calls (mocked data for now)
├── utils/
│   ├── formatDate.ts          # Utility for date formatting and grouping
├── App.tsx                    # Main app component
└── index.tsx                  # Entry point of the application
⚖️ Assumptions & Notes
Weekly timesheets are grouped by week number using start and end dates.

A full work week is considered 40 hours or more:

>= 40 hours → Completed

> 0 and < 40 → Incomplete

0 hours → Missing

Filtering is done client-side for simplicity (can be moved to the backend for scalability).

fetchTimesheets and fetchWeeklyTimesheet simulate API calls returning JSON responses.

🕐 Time Spent Breakdown
Task	Duration
Project setup & structure	1 hour
Fetching and grouping API data	2 hours
Building UI components (Table, Pagination)	2 hours
Implementing filtering and pagination logic	1.5 hours
Testing and bug fixes	2 hours
Total	~7.5 hours

Example Screens
Dashboard View: Displays weekly timesheets with hours, status, and action.

Detailed View: Shows all tasks for the selected week.



🔑 Login Credentials
Email: user@tentwenty.com
Password: tentwenty123

