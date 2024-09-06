import { ReactNode } from "react";
import LeftSidebar from "../ui/nav/left-sidebar";
import TopNavBar from "../ui/nav/top-nav-bar";
import { auth } from "@/auth";

interface ChildrenProps {
    children: ReactNode;
}

// Access Denied component
const AcessDenied = () => {
    return (
        <div className="h-screen flex items-center justify-center">
            <div>Access Denied</div>
        </div>
    );
};

const DashboardLayout = ({ children }: ChildrenProps) => {
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

const Page = async ({ children }: ChildrenProps) => {
    const session = await auth();

    if (!session) {
        return <AcessDenied />;
    } else {
        return <DashboardLayout>{children}</DashboardLayout>;
    }
};

export default Page;
