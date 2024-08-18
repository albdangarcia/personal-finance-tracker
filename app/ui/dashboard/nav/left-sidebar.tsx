import NavLinks from "./nav-links";

const LeftSidebar = () => {
    return (
        <div className="antialiased px-6 overflow-auto gap-y-5 flex-col flex-grow flex">
            {/* user image */}
            <div className="mt-3 items-center flex-shrink-0 h-16 flex gap-x-3">
                <div className="w-9 h-9 rounded-full bg-gray-200" />
                <div className="text-sm flex-col flex font-medium">
                    <span className="text-gray-400">Welcome</span>
                    <span className="text-gray-800">UserName</span>
                </div>
            </div>
            {/* nav links */}
            <NavLinks />
        </div>
    );
};

export default LeftSidebar;