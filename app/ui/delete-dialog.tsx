import {
    Button,
    Description,
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";

type Props = {
    isOpen: boolean;
    close: () => void;
    title: string;
    itemName: string;
    handleDelete: () => void;
    warnings?: string;
};

const DialogComponent = ({
    isOpen,
    close,
    title,
    itemName,
    handleDelete,
    warnings,
}: Props) => {
    return (
        <Dialog open={isOpen} onClose={close} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0"
            />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel
                    transition
                    className="rounded text-gray-800 max-w-lg space-y-4 bg-white p-9 duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                    <DialogTitle className="font-medium">
                        Delete {title}
                    </DialogTitle>
                    <Description>
                        <span className="text-sm block">
                            Are you sure you want to delete the {title} for{" "}
                            <span className="text-black">{itemName}</span>?
                        </span>
                        {warnings && (
                            <span className="block mt-2 text-xs/6 text-red-600">
                                {warnings}
                            </span>
                        )}
                    </Description>
                    <div className="mt-4 flex gap-x-2 border-t pt-4">
                        <Button
                            className="inline-flex items-center gap-2 rounded-md bg-black py-1.5 px-3 text-sm/6 font-semibold text-white shadow-white/10 focus:outline-none data-[hover]:bg-gray-800 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                            onClick={close}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="inline-flex items-center gap-2 rounded-md bg-red-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default DialogComponent;
