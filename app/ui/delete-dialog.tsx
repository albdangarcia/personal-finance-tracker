import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { deleteBudget } from "@/app/lib/actions/budget";

export default function DeleteDialog({
  budgetId,
  category,
  isOpen,
  close,
  title,
  description,
}: {
  budgetId: string;
  category: string;
  isOpen: boolean;
  close: () => void;
  title: string;
  description: string;
}) {
  // Handle delete budget
  const handleDeleteBudget = async () => {
    try {
      await deleteBudget(budgetId);
      close();
    } catch (error) {
      console.error("Failed to delete budget:", error);
      throw new Error("Failed to delete budget");
    }
  };
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={close}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-black/25 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
              {title}
            </DialogTitle>
            <p className="mt-2 text-sm/6 text-white/80">
              {description} {category}?
            </p>
            <div className="mt-4 flex gap-x-2">
              <Button
                className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                onClick={close}
              >
                Cancel
              </Button>
              <Button
                className="inline-flex items-center gap-2 rounded-md bg-red-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                onClick={handleDeleteBudget}
              >
                Delete
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
