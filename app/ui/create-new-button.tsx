import Link from "next/link";

const CreateButton = ({ hrefLink }: { hrefLink: string }) => {
    return (
        <Link
            href={hrefLink}
            className="bg-blue-600 rounded flex h-9 w-14 text-white justify-center items-center hover:bg-blue-700"
        >
            <p className="text-sm font-semibold antialiased">New</p>
        </Link>
    );
};

export default CreateButton;
