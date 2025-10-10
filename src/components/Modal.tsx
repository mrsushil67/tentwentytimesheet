import React, { useState } from 'react';

const projectOptions = [
  { value: 'project-a', label: 'Project Alpha' },
  { value: 'project-b', label: 'Project Beta' },
  { value: 'project-c', label: 'Project Gamma' },
  { value: 'project-d', label: 'Project Delta' },
];

const workTypeOptions = [
  { value: 'development', label: 'Development' },
  { value: 'bug-fixes', label: 'Bug Fixes' },
  { value: 'testing', label: 'Testing' },
  { value: 'design', label: 'Design' },
  { value: 'meetings', label: 'Meetings' },
  { value: 'documentation', label: 'Documentation' },
];

interface AddNewEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  inDate: string;
}

interface FormData {
  project: string;
  typeOfWork: string;
  taskDescription: string;
  hours: number;
  date: string;
}

const AddNewEntryModal: React.FC<AddNewEntryModalProps> = ({ isOpen, onClose, onSubmit, inDate }) => {
  const [project, setProject] = useState<string>('');
  const [typeOfWork, setTypeOfWork] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [hours, setHours] = useState<number>(0);
  const [date, setDate] = useState<string>(inDate || new Date().toISOString());
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!project || !typeOfWork || !taskDescription || hours <= 0) {
      setError('All fields are required, and hours must be greater than 0.');
      return; 
    }

    const formData: FormData = { project, typeOfWork, taskDescription, hours, date };
    onSubmit(formData);
    setProject('');
    setTypeOfWork('');
    setTaskDescription('');
    setHours(0);
    setDate(inDate);
  };

  const handleHoursChange = (increment: number) => {
    setHours((prevHours) => Math.max(0, prevHours + increment));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add New Entry</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
              Select Project <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="project"
                name="project"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                required
              >
                <option value="" disabled>Project Name</option>
                {projectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="typeOfWork" className="block text-sm font-medium text-gray-700 mb-1">
              Type of Work <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="typeOfWork"
                name="typeOfWork"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                value={typeOfWork}
                onChange={(e) => setTypeOfWork(e.target.value)}
                required
              >
                <option value="" disabled>Bug fixes</option>
                {workTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Task description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="taskDescription"
              name="taskDescription"
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Write text here ..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              required
            ></textarea>
            <p className="mt-1 text-xs text-gray-500">A note for extra info</p>
          </div>

          <div>
            <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
              Hours <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm w-fit">
              <button
                type="button"
                onClick={() => handleHoursChange(-1)}
                className="p-2 border-r border-gray-300 text-gray-600 hover:bg-gray-50 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <input
                id="hours"
                type="number"
                min="0"
                className="w-16 text-center py-2 text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 border-none"
                value={hours}
                onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                required
              />
              <button
                type="button"
                onClick={() => handleHoursChange(1)}
                className="p-2 border-l border-gray-300 text-gray-600 hover:bg-gray-50 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </form>

        <div className="flex justify-end p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewEntryModal;
