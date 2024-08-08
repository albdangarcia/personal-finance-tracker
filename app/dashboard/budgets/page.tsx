import BudgetCard from '@/app/ui/budgets/budget-card';
export default function Page() {
  return (
  <div>
    <h2>show all budgets</h2>
    <div className='grid grid-cols-3 gap-3 p-3'>
      <BudgetCard category="Food" allocation={100} />
      <BudgetCard category="Food" allocation={100} />
      <BudgetCard category="Food" allocation={100} />
      <BudgetCard category="Food" allocation={100} />
    </div>
  </div>
)}
