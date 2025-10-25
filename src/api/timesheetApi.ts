
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

export const fetchTimesheetsApi = async (): Promise<TimesheetEntry[]> => {
  const res = await fetch("https://tentwentyapi.onrender.com/timesheets");
  if (!res.ok) throw new Error("Failed to fetch timesheets");

  const data: TimesheetEntry[] = await res.json();
  return data;
};


export const fetchWeeklyTimesheet = async (
  weekId: number
): Promise<{ success: boolean; data: TimesheetEntry[] | null }> => {
  try {
    const res = await fetch(`https://tentwentyapi.onrender.com/timesheet/week/${weekId}`);
    if (!res.ok) throw new Error('Failed to fetch weekly timesheet');

    const data: TimesheetEntry[] = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching weekly timesheet:', error);
    return { success: false, data: null };
  }
};
