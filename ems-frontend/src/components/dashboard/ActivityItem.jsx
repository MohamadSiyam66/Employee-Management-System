const ActivityItem = ({ activity }) => {
        // Function to determine status color
        const getStatusColor = (status) => {
            switch (status) {
                case 'approved': return 'text-green-600 bg-green-100';
                case 'pending': return 'text-yellow-600 bg-yellow-100';
                case 'rejected': return 'text-red-600 bg-red-100';
                case 'present': return 'text-blue-600 bg-blue-100';
                case 'completed': return 'text-green-600 bg-green-100';
                case 'in_progress': return 'text-blue-600 bg-blue-100';
                default: return 'text-gray-600 bg-gray-100';
            }
        };

        const Icon = activity.icon;

        return (
            <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Icon size={16} className="text-gray-600" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                    <div className="flex items-center mt-2 space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                            {activity.status}
                        </span>
                        <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                </div>
            </div>
        );
    };
    
export default ActivityItem;