"use client";
import { signIn } from "next-auth/react";
const SignInButton = () => {
    return (
        <button
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            onClick={() => signIn()}
        >
            Sign In
        </button>
    );
};

export default SignInButton;
