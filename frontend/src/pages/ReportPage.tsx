import React from "react";
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';

export default function ReportPage() {
  const [searchParams] = useSearchParams();
  const target = searchParams.get('target') || '';

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>Generating report for: <span className="font-semibold text-primary">{target}</span></CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is where the report generation functionality would be.</p>
            <p className="text-muted-foreground mt-4">For now, it's just a placeholder.</p>
             <Button className="mt-6">Download PDF</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
