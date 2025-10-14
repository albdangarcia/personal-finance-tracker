import LoginForm from "@/app/ui/login-form";
import Link from "next/link";
import { providerMap } from "@/auth";
import LoginProviderForm from "../ui/provider-form";
import { AlertTriangle } from "lucide-react";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const Page = async ({ searchParams }: Props) => {
    const { error } = await searchParams;

    return (
        <div className="bg-slate-100/10 h-screen items-center flex justify-center mx-4">
            <div>
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-medium">
                        Welcome Back to Budgeting.
                    </h1>
                    <p className="text-gray-500 mt-3 mb-6 text-sm font-light">
                        Please enter your email and password to continue.
                    </p>
                </div>

                {error === "EmailExists" && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 flex items-center">
                        <AlertTriangle className="mr-3 h-5 w-5" />
                        <div>
                            An account with this email already exists. Please
                            sign in with your original method.
                        </div>
                    </div>
                )}

                {/* Credentials log in */}
                <LoginForm />

                {/* Providers list */}
                { providerMap && Object.keys(providerMap).length > 0 && (
                    <LoginProviderForm providers={providerMap} />
                )}

                {/* Sign up link */}
                <p className="text-sm my-6 text-center text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-gray-900 hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Page;
