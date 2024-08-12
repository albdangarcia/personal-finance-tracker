import { z } from "zod";

// error state for budget form
export type BudgetFormErrorState = {
  errors?: {
    categoryId?: string[];
    amount?: string[];
  };
  message?: string | null;
};

// schema for budget form
export const BudgetSchema = z.object({
  categoryId: z.string().min(1),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
});
