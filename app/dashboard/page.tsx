import Breadcrumbs from "../ui/breadcrumbs";

const breadcrumbs = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
];

export default function Page() {
    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            Dashboard content
        </div>
    )
}