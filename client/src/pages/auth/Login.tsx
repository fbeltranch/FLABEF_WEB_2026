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
import { Loader2, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  dni: z.string().length(8, 'DNI must be exactly 8 digits').regex(/^\d+$/, 'DNI must contain only numbers'),
  password: z.string().min(1, 'Password is required') 
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [_, setLocation] = useLocation();
  const { login, currentUser } = useAuth(); // Grab currentUser to check role if needed, though state update might be async
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
    
    const result = await login(data.email, data.dni);
    
    if (result.success) {
      // Login successful!
      // We don't have easy access to the *new* currentUser state instantly here due to closure/async.
      // Safest bet: Redirect to home for everyone. 
      // If they are admin, they can click the Dashboard link in the Navbar.
      // OR: We could try to fetch the user from the store directly if we imported the store state getter, but let's keep it simple.
      // Users expect to go to the shop home after login usually.
      
      // However, for better UX, let's check if the email looks like an admin (hacky but effective for mock)
      if (data.email.includes('admin')) {
         setLocation('/dashboard');
      } else {
         setLocation('/');
      }
    } else {
      setError(result.error || 'Login failed');
    }
    setIsLoading(false);
  };

  return (
    <AuthLayout 
      title="Bienvenido" 
      subtitle="Ingresa para continuar comprando"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="nombre@ejemplo.com" 
            {...form.register('email')}
            className="h-11"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dni">DNI</Label>
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
            <Label htmlFor="password">Contraseña</Label>
            <Link href="/recovery">
              <span className="text-sm font-medium text-primary hover:underline cursor-pointer">¿Olvidaste tu contraseña?</span>
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

        <Button type="submit" className="w-full h-11 text-base font-bold" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              Iniciar Sesión <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">¿No tienes una cuenta? </span>
          <Link href="/register">
            <span className="font-medium text-primary hover:underline cursor-pointer">Regístrate aquí</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}