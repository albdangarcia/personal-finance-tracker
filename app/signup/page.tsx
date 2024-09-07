import SignupForm from "@/app/ui/signup-form";
import Link from "next/link";

const Page = () => {
    return (
        <div className="bg-slate-100/10 h-screen items-center flex justify-center">
            <div>
                <div className="text-center">
                    <h1 className="text-3xl font-medium">
                        Create Your Budgeting Account
                    </h1>
                    <p className="text-gray-500 mt-3 mb-6 text-sm font-light">
                        Sign up to start managing your finances.
                    </p>
                </div>
                <SignupForm />
                <p className="text-sm my-6 text-center text-gray-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-gray-900 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Page;
