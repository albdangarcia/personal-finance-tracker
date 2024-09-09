import { ReactNode } from "react";
import LeftSidebar from "../ui/nav/left-sidebar";
import TopNavBar from "../ui/nav/floating-nav";
import { auth } from "@/auth";

interface ChildrenProps {
    children: ReactNode;
}

// Access Denied component
const AcessDenied = () => {
    return (
        <div className="antialiased h-screen tracking-wide flex items-center justify-center">
            <h1 className="font-medium">403 - Forbidden</h1>
            <div className="border-l py-5 mx-3 h-4 border-gray-300"></div>
            <p>You do not have access to this page.</p>
        </div>
    );
};

const DashboardLayout = async ({ children }: ChildrenProps) => {
    // Get user session
    const session = await auth();
    
    // Get user name and image
    const userName = session?.user?.name ?? "None";
    const userImage = session?.user?.image ?? null;
    
    return (
        <div className="min-h-screen">
            {/* left side bar */}
            <div className="hidden border-r z-50 flex-col bg-white w-72 lg:z-50 lg:inset-y-0 lg:fixed lg:flex">
                <LeftSidebar userName={userName} userImage={userImage} />
            </div>

            {/* top nav bar */}
            <TopNavBar userName={userName} userImage={userImage} />

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
