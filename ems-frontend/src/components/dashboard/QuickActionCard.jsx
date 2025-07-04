const QuickActionCard = ({ title, description, icon: Icon, color, onClick, href }) => {
    const handleClick = () => {
        if (href) {
            window.location.href = href;
        } else if (onClick) {
            onClick();
        }
    };

    return (
        <button
            onClick={handleClick}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:scale-105 text-left"
        >
            <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
                <Icon size={24} className="text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </button>
    );
};
    
export default QuickActionCard;