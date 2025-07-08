import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useScoring, riskVectors, RiskWeights } from '@/hooks/useScoring';

export default function ScoringPage() {
  const [searchParams] = useSearchParams();
  const target = searchParams.get('target') || '';

  const { scoringParams, saveScoringParams } = useScoring();

  const [currentWeights, setCurrentWeights] = useState<RiskWeights>(scoringParams.riskWeights);
  const [currentHeuristics, setCurrentHeuristics] = useState(scoringParams.advancedHeuristics);

  const handleWeightChange = (id: string) => (value: number[]) => {
    setCurrentWeights(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = () => {
    saveScoringParams({
      riskWeights: currentWeights,
      advancedHeuristics: currentHeuristics,
    });
    toast.success('Scoring parameters saved successfully!');
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Adjust Scoring</CardTitle>
            <CardDescription>Fine-tune the risk calculation parameters.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Risk Vector Weights</h3>
                <p className="text-sm text-muted-foreground">
                  Adjust the importance of each risk vector in the overall score calculation.
                </p>
                <div className="space-y-6 pt-4">
                  {riskVectors.map((vector) => (
                    <div key={vector.id} className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <Label htmlFor={vector.id} className="md:col-span-1">{vector.name}</Label>
                      <div className="md:col-span-3 flex items-center gap-4">
                         <Slider
                          id={vector.id}
                          value={currentWeights[vector.id]}
                          onValueChange={handleWeightChange(vector.id)}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <span className="w-12 text-right font-mono text-sm text-muted-foreground">{currentWeights[vector.id][0]}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-lg font-medium">Advanced Settings</h3>
                 <div className="flex items-center justify-between rounded-lg border p-4 mt-2">
                    <div>
                        <Label htmlFor="advanced-heuristics" className="font-semibold">Enable Advanced Heuristics</Label>
                        <p className="text-sm text-muted-foreground pt-1">
                            Use machine learning models for more accurate risk detection.
                        </p>
                    </div>
                    <Switch 
                        id="advanced-heuristics"
                        checked={currentHeuristics}
                        onCheckedChange={setCurrentHeuristics}
                    />
                 </div>
              </div>

            </div>
            <Button className="mt-8 w-full sm:w-auto" onClick={handleSaveChanges}>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
