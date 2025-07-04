import React from 'react';
import { Download, Filter } from 'lucide-react';
import FilterControls from './FilterControls';
import DataTable from './DataTable';

const ReportSection = ({ 
    title, 
    loading, 
    data, 
    filters, 
    onFilterChange, 
    onExportPDF, 
    onExportExcel, 
    filterConfig, 
    columns 
}) => {
    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={onExportPDF}
                        className="bg-red-600 text-white py-2 px-2 sm:px-4 rounded-md hover:bg-red-700 flex items-center gap-1 sm:gap-2"
                        title="Export PDF"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">Export PDF</span>
                    </button>
                    <button
                        onClick={onExportExcel}
                        className="bg-green-600 text-white py-2 px-2 sm:px-4 rounded-md hover:bg-green-700 flex items-center gap-1 sm:gap-2"
                        title="Export Excel"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">Export Excel</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Filter size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Filters</span>
                </div>
                <FilterControls
                    filters={filters}
                    filterConfig={filterConfig}
                    onChange={onFilterChange}
                />
            </div>

            {/* Data Summary */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-800">
                        <strong>Total Records:</strong> {data.length}
                    </span>
                    {loading && (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm text-blue-600">Loading...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <DataTable
                    data={data}
                    columns={columns}
                    loading={loading}
                />
            </div>

            {/* Empty State */}
            {!loading && data.length === 0 && (
                <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                        <Filter size={48} className="mx-auto" />
                    </div>
                    <p className="text-gray-500">No data found for the selected filters.</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or date range.</p>
                </div>
            )}
        </div>
    );
};

export default ReportSection; 