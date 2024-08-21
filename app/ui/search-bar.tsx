"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const SearchBar = ({ placeholder }: { placeholder: string }) => {
    // Hook to get the current URL search parameters
    const searchParams = useSearchParams();
    
    // Hook to get the current pathname
    const pathname = usePathname();

    // Destructure the replace function from the useRouter hook
    const { replace } = useRouter();

    // use-debounce to delay the execution of the function after the user stops typing
    const handleSearch = useDebouncedCallback((term) => {
        // get url params
        const params = new URLSearchParams(searchParams);

        // when the user types a new search query, reset the page number to 1.
        params.set("page", "1");

        // if the search term is not empty, add it to the url
        if (term) {
            params.set("query", term);
        } else {
            // if the search term is empty, remove the query parameter from the url
            params.delete("query");
        }

        // update the url
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);

    return (
        <div className="relative">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <input
                className="group block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-400/70"
                placeholder={placeholder}
                id="search"
                name="search"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("query")?.toString()}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 group-focus:text-gray-900" />
        </div>
    );
}

export default SearchBar;
