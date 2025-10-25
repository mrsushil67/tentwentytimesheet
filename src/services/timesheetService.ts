import { fetchTimesheetsApi } from "../api/timesheetApi";

export interface Task {
  project: string;
  type: string;
  description: string;
  hours: number;
}
export interface TimesheetEntry {
  id: number;
  week: number;
  date: string;
  tasks: Task[];
}

export type Status = "COMPLETED" | "INCOMPLETE" | "MISSING";

export interface TimesheetResult {
  success: boolean;
  data?: (TimesheetEntry & { status: Status })[];
  message?: string;
}

const getStatus = (hours: number): Status => {
  if (hours === 0) return "MISSING";
  if (hours < 40) return "INCOMPLETE";
  return "COMPLETED";
};

export const fetchTimesheets = async (): Promise<TimesheetResult> => {
  try {
    const data: TimesheetEntry[] = await fetchTimesheetsApi();

    const timesheetsWithStatus = data.map(ts => {
      const totalHours: number = ts.tasks.reduce(
        (sum: number, task: Task) => sum + task.hours,
        0
      );

      return {
        ...ts,
        totalHours,
        status: getStatus(totalHours),
      };
    });

    return { success: true, data: timesheetsWithStatus };
  } catch (error) {
    return { success: false, message: "Failed to fetch timesheets" };
  }
};


export const filterTimesheetsByDate = (
  timesheets: (TimesheetEntry & { status: Status })[],
  start: Date,
  end: Date
) => {
  return timesheets.filter(ts => {
    const tsDate = new Date(ts.date);
    return tsDate >= start && tsDate <= end;
  });
};

export const fetchWeeklyTimesheet = async (
  weekId: number
): Promise<{
  success: boolean;
  data: {
    id: number;
    week: number;
    dates: { date: string; tasks: Task[] }[];
  } | null;
}> => {
  try {
    const res = await fetch("https://tentwentyapi.onrender.com/timesheets");
    if (!res.ok) throw new Error("Failed to fetch timesheets");

    const allEntries: TimesheetEntry[] = await res.json();

    const weekEntries = allEntries.filter(entry => entry.week === weekId);

    if (weekEntries.length === 0)
      return { success: false, data: null };

    const dateGroups = weekEntries.map(entry => ({
      date: entry.date,
      tasks: entry.tasks,
    }));

    const weekData = {
      id: weekId,
      week: weekId,
      dates: dateGroups,
    };

    return { success: true, data: weekData };
  } catch (error) {
    console.error("Error fetching weekly timesheet:", error);
    return { success: false, data: null };
  }
};


// timesheetApi.ts
export const addNewTimesheetEntry = async (
  newEntry: {
    project: string;
    typeOfWork: string;
    taskDescription: string;
    hours: number;
    date: string;
  }
): Promise<{ success: boolean; data: any | null }> => {
  try {
    // 1️⃣ Get all timesheets
    const response = await fetch("https://tentwentyapi.onrender.com/timesheets");
    if (!response.ok) throw new Error("Failed to fetch timesheets");
    const timesheets = await response.json();

    // 2️⃣ Check if date already exists
    const existing = timesheets.find((entry: any) => entry.date === newEntry.date);

    if (existing) {
      // 3️⃣ If it exists → push new task to that date and send PUT request
      const updatedTasks = [
        ...existing.tasks,
        {
          project: newEntry.project,
          type: newEntry.typeOfWork,
          description: newEntry.taskDescription,
          hours: newEntry.hours,
        },
      ];

      const updatedEntry = { ...existing, tasks: updatedTasks };

      const updateRes = await fetch(`https://tentwentyapi.onrender.com/timesheets/${existing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEntry),
      });

      if (!updateRes.ok) throw new Error("Failed to update existing timesheet");

      const updated = await updateRes.json();
      console.log("✅ Updated existing timesheet:", updated);
      return { success: true, data: updated };
    } else {
      // 4️⃣ If it doesn’t exist → create a new timesheet
      const newWeek = getWeekFromDate(newEntry.date);
      const newTimesheet = {
        week: newWeek,
        date: newEntry.date,
        tasks: [
          {
            project: newEntry.project,
            type: newEntry.typeOfWork,
            description: newEntry.taskDescription,
            hours: newEntry.hours,
          },
        ],
      };

      const createRes = await fetch("https://tentwentyapi.onrender.com/timesheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTimesheet),
      });

      if (!createRes.ok) throw new Error("Failed to create new timesheet");

      const created = await createRes.json();
      console.log("✅ Created new timesheet:", created);
      return { success: true, data: created };
    }
  } catch (error) {
    console.error("❌ Error adding new timesheet entry:", error);
    return { success: false, data: null };
  }
};

export const getWeekFromDate = (dateString: string): number => {
  const date = new Date(dateString);
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor(
    (date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000)
  );
  return Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7);
};

// Update task in backend
export const updateTimesheetTask = async (
  timesheetdate: string,
  taskIndex: number,
  updatedTask: any
): Promise<{ success: boolean; data: any | null }> => {

  console.log("Updating task:", timesheetdate, taskIndex, updatedTask);
  try {
    const response = await fetch(`https://tentwentyapi.onrender.com/timesheets/${timesheetdate}/tasks/${taskIndex}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) throw new Error("Failed to update task");

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false, data: null };
  }
};

// Delete task from backend
export const deleteTimesheetTask = async (
  timesheetId: string,
  taskIndex: number
): Promise<{ success: boolean; data: any | null }> => {
  try {
    console.log("Deleting task:", timesheetId, taskIndex);
    const response = await fetch(`https://tentwentyapi.onrender.com/timesheets/${timesheetId}/tasks/${taskIndex}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete task");

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, data: null };
  }
};
