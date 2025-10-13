import clsx from "clsx";

interface Props {
    title: string;
    total: number;
    percentageChange: number;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const TotalAmountCard = ({ title, total, percentageChange, icon }: Props) => {
    const Icon = icon;
    return (
        <div className="antialiased bg-white border border-gray-200 rounded-md shadow-xs p-8">
            <div>
                <div className="mb-7">
                    <Icon className="w-7 h-7 text-gray-400" />
                </div>
                <div>
                    <h5 className="text-gray-400/90 text-sm font-medium my-2">
                        {title}
                    </h5>
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-gray-400 text-2xl">$</span>
                            <span className="font-medium text-3xl">
                                {total.toLocaleString()}
                            </span>
                        </div>
                        <div
                            className={clsx(
                                "bg-green-200 font-medium text-xs rounded-sm py-0.5 px-1.5",
                                percentageChange < 0
                                    ? "bg-red-200 text-red-700"
                                    : "bg-green-200 text-green-700"
                            )}
                            data-testid="percentage-change"
                        >
                            {percentageChange > 0 ? "+" : ""}{percentageChange}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalAmountCard;
