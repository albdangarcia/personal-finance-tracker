import { Info } from "lucide-react";
import { IconBrandGithub } from "@tabler/icons-react";

const GITHUB_REPO_URL = "https://github.com/albdangarcia/personal-finance-tracker";

const DemoBanner = () => {
  return (
    <div
      role="alert"
      className="w-full border-b bg-card p-3 text-card-foreground"
    >
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 sm:flex-row">
        {/* Message Content */}
        <div className="flex items-center gap-3 text-sm">
          <Info className="h-5 w-5 flex-shrink-0" />
          <div className="text-center sm:text-left">
            <p className="font-semibold">Heads Up!</p>
            <p className="text-muted-foreground">
              This is a portfolio demo. Data is for demonstration purposes only.
            </p>
          </div>
        </div>

        {/* GitHub Button */}
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto bg-black text-white rounded text-xs flex items-center justify-center whitespace-nowrap px-4 py-2"
        >
          <IconBrandGithub className="h-4 w-4 mr-2" />
          View on GitHub
        </a>
      </div>
    </div>
  );
};

export default DemoBanner;
