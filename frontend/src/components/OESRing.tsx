import { PieChart, Pie, Cell } from 'recharts';

export default function OESRing({ score }: { score: number }) {
  const data = [
    { name: 'Remaining', value: score }, 
    { name: 'Used', value: 100 - score }
  ];
  
  return (
    <div className="flex flex-col items-center">
      <PieChart width={200} height={200}>
        <Pie 
          data={data} 
          dataKey="value" 
          outerRadius={80} 
          innerRadius={60} 
          startAngle={90} 
          endAngle={-270}
        >
          {data.map((_, i) => (
            <Cell 
              key={i} 
              fill={i === 0 ? '#4ade80' : '#e5e7eb'} 
            />
          ))}
        </Pie>
      </PieChart>
      <div className="text-center mt-2">
        <div className="text-2xl font-bold text-gray-900">{score}</div>
        <div className="text-sm text-gray-600">OES Score</div>
      </div>
    </div>
  );
} 