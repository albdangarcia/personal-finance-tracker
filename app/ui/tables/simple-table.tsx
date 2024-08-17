import React, { ReactNode } from "react";

type ColumnProps = {
    children: ReactNode;
    columns: string;
};

// Main component
const Table = ({ children }: { children: ReactNode }) => {
    return <div className="text-sm">{children}</div>;
};

// Sub-component: Header
const TableHeader = ({ children, columns }: ColumnProps) => {
    const className = `border-b gap-4 px-3 py-4 font-medium grid ${columns}`;
    return (
        <div
            className={className}
        >
            {children}
        </div>
    );
};

// Sub-component: Contents
const TableContents = ({ children }: { children: ReactNode }) => {
    return <div className="[&>div:not(:last-child)]:border-b">{children}</div>;
};

// Sub-component: ContentRow
const TableRow = ({ children, columns }: ColumnProps) => {
    const className = `items-center gap-4 px-3 py-2.5 text-gray-900 hover:bg-gray-100/50 grid ${columns}`;
    return (
        <div
            className={className}
        >
            {children}
        </div>
    );
};

export { Table, TableHeader, TableContents, TableRow };
