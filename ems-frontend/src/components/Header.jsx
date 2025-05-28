import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <header>
            <div className="flex flex-row justify-between items-center bg-white p-2 sticky top-0 z-50">
                <h1 className="text-2xl text-cyan-600 font-bold">
                    Rubaai - Employee Management System
                </h1>
                <button
                    className=" bg-red-500 text-white font-bold p-2 rounded-xl hover:bg-red-600"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
