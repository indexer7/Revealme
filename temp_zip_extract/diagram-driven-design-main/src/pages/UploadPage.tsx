
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function UploadPage() {
  const handleUpload = () => {
    toast.info('File upload functionality is not yet implemented.');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Upload Scan Results</h1>
        <p className="text-muted-foreground">
          Manually upload scan results from external sources.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            Select a .json, .csv, or .xml file to upload.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="scan-file">Scan File</Label>
              <Input id="scan-file" type="file" accept=".json,.csv,.xml" />
            </div>
            <Button onClick={handleUpload}>Upload and Process</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
