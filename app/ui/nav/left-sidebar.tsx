import { UserCircleIcon } from "@heroicons/react/24/outline";
import NavLinks from "./nav-links";

const LeftSidebar = () => {
    return (
        <div className="antialiased px-6 overflow-auto gap-y-5 flex-col flex-grow flex bg-[#fcfdff]">
            {/* user image */}
            <div className="mt-3 border-b items-center flex-shrink-0 h-16 flex gap-x-4">
                <div className="w-9 h-9 rounded-full bg-indigo-100 items-center flex justify-center">
                    <UserCircleIcon className="w-7 h-7 text-indigo-400" />
                </div>
                <div className="text-xs flex-col flex font-medium">
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