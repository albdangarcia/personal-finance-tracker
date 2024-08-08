import { z } from "zod";
import { Frequency } from "@prisma/client";

export type BudgetFormErrorState = {
  errors?: {
    frequency?: string[];
    allocation?: string[];
  };
  message?: string | null;
};

export const BudgetSchema = z.object({
  frequency: z.enum([Frequency.WEEKLY, Frequency.BIWEEKLY, Frequency.MONTHLY]),
  allocation: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
});
