import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

const CreateButton = ({ hrefLink }: { hrefLink: string }) => {
    return (
        <Link
            href={hrefLink}
            className="bg-blue-600 rounded flex h-9 w-14 text-white justify-center items-center hover:bg-blue-700"
        >
            {/* <PlusIcon className="h-5 w-5" /> */}
            <p className="text-sm font-semibold antialiased">New</p>
        </Link>
    );
};

export default CreateButton;
