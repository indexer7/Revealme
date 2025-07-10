import { Radar, RadarChart as RC, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RadarData {
  category: string;
  value: number;
}

export default function RadarChart({ data }: { data: RadarData[] }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RC outerRadius={90} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis />
          <Radar 
            dataKey="value" 
            stroke="#2563eb" 
            fill="#93c5fd" 
            fillOpacity={0.6} 
          />
        </RC>
      </ResponsiveContainer>
    </div>
  );
} 