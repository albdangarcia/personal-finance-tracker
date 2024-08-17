import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type Props = {
    editLink: string;
    propName: string;
    propId: string;
    open: (propName: string, propId: string) => void;
};

const EditDeleteButtons = ({ editLink, propName, propId, open }: Props) => {
    return (
        <div className="flex justify-center gap-x-5">
            <Link
                href={editLink}
                className="items-center justify-center inline-flex"
            >
                <PencilSquareIcon className="h-5 w-5 text-gray-500 hover:text-gray-800" />
            </Link>
            <button
                onClick={() =>
                    open(propName, propId)
                }
                className="items-center justify-center inline-flex"
            >
                <TrashIcon className="h-5 w-5 text-gray-500 hover:text-gray-800" />
            </button>
        </div>
    );
};

export default EditDeleteButtons;