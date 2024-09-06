import LoginForm from "@/app/ui/login-form";
import Link from "next/link";

const Page = () => {
    return (
        <div className="bg-slate-100/10 h-screen items-center flex justify-center">
            <div>
                <div className="text-center">
                    <h1 className="text-3xl font-medium">
                        Welcome Back to Budgeting.
                    </h1>
                    <p className="text-gray-500 mt-3 mb-6 text-sm font-light">
                        Please enter your email and password to continue.
                    </p>
                </div>
                <LoginForm />
                <p className="text-sm my-6 text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-gray-900 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Page;
