import { ReactNode } from "react";
import CreateButton from "./create-new-button";

// Main component
const SectionWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <div className="antialiased mt-6 bg-white border border-gray-200 rounded-md shadow-sm pb-4 pt-10 px-8">
            {children}
        </div>
    );
};

type SectionHeaderProps = {
    title: string;
    subtitle: string;
    buttonLink?: string;
};
// Sub-component: Header
const SectionHeader = ({ title, subtitle, buttonLink }: SectionHeaderProps) => {
    return (
        <div className="flex justify-between">
            <div>
                <h4 className="font-medium">{title}</h4>
                <p className="mt-2 mb-5 text-sm text-gray-500">{subtitle}</p>
            </div>
            {buttonLink && (
                <CreateButton hrefLink={buttonLink} />
            )}
        </div>
    );
};

export { SectionWrapper, SectionHeader };
