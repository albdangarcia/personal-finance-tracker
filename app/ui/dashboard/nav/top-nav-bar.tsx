"use client";
import {
    Bars3Icon,
    BriefcaseIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import clsx from "clsx";
import LeftSidebar from "./left-sidebar";

const TopNavBar = () => {
    let [isOpen, setIsOpen] = useState(false);
    return (
        <div className="py-4 bg-white gap-x-6 items-center flex z-40 top-0 sticky px-3 sm:pl-6 shadow-sm lg:hidden">
            {/* stack button */}
            <button className="p-2.5 -m-2.5" onClick={() => setIsOpen(true)}>
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="w-6 h-6" />
            </button>
            {/* current page name */}
            <div className="font-semibold text-sm/6 flex-1">
                Dashboard
            </div>
            {/* app logo */}
            <div className="flex gap-x-1 items-center text-indigo-500">
                <BriefcaseIcon className="w-5 h-5" />
                <span className="font-medium text-sm">Budget App</span>
            </div>

            {/* left nav dialog  */}
            <div>
                <Dialog
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    className="relative z-50"
                >
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-black/30 duration-300 ease-linear data-[closed]:opacity-0"
                    />
                    <div className="fixed inset-0 flex w-screen">
                        <DialogPanel
                            transition
                            className={clsx(
                                "flex flex-1 max-w-80 w-full mr-16 relative bg-white duration-300",
                                isOpen ? "open-dialog" : "close-dialog"
                            )}
                        >
                            {/* close button */}
                            <div className="pt-5 justify-center w-16 flex top-0 left-full absolute">
                                <button onClick={() => setIsOpen(false)}>
                                    <XMarkIcon className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            {/* left navigation */}
                            <LeftSidebar />
                        </DialogPanel>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default TopNavBar;
