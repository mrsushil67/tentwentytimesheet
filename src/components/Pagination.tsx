import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5;

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (startPage > 1) pageNumbers.unshift('...');
    if (endPage < totalPages) pageNumbers.push('...');

    return pageNumbers;
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden divide-x divide-gray-300">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 hover:bg-gray-100 text-sm text-gray-400"
      >
        Previous
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          className={`px-4 py-2 text-sm ${
            typeof page === 'number'
              ? currentPage === page
                ? 'bg-gray-100 text-blue-600'
                : 'text-gray-700'
              : 'text-gray-400'
          } cursor-pointer`}
          disabled={typeof page === 'string'}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 hover:bg-gray-100 text-sm text-gray-400"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
