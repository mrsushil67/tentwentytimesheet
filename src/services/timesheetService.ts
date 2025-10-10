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
    const res = await fetch("http://localhost:5000/timesheets");
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


export const addNewTimesheetEntry = async (
  newEntry: { project: string; typeOfWork: string; taskDescription: string; hours: number; date: string; }
): Promise<{ success: boolean; data: any | null }> => {
  try {
    const response = await fetch("http://localhost:5000/timesheets");
    if (!response.ok) {
      throw new Error("Failed to fetch timesheets");
    }

    const timesheets = await response.json();

    console.log("timesheets : ", timesheets)

    let found = false;
    let foundId = 0;
    const updatedTimesheets = timesheets.map((entry: any) => {
      if (entry.date === newEntry.date) {
        entry.tasks.push({
          project: newEntry.project,
          type: newEntry.typeOfWork,
          description: newEntry.taskDescription,
          hours: newEntry.hours,
        });
        found = true;
        foundId = entry.id
      }
      return entry;
    });


    console.log("Mila : ", found)

    if (!found) {
      const newWeek = getWeekFromDate(newEntry.date);
      updatedTimesheets.push({
        id: timesheets.length + 1,
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
      });
    } else {
      // const updateResponse = await fetch(`http://localhost:5000/timesheets/${foundId}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(updatedTimesheets),
      // });

      // if (!updateResponse.ok) {
      //   throw new Error("Failed to update timesheets");
      // }
    }


    console.log("Timesheet updated successfully");
    return { success: true, data: updatedTimesheets };

  } catch (error) {
    console.error("Error adding new timesheet entry:", error);
    return { success: false, data: null };
  }
};

const getWeekFromDate = (date: string): number => {
  const currentDate = new Date(date);
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const diff = currentDate.getTime() - startDate.getTime();
  const oneDay = 1000 * 3600 * 24;
  const weekNumber = Math.ceil(diff / (7 * oneDay));
  return weekNumber;
};

