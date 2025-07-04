import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, change, changeType, color, bgColor, subtitle }) => (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                    {change && (
                        <div className="flex items-center mt-2">
                            {changeType === 'increase' ? (
                                <ArrowUpRight size={16} className="text-green-500" />
                            ) : (
                                <ArrowDownRight size={16} className="text-red-500" />
                            )}
                            <span className={`text-sm font-medium ml-1 ${
                                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {change}
                            </span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${bgColor}`}>
                    <Icon size={24} className={color} />
                </div>
            </div>
        </div>
    );

    export default StatCard;