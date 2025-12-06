import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/lib/mock-auth';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowRight, Shield } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  dni: z.string().length(8, 'DNI must be exactly 8 digits').regex(/^\d+$/, 'DNI must contain only numbers'),
  // password field would be here in real app, using DNI as "password" for this mock flow per prompt implication or just standard login
  password: z.string().min(1, 'Password is required') 
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [_, setLocation] = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      dni: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    
    // For this mock, we authenticate with Email + DNI as per one of the prompt's flows, 
    // or typically Email + Password. The prompt mentions "Login" but emphasizes Recovery.
    // I'll stick to standard Email + DNI check for this mock since I didn't implement password hashing
    const result = await login(data.email, data.dni);
    
    if (result.success) {
      setLocation('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    setIsLoading(false);
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Please sign in to access your account"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="name@example.com" 
            {...form.register('email')}
            className="h-11"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dni">DNI (Peruvian ID)</Label>
          <Input 
            id="dni" 
            placeholder="12345678" 
            maxLength={8}
            {...form.register('dni')}
            className="h-11"
          />
          {form.formState.errors.dni && (
            <p className="text-sm text-red-500">{form.formState.errors.dni.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link href="/recovery">
              <span className="text-sm font-medium text-primary hover:underline cursor-pointer">Forgot password?</span>
            </Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            placeholder="••••••••" 
            {...form.register('password')}
            className="h-11"
          />
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Sign In <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/register">
            <span className="font-medium text-primary hover:underline cursor-pointer">Create an account</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}