import React, { useState } from 'react';
import AddNewEntryModal from '../components/Modal';
import { addNewTimesheetEntry } from '../services/timesheetService';

interface Task {
  description: string;
  hours: number;
  project: string;
  type: string;
}

interface DailyTimesheet {
  date: string;
  tasks: Task[];
}

type TimesheetProps = {
  tasks: { week: number; dates: { date: string; tasks: Task[] }[] } | null;
};


const formatDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatWeekRange = (dates: string[]): string => {
  if (dates.length === 0) return '';

  const startDate = new Date(dates[0] + 'T00:00:00');
  const endDate = new Date(dates[dates.length - 1] + 'T00:00:00');

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const month = startDate.toLocaleDateString('en-US', { month: 'long' });
  const year = startDate.getFullYear();

  return `${startDay} - ${endDay} ${month}, ${year}`;
};

const calculateDailyTotal = (tasks: Task[]): number => {
  return tasks.reduce((sum, task) => sum + task.hours, 0);
};

interface TaskRowProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-blue-50 transition duration-150"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-1 text-sm font-medium text-gray-800">
        {task.description} {task.type}
      </div>

      <div className="w-16 text-sm font-semibold text-right text-gray-700">{task.hours} hrs</div>

      <div className="w-30 text-sm text-right text-blue-800 font-medium cursor-pointer flex items-center justify-end">
        <span className="px-2 py-1 border border-transparent rounded-lg bg-blue-100 ">
          {task.project}
        </span>
        <span className="text-gray-400 cursor-pointer hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 10a2 2 0 110-4 2 2 0 010 4zM10 10a2 2 0 110-4 2 2 0 010 4zM15 10a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </span>

        {isHovered && (
          <div className="absolute right-60 mt-2 w-20 bg-white border border-gray-200 rounded shadow-lg z-10 text-xs">
            <button onClick={onEdit} className="block w-full text-left px-3 py-1 hover:bg-gray-100">Edit</button>
            <button onClick={onDelete} className="block w-full text-left px-3 py-1 hover:bg-red-500 hover:text-white text-red-600">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};


const DailyTimesheetSection: React.FC<{ dayData: DailyTimesheet }> = ({ dayData }) => {
  const totalHours = calculateDailyTotal(dayData.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Placeholder actions for the TaskRow component
  const handleEdit = () => console.log('Edit clicked');
  const handleDelete = () => console.log('Delete clicked');
  const handleAddTask = () => {
    console.log(`Add new task for ${dayData.date}`);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => setIsModalOpen(false);
  const handleSubmitNewEntry = async (data: {
    project: string;
    typeOfWork: string;
    taskDescription: string;
    hours: number;
    date: string;
  }) => {
    console.log("New entry submitted:", data);

    const weekId = 1;

    const newEntry = {
      project: data.project,
      typeOfWork: data.typeOfWork,
      taskDescription: data.taskDescription,
      hours: data.hours,
      date: data.date,
    };

    const result = await addNewTimesheetEntry(newEntry);

    if (result.success) {
      console.log("Successfully added new timesheet entry:", result.data);
      handleCloseModal();
    } else {
      console.error("Error adding new timesheet entry:", result.data);
    }
  };


  return (
    <div className="flex">
      <div className="w-24 pt-3 text-lg font-semibold text-gray-600 flex-shrink-0">
        {formatDate(dayData.date)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="bg-white space-y-2">
          {dayData.tasks.map((task, index) => (
            <TaskRow
              key={index}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

          <div
            className="p-3 flex justify-center items-center text-gray-400 hover:text-blue-500 font-semibold cursor-pointer border-2 border-dotted rounded-lg border-gray-400 hover:border-blue-400 hover:bg-blue-100 duration-150"
            onClick={handleAddTask}
          >
            <span className="select-none">+ Add new task</span>
          </div>
        </div>
      </div>
      <AddNewEntryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitNewEntry}
        inDate={dayData.date}
      />
    </div>
  );
};


const Timesheet: React.FC<TimesheetProps> = ({ tasks }) => {
  if (!tasks) {
    return <div>No tasks available</div>;
  }
  const { dates } = tasks;
  const totalWeeklyHours = dates.flatMap(d => d.tasks).reduce((sum, task) => sum + task.hours, 0);
  const targetHours = 40;
  const hoursPercentage = Math.min((totalWeeklyHours / targetHours) * 100, 100);

  const weekRangeString = formatWeekRange(dates.map(d => d.date));

  return (
    <>
      <div className="w-full max-w-5xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
        <div className='flex justify-between'>
          <h1 className="text-2xl font-semibold text-gray-800">
            This week's timesheet
          </h1>
          <div className="text-center">
            <span className="text-sm font-medium mr-2 text-gray-700">
              {totalWeeklyHours}/{targetHours} hrs
            </span>
            <div className=" flex justify-end text-xs ml-2 text-gray-500">{Math.round(hoursPercentage)}%</div>
            <div className="w-40 h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${hoursPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-8">{weekRangeString}</p>

        <div className="space-y-6">
          {dates.map((dayData) => (
            <DailyTimesheetSection key={dayData.date} dayData={dayData} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Timesheet;