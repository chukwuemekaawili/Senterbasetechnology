import { AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AdminDataStateProps {
  isLoading: boolean;
  error: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  onRetry: () => void;
  children: React.ReactNode;
}

/**
 * Wrapper component for consistent loading, error, and empty states across admin pages.
 * Ensures no page can stay in an infinite spinner - always shows error UI with retry.
 */
export function AdminDataState({
  isLoading,
  error,
  isEmpty = false,
  emptyMessage = "No data found",
  onRetry,
  children,
}: AdminDataStateProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="py-8 flex flex-col items-center justify-center gap-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <div className="text-center">
            <h3 className="font-medium text-foreground mb-1">Failed to Load Data</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              {error}
            </p>
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isEmpty) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}

/**
 * Inline error banner for showing errors within a page that still renders partial content
 */
export function AdminErrorBanner({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 mb-6 flex items-center gap-4">
      <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-destructive">Error</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Retry
        </Button>
      )}
    </div>
  );
}
