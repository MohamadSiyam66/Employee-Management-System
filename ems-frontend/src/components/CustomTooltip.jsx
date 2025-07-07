import { Info } from 'lucide-react';

const CustomTooltip = ({ children, content, isVisible, position = 'top' }) => {
    const positionClasses = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };

    const arrowClasses = {
        top: 'top-full left-1/2 transform -translate-x-1/2 border-t-blue-600',
        bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-blue-600',
        left: 'left-full top-1/2 transform -translate-y-1/2 border-l-blue-600',
        right: 'right-full top-1/2 transform -translate-y-1/2 border-r-blue-600'
    };

    return (
        <div className="relative inline-block w-full">
            {children}
            
            {isVisible && (
                <div className={`absolute z-50 ${positionClasses[position]} animate-fadeIn`}>
                    <div className="bg-blue-600 text-white text-sm px-3 py-2 rounded-lg shadow-xl max-w-xs whitespace-nowrap border border-blue-500">
                        <div className="flex items-center gap-2">
                            <Info size={14} className="text-blue-200" />
                            {content}
                        </div>
                        <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`}></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomTooltip; 