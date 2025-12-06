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
import { Loader2, CheckCircle2 } from 'lucide-react';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  dni: z.string().length(8, 'DNI must be exactly 8 digits').regex(/^\d+$/, 'Only numbers allowed'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(9, 'Phone number required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [_, setLocation] = useLocation();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      dni: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);
    
    const result = await register({
      fullName: data.fullName,
      dni: data.dni,
      email: data.email,
      phone: data.phone,
    });
    
    if (result.success) {
      setLocation('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
    }
    setIsLoading(false);
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join FLABEF for secure shopping"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input 
            id="fullName" 
            placeholder="Juan Perez" 
            {...form.register('fullName')}
          />
          {form.formState.errors.fullName && (
            <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dni">DNI</Label>
            <Input 
              id="dni" 
              maxLength={8}
              placeholder="12345678" 
              {...form.register('dni')}
            />
            {form.formState.errors.dni && (
              <p className="text-sm text-red-500">{form.formState.errors.dni.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input 
              id="phone" 
              placeholder="999 999 999" 
              {...form.register('phone')}
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="juan@example.com" 
            {...form.register('email')}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            {...form.register('password')}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            id="confirmPassword" 
            type="password" 
            {...form.register('confirmPassword')}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2 pt-2">
           <input type="checkbox" id="terms" className="rounded border-gray-300" required />
           <label htmlFor="terms" className="text-sm text-muted-foreground">
             I agree to the <a href="#" className="text-primary hover:underline">Terms & Conditions</a>
           </label>
        </div>

        <Button type="submit" className="w-full h-11 mt-2" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
        </Button>

        <div className="text-center text-sm mt-4">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login">
            <span className="font-medium text-primary hover:underline cursor-pointer">Sign In</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}