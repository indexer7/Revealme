interface SummaryItem {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export default function SummaryCards({ items }: { items: SummaryItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-1">{item.title}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            {item.change && (
              <span className={`ml-2 text-sm font-medium ${
                item.changeType === 'positive' ? 'text-green-600' :
                item.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {item.change}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 