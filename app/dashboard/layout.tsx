import { ReactNode } from "react";
import LeftSidebar from "../ui/nav/left-sidebar";
import TopNavBar from "../ui/nav/top-nav-bar";

type Props = { children: ReactNode };

const DashboardLayout = ({ children }: Props) => {
    return (
        <div className="min-h-screen">
            {/* left side bar */}
            <div className="hidden border-r z-50 flex-col bg-white w-72 lg:z-50 lg:inset-y-0 lg:fixed lg:flex">
                <LeftSidebar />
            </div>

            {/* top nav bar */}
            <TopNavBar />

            {/* right content */}
            <main className="pb-10 pt-7 lg:pl-72">
                <div className="px-2 sm:px-6 lg:px-8">{children}</div>
            </main>
        </div>
    );
};

export default DashboardLayout;
