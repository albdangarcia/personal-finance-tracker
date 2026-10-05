import { DataByCategories } from "../interfaces";

type AmountByCategory = {
    categoryId: string;
    amount: number;
    category: { name: string };
};

export const groupAmountsByCategory = (
    items: AmountByCategory[]
): DataByCategories[] => {
    return items.reduce<DataByCategories[]>((groups, item) => {
        const existingCategory = groups.find(
            (group) => group.categoryId === item.categoryId
        );

        if (existingCategory) {
            existingCategory.totalAmount += item.amount;
        } else {
            groups.push({
                categoryId: item.categoryId,
                categoryName: item.category.name,
                totalAmount: item.amount,
            });
        }

        return groups;
    }, []);
};

export const sumAmountsForMonth = (
    amounts: { amount: number; yearMonth: string }[],
    yearMonth: string
): number =>
    amounts.reduce(
        (total, item) =>
            item.yearMonth === yearMonth ? total + item.amount : total,
        0
    );
