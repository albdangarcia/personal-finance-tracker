export default function BudgetCard({category, allocation}: {category: string, allocation: number}) {
  return (
    <div className="bg-white shadow-sm rounded p-4">
      <h1 className="font-medium">Category</h1>
      <h4>budget</h4>
      <div>bar</div>
    </div>
  );
}
