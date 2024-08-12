import Link from "next/link";

export default function FormButtons({ redirectTo }: { redirectTo: string }) {
  const buttonStyle =
    "rounded-lg text-sm h-full items-center justify-center inline-flex bg-indigo-600 text-white px-3 py-2 hover:bg-indigo-500";
  return (
    <div className="flex gap-x-2 pt-3 border-t">
      <button className={buttonStyle} type="submit">
        Save
      </button>
      <Link href={redirectTo} className={buttonStyle}>
        Cancel
      </Link>
    </div>
  );
}
