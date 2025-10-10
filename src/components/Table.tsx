import React from 'react';
import type { Status } from '../services/timesheetService';

interface TimesheetRowData {
    week: number;
    dateRange: string;
    status: Status;
}

interface TableProps {
    timesheets: TimesheetRowData[];
    loading: boolean;
    handleActionClick: (week: number, action: string) => void;
}

const getStatusDetails = (status: Status) => {
    switch (status) {
        case 'COMPLETED':
            return { actionText: 'View', actionClass: 'text-blue-600 hover:text-blue-800', badgeClass: 'bg-green-100 text-green-700' };
        case 'INCOMPLETE':
            return { actionText: 'Update', actionClass: 'text-blue-600 hover:text-blue-800', badgeClass: 'bg-yellow-100 text-yellow-700' };
        case 'MISSING':
            return { actionText: 'Create', actionClass: 'text-blue-600 hover:text-blue-800 font-medium', badgeClass: 'bg-red-100 text-red-700' };
        default:
            return { actionText: 'View', actionClass: 'text-gray-500', badgeClass: 'bg-gray-100 text-gray-500' };
    }
};

const TimesheetsTable: React.FC<TableProps> = ({ timesheets, loading, handleActionClick }) => {
    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (timesheets.length === 0) return <div className="text-center py-10">No timesheets found.</div>;

    console.log("timesheets : ", timesheets)

    return (
        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            WEEK #
                        </th>
                        <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DATE
                        </th>
                        <th className="w-[30%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            STATUS
                        </th>
                        <th className="w-[20%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ACTIONS
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {timesheets.map((row) => {
                        const { actionText, actionClass, badgeClass } = getStatusDetails(row.status.toUpperCase() as Status);
                        return (
                            <tr
                                key={row.week}
                                onClick={() => handleActionClick(row.week, 'View')}
                                className="cursor-pointer hover:bg-gray-50 transition"
                            >
                                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">{row.week}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{row.dateRange}</td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeClass}`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm">
                                    <button
                                        className={`bg-transparent border-none p-0 cursor-pointer ${actionClass}`}
                                        onClick={() => handleActionClick(row.week, actionText)}
                                    >
                                        {actionText}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TimesheetsTable;
