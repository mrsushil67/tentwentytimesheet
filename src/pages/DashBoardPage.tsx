import React, { useState, useEffect } from 'react';
import { fetchTimesheets, fetchWeeklyTimesheet } from '../services/timesheetService';
import type { Status } from '../services/timesheetService';
import { formatWeekRange, groupByWeek } from '../utils/formateDate';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import Timesheet from './TimesheetList';

const TimesheetsDashboard: React.FC = () => {
    const [timesheets, setTimesheets] = useState<(any & { status: Status })[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [selectedWeek, setSelectedWeek] = useState<any | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [weekFilter, setWeekFilter] = useState<number | null>(null);


    useEffect(() => {
        const loadTimesheets = async () => {
            setLoading(true);
            const result = await fetchTimesheets();
            if (result.success && result.data) {

                const weeklyTimesheets = groupByWeek(result.data);

                const weeklySummaries = weeklyTimesheets.map((week) => {
                    const totalHours = week.tasks.reduce((sum: number, task: any) => sum + (task.hours || 0), 0);

                    let status: 'Completed' | 'Incomplete' | 'Missing' = 'Missing';
                    if (totalHours >= 40) status = 'Completed';
                    else if (totalHours > 0) status = 'Incomplete';

                    let action: 'View' | 'Update' | 'Create' = 'Create';
                    if (status === 'Completed') action = 'View';
                    else if (status === 'Incomplete') action = 'Update';

                    return {
                        week: week.week,
                        dateRange: formatWeekRange(week.startDate, week.endDate),
                        totalHours,
                        status,
                        action,
                        tasks: week.tasks,
                    };
                });

                setTimesheets(weeklySummaries);
                setTotalPages(Math.ceil(weeklySummaries.length / itemsPerPage));
            }
            setLoading(false);
        };
        loadTimesheets();
    }, [itemsPerPage]);


    useEffect(() => {
        const loadTimesheets = async () => {
            setLoading(true);
            const result = await fetchTimesheets();
            if (result.success && result.data) {
                const grouped = groupByWeek(result.data);
                setTotalPages(Math.ceil(grouped.length / itemsPerPage));
            }
            setLoading(false);
        };
        loadTimesheets();
    }, [itemsPerPage]);

    const filteredTimesheets = timesheets.filter((t) => {
        const isStatusMatch = statusFilter === "All" || t.status === statusFilter;

        const isWeekMatch = weekFilter ? t.week === weekFilter : true;

        return isStatusMatch && isWeekMatch;
    });


    useEffect(() => {
        setTotalPages(Math.ceil(filteredTimesheets.length / itemsPerPage));
    }, [filteredTimesheets, itemsPerPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleWeekFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setWeekFilter(parseInt(e.target.value) || null); // Set selected week or null if "All Weeks"
        setCurrentPage(1);
    };

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentWeeks = filteredTimesheets.slice(indexOfFirst, indexOfLast);

    const handleRowClick = async (weekData: any) => {
        try {
            setLoading(true);

            const result = await fetchWeeklyTimesheet(weekData.week);

            if (result.success && result.data) {

                setSelectedWeek({
                    ...weekData,
                    dates: result.data.dates,
                });
            } else {
                console.error("No data found for this week");
            }
        } catch (error) {
            console.error("Error fetching weekly data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center w-full bg-gray-50 font-sans">
            <div className="w-full max-w-7xl p-6">
                <header className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        <div className="text-xl font-extrabold text-gray-900">ticktock</div>
                        <div className="text-gray-600 font-medium">Timesheets</div>
                    </div>
                    <div className="text-sm text-gray-700 flex items-center">
                        John Doe
                        <span className="ml-2 w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                    </div>
                </header>
                {!selectedWeek ? (
                    <div className="w-full max-w-5xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Your Timesheets</h1>

                        <div className="flex space-x-4 mb-6">
                            <select
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                value={weekFilter || "All Weeks"}
                                onChange={handleWeekFilterChange}
                            >
                                <option value="All Weeks">All Weeks</option>
                                {Array.from({ length: 10 }, (_, index) => index + 1).map((week) => (
                                    <option key={week} value={week}>
                                        Week {week}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                            >
                                <option value="All">All Statuses</option>
                                <option value="Completed">Completed</option>
                                <option value="Incomplete">Incomplete</option>
                                <option value="Missing">Missing</option>
                            </select>
                        </div>

                        <div className="overflow-x-auto min-w-full">

                            <Table
                                timesheets={currentWeeks}
                                loading={loading}
                                handleActionClick={(week) => {
                                    const weekData = timesheets.find((w) => w.week === week);
                                    if (weekData) handleRowClick(weekData);
                                }}
                            />

                        </div>
                        <div className="flex items-center justify-between border-gray-200 mt-6">
                            <div className="flex items-center space-x-2">
                                <select className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50" onChange={e => setItemsPerPage(parseInt(e.target.value))}>
                                    <option className='' value={5}>5 per page</option>
                                    <option className='' value={10}>10 per page</option>
                                </select>
                            </div>
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        </div>
                    </div>
                ) : (
                    <div>
                        <Timesheet
                            tasks={selectedWeek}
                        />
                    </div>
                )}

                <div className="w-full max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg text-center text-sm text-gray-600">
                    <p>© 2024 tentwenty. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default TimesheetsDashboard;
