import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AlertCircle } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(
          new URLSearchParams(window.location.search).toString()
        );

        if (error) throw error;

        // Get the redirect path from location state, or default to dashboard
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Failed to authenticate');
      }
    };

    handleCallback();
  }, [navigate, location]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-surface px-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-card-border rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-3 text-destructive mb-4">
              <AlertCircle className="h-6 w-6" />
              <h1 className="text-xl font-semibold">Authentication Error</h1>
            </div>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-surface">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
