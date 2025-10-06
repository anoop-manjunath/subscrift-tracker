import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

type FormState = 'email' | 'otp' | 'success';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<FormState>('email');
  const [lastSentTime, setLastSentTime] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();

  const maskEmail = (email: string) => {
    const [local, domain] = email.split('@');
    return `${local[0]}•••@${domain}`;
  };

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [session, navigate, location]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast({
        variant: 'destructive',
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
      });
      return;
    }

    const now = Date.now();
    if (now - lastSentTime < 10000) {
      toast({
        variant: 'destructive',
        title: 'Rate limit',
        description: 'We just sent a code. Please wait a moment before requesting another.',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setFormState('otp');
      setLastSentTime(now);
      setCooldown(30);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to send code',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast({
        variant: 'destructive',
        title: 'Invalid code',
        description: 'Please enter all 6 digits.',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) {
        if (error.message.includes('expired')) {
          toast({
            variant: 'destructive',
            title: 'Code expired',
            description: 'That code expired. Tap Resend for a new one.',
          });
        } else if (error.message.includes('invalid')) {
          toast({
            variant: 'destructive',
            title: 'Invalid code',
            description: "That code doesn't look right. Try again.",
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message,
          });
        }
        return;
      }

      toast({
        title: "You're in!",
        description: 'Redirecting…',
      });
      setFormState('success');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Too many attempts',
        description: 'Too many attempts—please wait a minute and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (cooldown > 0) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setLastSentTime(Date.now());
      setCooldown(30);
      toast({
        title: 'Code sent',
        description: 'Check your email for the new code.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to resend code',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setFormState('email');
    setOtp('');
    setCooldown(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-surface px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-card-border rounded-lg shadow-lg p-8">
          {/* Email Form */}
          {formState === 'email' && (
            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <img src="/logo.png" alt="Logo" className="h-16 w-16" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-gradient mb-3">Track all your subscriptions in one place</h1>
                <p className="text-muted-foreground mb-1">Sign in or create an account with a 6-digit code.</p>
                <p className="text-muted-foreground">Enter your email and we'll send the code.</p>
              </div>

              <form onSubmit={handleSendCode} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading || !email}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send code'
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  We only use your email to send the code. We never read your inbox.
                </p>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button type="button" variant="outline" className="w-full" disabled>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </Button>

                <Button type="button" variant="outline" className="w-full" disabled>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.4 24H0V8.6h11.4V24zm12.6 0H12.6V8.6H24V24zM11.4 7.2H0V0h11.4v7.2zm12.6 0H12.6V0H24v7.2z" />
                  </svg>
                  Continue with Microsoft
                </Button>
              </div>

              <div className="mt-6 text-center text-xs text-muted-foreground">
                By continuing, you agree to our{' '}
                <Link to="/terms" className="hover:text-foreground transition-colors underline">
                  Terms
                </Link>
                {' & '}
                <Link to="/privacy" className="hover:text-foreground transition-colors underline">
                  Privacy
                </Link>
                .
              </div>
            </>
          )}

          {/* OTP Verification Form */}
          {formState === 'otp' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gradient mb-3">Check your email</h1>
                <p className="text-muted-foreground">We sent a 6-digit code to <strong>{maskEmail(email)}</strong></p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-center block">Enter 6-digit code</Label>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify'
                  )}
                </Button>
              </form>

              <div className="mt-6 space-y-3 text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendCode}
                  disabled={cooldown > 0 || loading}
                  className="w-full"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleChangeEmail}
                  disabled={loading}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Change email
                </Button>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  Didn't get it? Check spam and promotions.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
