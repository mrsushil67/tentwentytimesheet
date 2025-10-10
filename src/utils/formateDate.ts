// utils.ts
export const groupByWeek = (timesheets: any[]) => {
  const weeks: any[] = [];

  timesheets.forEach((day) => {
    const weekIndex = day.week - 1;

    if (!weeks[weekIndex]) {
      weeks[weekIndex] = {
        week: day.week,
        startDate: day.date,
        endDate: day.date,
        tasks: [...day.tasks],
      };
    } else {
      weeks[weekIndex].endDate = day.date;
      weeks[weekIndex].tasks.push(...day.tasks);
    }
  });

  return weeks;
};


export const formatWeekRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startDay = start.getDate();
  const endDay = end.getDate();

  const month = start.toLocaleString('default', { month: 'long' });
  const year = start.getFullYear();

  return `${startDay} - ${endDay} ${month}, ${year}`;
};