import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

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
        <Dialog
            open={isOpen}
            as="div"
            className="relative z-10 focus:outline-none"
            onClose={close}
        >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-gradient-to-b from-black/10 to-black/50">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="text-gray-900 w-full max-w-md rounded-xl bg-white p-6 duration-300 ease-out transform data-[closed]:scale-95 data-[closed]:opacity-0"
                    >
                        <DialogTitle
                            as="h3"
                            className="text-base/7 font-medium"
                        >
                            Delete {title}
                        </DialogTitle>
                        <p className="mt-2 text-sm/6 text-gray-600">
                            Are you sure you want to delete the {title} for{" "}
                            <span className="text-black">{itemName}</span>?
                            {warnings && (
                                <span className="block mt-2 text-xs/6 text-red-600">
                                    {warnings}
                                </span>
                            )}
                        </p>
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
            </div>
        </Dialog>
    );
};

export default DialogComponent;
