import fs from 'fs';

// Configuration
const totalDays = 100; // total working days
const startDate = new Date('2025-10-10'); // starting date (assume Monday)
const projects = ['Project A', 'Project B', 'Project C', 'Project D'];
const taskTypes = ['Development', 'Bug Fixing', 'Testing', 'Code Review', 'Design'];

// Helper to format date YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Generate random number between min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to check if date is weekend
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

// Generate timesheet data
const timesheets = [];
let currentDate = new Date(startDate);
let weekNumber = 1;
let dayCountInWeek = 0;

for (let i = 0; i < totalDays; ) {
  if (!isWeekend(currentDate)) {
    dayCountInWeek++;
    const numTasks = getRandomInt(2, 3); // 2 or 3 tasks per day

    const tasks = [];
    for (let t = 0; t < numTasks; t++) {
      tasks.push({
        project: projects[getRandomInt(0, projects.length - 1)],
        type: taskTypes[getRandomInt(0, taskTypes.length - 1)],
        description: `Task description ${i + 1}-${t + 1}`,
        hours: getRandomInt(1, 8)
      });
    }

    timesheets.push({
      id: i + 1,
      week: weekNumber,
      date: formatDate(currentDate),
      tasks
    });

    i++; // count only working days

    if (dayCountInWeek === 5) {
      weekNumber++; // increment week after 5 working days
      dayCountInWeek = 0;
    }
  }

  // Move to next day
  currentDate.setDate(currentDate.getDate() + 1);
}

// Save to JSON file
fs.writeFileSync('db.json', JSON.stringify(timesheets, null, 2));
console.log('Generated db.json with 100 working days of tasks!');
