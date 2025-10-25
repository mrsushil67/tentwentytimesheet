A web-based **Timesheet Management System** built with **React + TypeScript** that allows users to view, filter, and manage weekly timesheets.  
The app displays weekly summaries, total logged hours, and allows filtering by status (Completed, Incomplete, Missing).  

---

## 🚀 Features

- View weekly timesheet summaries
- Filter timesheets by **status**
- Paginate timesheet data
- View detailed tasks for each week
- Responsive and clean UI using Tailwind CSS
- Modular React components for maintainability
- Proper validation

---

## 🧩 Tech Stack

**Frontend Framework:**
- React (with TypeScript)

**Styling:**
- Tailwind CSS  
- Styled Components (for component-level customization)

**Utilities & Helpers:**
- Custom date formatting and grouping via `formateDate.ts`
- Pagination and Table reusable components


## ⚙️ Setup Instructions

Install dependencies
npm install

Run the development server
npm run dev

5️⃣ Open in browser

Visit 👉 https://tentwentyapi.onrender.com

📁 Project Structure
src/
│
├── components/
│   ├── Table.tsx
│   ├── Pagination.tsx
│
├── pages/
│   ├── TimesheetList.tsx
│   ├── TimesheetsDashboard.tsx
│
├── services/
│   ├── timesheetService.ts
│
├── utils/
│   ├── formateDate.ts
│
├── App.tsx
└── index.tsx

Assumptions & Notes

Weekly timesheets are grouped by week number using start and end dates.

A full work week is considered 40 hours or more.

>= 40 hours → Completed

> 0 and < 40 → Incomplete

0 hours → Missing

Filtering is client-side for simplicity (can be moved to backend for scalability).

fetchTimesheets and fetchWeeklyTimesheet simulate API calls returning JSON responses.



🕐 Time Spent
Task	Duration
Project setup & structure	1 hour
Fetching and grouping API data	2 hours
Building UI components (Table, Pagination)	2 hours
Implementing filtering and pagination logic	1.5 hours
Testing and bug fixes	2 hour
Total	~7.5 hours

Example Screens

Dashboard View: Displays weekly timesheets with hours, status, and action.

Detailed View: Shows all tasks for the selected week.


Login -- 

"email": "user@tentwenty.com",
"password": "tentwenty123",

### 1️⃣ Clone the repository
```bash
git https://github.com/mrsushil67/tentwentytimesheet.git
cd tentwentytimesheet