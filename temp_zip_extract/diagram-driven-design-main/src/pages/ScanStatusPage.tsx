
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { osintTasks } from '@/data/tasks';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const statusIcons = {
  Completed: <CheckCircle2 size={18} className="text-green-500" />,
  Pending: <AlertCircle size={18} className="text-yellow-500" />,
  Failed: <XCircle size={18} className="text-red-500" />,
};

// For demonstration, we'll assign random statuses.
const getRandomStatus = () => {
  const statuses = Object.keys(statusIcons);
  return statuses[Math.floor(Math.random() * statuses.length)] as keyof typeof statusIcons;
};

export default function ScanStatusPage() {
  const [searchParams] = useSearchParams();
  const target = searchParams.get('target') || '';

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">OSINT Scan Status</h1>
        <p className="text-muted-foreground">
          Detailed status for each collection engine task for: <span className="font-semibold text-primary">{target}</span>
        </p>
      </header>
      <div className="space-y-8">
        {osintTasks.map((categoryData) => (
          <Card key={categoryData.category}>
            <CardHeader>
              <CardTitle>{categoryData.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead className="w-24 text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryData.tasks.map((task) => {
                    const status = getRandomStatus();
                    return (
                      <TableRow key={task.name}>
                        <TableCell>{task.name}</TableCell>
                        <TableCell className="flex items-center justify-center gap-2">
                          {statusIcons[status]}
                          <span className="sr-only">{status}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
