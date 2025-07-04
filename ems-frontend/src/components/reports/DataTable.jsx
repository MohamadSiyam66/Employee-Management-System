import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const DataTable = ({ data, columns, loading, itemsPerPage = 10 }) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    // Handle page changes
    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const goToFirstPage = () => goToPage(1);
    const goToLastPage = () => goToPage(totalPages);
    const goToPreviousPage = () => goToPage(currentPage - 1);
    const goToNextPage = () => goToPage(currentPage + 1);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading data...</span>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            {/* Table */}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
                                    {column.render ? column.render(row) : row[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing{' '}
                                <span className="font-medium">{startIndex + 1}</span>
                                {' '}to{' '}
                                <span className="font-medium">{Math.min(endIndex, data.length)}</span>
                                {' '}of{' '}
                                <span className="font-medium">{data.length}</span>
                                {' '}results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={goToFirstPage}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">First</span>
                                    <ChevronsLeft size={16} />
                                </button>
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeft size={16} />
                                </button>
                                
                                {/* Page Numbers */}
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => goToPage(pageNum)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                currentPage === pageNum
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                
                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRight size={16} />
                                </button>
                                <button
                                    onClick={goToLastPage}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Last</span>
                                    <ChevronsRight size={16} />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable; 