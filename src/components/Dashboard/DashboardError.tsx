
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface DashboardErrorProps {
  error: string | null;
}

const DashboardError: React.FC<DashboardErrorProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        There was an error loading the dashboard data. Please try refreshing the page.
        <pre className="mt-2 p-2 bg-red-50 text-red-900 rounded text-xs">{error}</pre>
      </AlertDescription>
    </Alert>
  );
};

export default DashboardError;
