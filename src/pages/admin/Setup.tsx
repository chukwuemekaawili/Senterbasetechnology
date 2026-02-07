import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, CheckCircle, AlertTriangle, Copy, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSetup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminExists, setAdminExists] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showManualSetup, setShowManualSetup] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkExistingAdmin();
  }, []);

  const checkExistingAdmin = async () => {
    try {
      // Check if any admin exists
      const { count, error } = await supabase
        .from("admin_users")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error checking admin:", error);
      }

      setAdminExists((count ?? 0) > 0);

      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        setEmail(user.email || "");
      }
    } catch (err) {
      console.error("Setup check failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Step 1: Sign up new user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName }
        }
      });

      if (signUpError) {
        toast({
          title: "Sign up failed",
          description: signUpError.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (!signUpData.user) {
        toast({
          title: "Sign up failed",
          description: "No user returned from sign up",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Step 2: Insert into admin_users (this will fail due to RLS, which is expected)
      // The user needs to manually insert via SQL or we need a service role function
      setCurrentUserId(signUpData.user.id);
      setShowManualSetup(true);
      
      toast({
        title: "Account created!",
        description: "Now complete the admin setup with the SQL command below.",
      });

    } catch (err) {
      console.error("Admin creation failed:", err);
      toast({
        title: "Error",
        description: "Failed to create admin account",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExistingUserSetup = async () => {
    // Just show the manual SQL setup for existing logged-in user
    setShowManualSetup(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "SQL command copied to clipboard",
    });
  };

  const sqlCommand = currentUserId 
    ? `INSERT INTO admin_users (user_id, role, display_name) 
VALUES ('${currentUserId}', 'super_admin', '${displayName || "Admin"}');`
    : `-- First, get your user ID from auth.users after signing up
-- Then run:
INSERT INTO admin_users (user_id, role, display_name) 
VALUES ('YOUR-USER-ID-HERE', 'super_admin', 'Admin Name');`;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (adminExists && !showManualSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="font-heading text-2xl">Admin Already Configured</CardTitle>
            <CardDescription>
              An admin user already exists. Please log in to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate("/admin/login")} 
              className="w-full"
            >
              Go to Login
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <a href="/" className="hover:text-primary">
                ← Back to website
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (setupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="font-heading text-2xl">Setup Complete!</CardTitle>
            <CardDescription>
              Your admin account is ready. You can now log in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/admin/login")} 
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showManualSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Info className="h-6 w-6 text-amber-600" />
            </div>
            <CardTitle className="font-heading text-2xl">Complete Admin Setup</CardTitle>
            <CardDescription>
              Run this SQL command in the Supabase SQL Editor to grant admin access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentUserId && (
              <Alert>
                <AlertDescription>
                  <strong>Your User ID:</strong>
                  <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">{currentUserId}</code>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto font-mono">
                {sqlCommand}
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(sqlCommand)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Steps:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Copy the SQL command above</li>
                <li>Open <a href="https://supabase.com/dashboard/project/adxnbdxlaonqftbocjqc/sql/new" target="_blank" rel="noopener noreferrer" className="text-primary underline">Supabase SQL Editor</a></li>
                <li>Paste and run the command</li>
                <li>Return here and log in</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => navigate("/admin/login")} 
                className="flex-1"
              >
                Go to Login
              </Button>
              <Button 
                onClick={() => {
                  setShowManualSetup(false);
                  checkExistingAdmin();
                }} 
                className="flex-1"
              >
                I've Done This
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-heading text-2xl">Admin Setup</CardTitle>
          <CardDescription>
            Create the first admin account for STIL Technologies CMS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This setup page is only available when no admin users exist.
            </AlertDescription>
          </Alert>

          {currentUserId ? (
            // User is already logged in
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  You're logged in as: <strong>{email}</strong>
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Admin Name"
                />
              </div>
              <Button 
                onClick={handleExistingUserSetup} 
                className="w-full"
              >
                Set Up as Admin
              </Button>
            </div>
          ) : (
            // Create new account
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Admin Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Admin Account"
                )}
              </Button>
            </form>
          )}
          
          <p className="text-center text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary">
              ← Back to website
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}