import { UserCircleIcon } from "@heroicons/react/24/outline";
import NavLinks from "./nav-links";

interface Props {
    userName: string;
    userImage: string | null;
}

const LeftSidebar = ({ userName, userImage }: Props) => {
    return (
        <div className="antialiased px-6 overflow-auto gap-y-5 flex-col flex-grow flex bg-[#fcfdff]">
            <div className="mt-3 border-b items-center flex-shrink-0 h-16 flex gap-x-4">
                {/* user image */}
                <div className="w-9 h-9 rounded-full bg-indigo-100 items-center flex justify-center">
                    {userImage ? (
                        <img
                            src={userImage}
                            alt="user"
                            className="w-9 h-9 rounded-full ring-2 ring-green-500"
                        />
                    ) : (
                        <UserCircleIcon className="w-7 h-7 text-indigo-400" />
                    )}
                </div>
                {/* user name */}
                <div className="text-xs flex-col flex font-medium">
                    <span className="text-gray-400">Welcome Back!</span>
                    <span className="text-gray-800">{userName}</span>
                </div>
            </div>
            {/* nav links */}
            <NavLinks />
        </div>
    );
};

export default LeftSidebar;
