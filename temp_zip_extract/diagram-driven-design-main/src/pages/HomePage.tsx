import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const [target, setTarget] = useState('');
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    if (target) {
      navigate(`/assessment?target=${encodeURIComponent(target)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Exposure Assessment</CardTitle>
          <CardDescription>
            Begin your assessment by specifying a domain or email target.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target-input">Domain or Email Target</Label>
              <Input
                id="target-input"
                type="text"
                placeholder="e.g., example.com or user@example.com"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleStartAssessment()}
              />
            </div>
            <Button onClick={handleStartAssessment} className="w-full" disabled={!target.trim()}>
              Start Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
      <p className="mt-6 text-sm text-center text-muted-foreground">
        Use the sidebar to navigate between pages.
      </p>
    </div>
  );
}
