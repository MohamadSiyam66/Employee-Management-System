import { X } from 'lucide-react';

const FilterControls = ({ filters, filterConfig, onChange }) => {
    const handleFilterChange = (key, value) => {
        onChange({ ...filters, [key]: value });
    };

    const clearFilter = (key) => {
        const newFilters = { ...filters };
        delete newFilters[key];
        onChange(newFilters);
    };

    const clearAllFilters = () => {
        onChange({});
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== null && value !== undefined);

    return (
        <div className="space-y-4">
            {/* Filter Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(filterConfig).map(([key, config]) => (
                    <div key={key} className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {config.label || key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        
                        {config.type === 'text' && (
                            <input
                                type="text"
                                value={filters[key] || ''}
                                onChange={(e) => handleFilterChange(key, e.target.value)}
                                placeholder={config.placeholder || `Enter ${key}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        )}
                        
                        {config.type === 'date' && (
                            <input
                                type="date"
                                value={filters[key] || ''}
                                onChange={(e) => handleFilterChange(key, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        )}
                        
                        {config.type === 'select' && (
                            <select
                                value={filters[key] || ''}
                                onChange={(e) => handleFilterChange(key, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {config.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                        
                        {filters[key] && (
                            <button
                                onClick={() => clearFilter(key)}
                                className="absolute right-2 top-8 text-gray-400 hover:text-gray-600"
                                title="Clear filter"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Clear All Filters Button */}
            {hasActiveFilters && (
                <div className="flex justify-end">
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                    >
                        <X size={14} />
                        Clear all filters
                    </button>
                </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                        if (!value) return null;
                        
                        const config = filterConfig[key];
                        let displayValue = value;
                        
                        if (config?.type === 'select') {
                            const option = config.options.find(opt => opt.value === value);
                            displayValue = option?.label || value;
                        }
                        
                        return (
                            <span
                                key={key}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                                {config?.label || key}: {displayValue}
                                <button
                                    onClick={() => clearFilter(key)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FilterControls; 