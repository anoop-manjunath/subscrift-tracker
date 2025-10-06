import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to sign out',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient">Subscrift Tracker</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to Subscrift Tracker</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Manage your subscriptions and track your spending in one place.
          </p>
          
          {user && (
            <div className="bg-card border border-card-border rounded-lg p-6 text-left">
              <h3 className="text-lg font-semibold mb-4">Account Details</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Email</dt>
                  <dd className="font-medium">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">User ID</dt>
                  <dd className="font-mono text-sm">{user.id}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Last sign in</dt>
                  <dd className="text-sm">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleString()
                      : 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
