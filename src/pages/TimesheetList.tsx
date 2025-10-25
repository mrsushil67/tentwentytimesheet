import React, { useState } from 'react';
import AddNewEntryModal from '../components/Modal';
import { addNewTimesheetEntry, deleteTimesheetTask, updateTimesheetTask } from '../services/timesheetService';
import EditTaskModal from '../components/EditEntryModal';

interface Task {
  description: string;
  hours: number;
  project: string;
  type: string;
}

interface DailyTimesheet {
  id: string;
  date: string;
  tasks: Task[];
}


type TimesheetProps = {
  tasks: { week: number; dates: { id: string; date: string; tasks: Task[] }[] } | null;
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

// const calculateDailyTotal = (tasks: Task[]): number => {
//   return tasks.reduce((sum, task) => sum + task.hours, 0);
// };

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

const DailyTimesheetSection: React.FC<{
  dayData: DailyTimesheet;
  onTaskAdded: (updatedDay: DailyTimesheet) => void;
}> = ({ dayData, onTaskAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTaskIndex, setEditTaskIndex] = useState<number | null>(null);
  const [editTaskData, setEditTaskData] = useState<any>(null);

  const handleAddTask = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmitNewEntry = async (data: {
    project: string;
    typeOfWork: string;
    taskDescription: string;
    hours: number;
    date: string;
  }) => {
    const newEntry = {
      project: data.project,
      typeOfWork: data.typeOfWork,
      taskDescription: data.taskDescription,
      hours: data.hours,
      date: data.date,
    };

    const result = await addNewTimesheetEntry(newEntry);

    if (result.success && result.data) {
      onTaskAdded(result.data);
      handleCloseModal();
    } else {
      console.error("Error adding new timesheet entry:", result.data);
    }
  };

  const handleEditTask = (index: number, task: Task) => {
    setEditTaskIndex(index);
    setEditTaskData({
      project: task.project,
      typeOfWork: task.type,
      taskDescription: task.description,
      hours: task.hours,
      date: dayData.date,
    });
    setIsEditModalOpen(true);
  };

  const handleSubmitEditEntry = async (data: any) => {
    if (editTaskIndex === null) return;

    const updatedTask = {
      project: data.project,
      type: data.typeOfWork,
      description: data.taskDescription,
      hours: data.hours,
    };

    console.log("Updated : ",updatedTask,dayData)
    const result = await updateTimesheetTask(dayData.date, editTaskIndex, updatedTask);
    if (result.success && result.data) {
      onTaskAdded(result.data);
      setIsEditModalOpen(false);
      setEditTaskIndex(null);
    } else {
      console.error("Error updating task:", result.data);
    }
  };

  const handleDeleteTask = async (index: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    const result = await deleteTimesheetTask(dayData.id, index);
    if (result.success && result.data) {
      onTaskAdded(result.data);
    } else {
      console.error("Error deleting task:", result.data);
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
              onEdit={() => handleEditTask(index, task)}
              onDelete={() => handleDeleteTask(index)}
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

      {/* ✅ ADD NEW ENTRY MODAL */}
      <AddNewEntryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitNewEntry}
        inDate={dayData.date}
      />

      {/* ✅ EDIT TASK MODAL */}
      {editTaskData && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleSubmitEditEntry}
          existingData={editTaskData}  // prefilled form values
        />
      )}
    </div>
  );
};

const Timesheet: React.FC<TimesheetProps> = ({ tasks }) => {
  const [timesheetData, setTimesheetData] = useState(tasks);

  if (!timesheetData) return <div>No tasks available</div>;

  console.log("Timesheet Data: ", timesheetData);

  const { dates } = timesheetData;
  const totalWeeklyHours = dates.flatMap(d => d.tasks).reduce((sum, task) => sum + task.hours, 0);
  const targetHours = 40;
  const hoursPercentage = Math.min((totalWeeklyHours / targetHours) * 100, 100);

  const weekRangeString = formatWeekRange(dates.map(d => d.date));

  // ✅ handle when new entry is added
  const handleTaskAdded = (newData: DailyTimesheet) => {
    setTimesheetData(prev => {
      if (!prev) return prev;

      // merge newData into existing
      const updatedDates = [...prev.dates];
      const index = updatedDates.findIndex(d => d.date === newData.date);

      if (index !== -1) {
        updatedDates[index] = newData; // replace updated day
      } else {
        // ensure new entry has an id expected by TimesheetProps
        const newEntry: DailyTimesheet = {
          id: newData.id ?? `${newData.date}-${Date.now()}`,
          date: newData.date,
          tasks: newData.tasks,
        };
        updatedDates.push(newEntry);
      }

      return { ...prev, dates: updatedDates };
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <div className='flex justify-between'>
        <h1 className="text-2xl font-semibold text-gray-800">
          This week's timesheet
        </h1>
        <div className="text-center">
          <span className="text-sm font-medium mr-2 text-gray-700">
            {totalWeeklyHours}/{targetHours} hrs
          </span>
          <div className="flex justify-end text-xs ml-2 text-gray-500">{Math.round(hoursPercentage)}%</div>
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
          <DailyTimesheetSection
            key={dayData.date}
            dayData={{ ...dayData, id: dayData.id }}
            onTaskAdded={handleTaskAdded}
          />
        ))}
      </div>
    </div>
  );
};


export default Timesheet;