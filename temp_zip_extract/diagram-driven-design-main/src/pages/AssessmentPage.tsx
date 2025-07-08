import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { useScoring } from '@/hooks/useScoring';

// This data represents the raw findings from a hypothetical scan.
const baseRiskData = [
  { id: 'phishing', name: 'Phishing', risk: 80 },
  { id: 'malware', name: 'Malware', risk: 65 },
  { id: 'dataBreach', name: 'Data Breach', risk: 90 },
  { id: 'insiderThreat', name: 'Insider Threat', risk: 40 },
  { id: 'credentialStuffing', name: 'Credential Stuffing', risk: 75 },
];

export default function AssessmentPage() {
  const [searchParams] = useSearchParams();
  const target = searchParams.get('target');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const { scoringParams } = useScoring();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) {
          clearInterval(timer);
          setLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 250);

    return () => {
      clearInterval(timer);
    };
  }, []);
  
  // Calculate dynamic results based on scoring parameters
  const { riskWeights, advancedHeuristics } = scoringParams;

  const chartData = baseRiskData.map(vector => {
    const weight = riskWeights[vector.id] ? riskWeights[vector.id][0] : 0;
    const weightedRisk = Math.round(vector.risk * (weight / 100));
    return { name: vector.name, risk: weightedRisk };
  });

  const totalWeightedRisk = chartData.reduce((acc, item) => acc + item.risk, 0);
  const heuristicMultiplier = advancedHeuristics ? 1.1 : 1.0;
  const overallScore = chartData.length > 0 ? Math.min(100, Math.round((totalWeightedRisk / chartData.length) * heuristicMultiplier)) : 0;
  
  const getRiskLevel = (score: number) => {
    if (score > 75) return { level: 'High', color: 'text-destructive' };
    if (score > 40) return { level: 'Medium', color: 'text-orange-500' };
    return { level: 'Low', color: 'text-green-500' };
  };

  const { level: riskLevel, color: riskColor } = getRiskLevel(overallScore);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <CardTitle>Assessment in Progress</CardTitle>
            <CardDescription>Analyzing exposure for: {target}</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-4">Collecting and analyzing data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Exposure Assessment Report</h1>
          <p className="text-muted-foreground">Results for: <span className="font-semibold text-primary">{target}</span></p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>OES Score</CardTitle>
              <CardDescription>Overall Exposure Score</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold">{overallScore} <span className="text-2xl text-muted-foreground">/ 100</span></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Risk Level</CardTitle>
              <CardDescription>Calculated risk level</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`text-5xl font-bold ${riskColor}`}>{riskLevel}</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Analysis Details</CardTitle>
              <CardDescription>Review raw scan data</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
               <Button asChild className="w-full">
                <Link to={`/scan-status?target=${encodeURIComponent(target || '')}`}>View Scan Status</Link>
               </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Risk Breakdown</CardTitle>
            <CardDescription>Identified risk vectors and their severity based on your scoring.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="risk" fill="hsl(var(--destructive))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
