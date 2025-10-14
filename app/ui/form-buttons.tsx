"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";

const FormButtons = ({ redirectTo }: { redirectTo: string }) => {
    const { pending } = useFormStatus();
    
    const buttonStyle =
        "rounded-md text-sm h-full items-center justify-center inline-flex bg-indigo-600 text-white px-3 py-2 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";
    
    return (
        <div className="flex gap-x-2 pt-3 border-t font-medium">
            <button 
                className={buttonStyle} 
                type="submit"
                disabled={pending}
            >
                {pending ? "Saving..." : "Save"}
            </button>
            <Link 
                href={redirectTo} 
                className={buttonStyle}
                aria-disabled={pending}
                style={{ pointerEvents: pending ? "none" : "auto" }}
            >
                Cancel
            </Link>
        </div>
    );
};

export default FormButtons;