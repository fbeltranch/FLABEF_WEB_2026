import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/mock-auth";
import { toast } from "@/hooks/use-toast";
import { Lock, Mail, KeyRound, ArrowLeft, Loader } from "lucide-react";

export default function AdminEntry() {
  const [location, setLocation] = useLocation();
  const { login, initiateRecovery, resetPassword } = useAuth();
  const [step, setStep] = useState<'login'|'recovery'|'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Recovery state
  const [recoveryMethod, setRecoveryMethod] = useState<'email'|'dni'>('email');
  const [recoveryValue, setRecoveryValue] = useState('');
  const [dni, setDni] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast({ title: 'Error', description: 'Complete todos los campos.' });
      return;
    }

    setLoading(true);
    const res = await login(email.trim(), password.trim());
    setLoading(false);

    if (res.success) {
      sessionStorage.setItem('adminToken', 'true');
      toast({ title: 'Acceso concedido', description: 'Bienvenido al panel de administración' });
      setLocation('/admin');
    } else {
      toast({ title: 'Error', description: res.error || 'Email o contraseña inválidos' });
    }
  };

  const handleRecoveryRequest = async () => {
    if (!recoveryValue.trim()) {
      toast({ title: 'Error', description: 'Ingresa el ' + (recoveryMethod === 'email' ? 'email' : 'DNI') });
      return;
    }

    setLoading(true);
    const res = await initiateRecovery(recoveryMethod, recoveryValue.trim());
    setLoading(false);

    if (res.success) {
      toast({ title: 'Verificación enviada', description: 'Revisa tu email para confirmar la recuperación.' });
      setStep('reset');
    } else {
      toast({ title: 'Error', description: res.message || 'No se encontró la cuenta.' });
    }
  };

  const handleResetPassword = async () => {
    if (!dni.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      toast({ title: 'Error', description: 'Complete todos los campos.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'Las contraseñas no coinciden.' });
      return;
    }

    if (newPassword.length < 6) {
      toast({ title: 'Error', description: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    setLoading(true);
    const res = await resetPassword(recoveryValue, dni.trim(), newPassword);
    setLoading(false);

    if (res.success) {
      toast({ title: 'Éxito', description: 'Tu contraseña ha sido actualizada. Inicia sesión nuevamente.' });
      setStep('login');
      setEmail(recoveryValue);
      setPassword('');
      setRecoveryValue('');
      setDni('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast({ title: 'Error', description: res.error || 'No se pudo resetear la contraseña.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FLABEF Admin</h1>
          <p className="text-slate-300">Panel de Administración</p>
        </div>

        <Card className="border-0 shadow-2xl backdrop-blur bg-slate-800/50">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="text-white">
              {step === 'login' && 'Iniciar Sesión'}
              {step === 'recovery' && 'Recuperar Contraseña'}
              {step === 'reset' && 'Restablecer Contraseña'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {/* STEP 1: Login */}
            {step === 'login' && (
              <div className="space-y-4">
                <p className="text-slate-300 text-sm">Introduce tus credenciales de administrador.</p>
                
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@flabef.com"
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="Contraseña"
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleLogin}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Accediendo...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setLocation('/')}
                    className="text-slate-300 hover:text-white hover:bg-slate-700/50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </div>

                <button
                  onClick={() => setStep('recovery')}
                  className="w-full text-sm text-blue-400 hover:text-blue-300 transition mt-2"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {/* STEP 3: Recovery */}
            {step === 'recovery' && (
              <div className="space-y-4">
                <p className="text-slate-300 text-sm">Selecciona cómo deseas recuperar tu cuenta.</p>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/30">
                    <input
                      type="radio"
                      checked={recoveryMethod === 'email'}
                      onChange={() => setRecoveryMethod('email')}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="text-white text-sm font-medium">Recuperar por Email</p>
                      <p className="text-slate-400 text-xs">Te enviaremos instrucciones a tu correo</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/30">
                    <input
                      type="radio"
                      checked={recoveryMethod === 'dni'}
                      onChange={() => setRecoveryMethod('dni')}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="text-white text-sm font-medium">Recuperar por DNI</p>
                      <p className="text-slate-400 text-xs">Verifica tu identidad con tu DNI</p>
                    </div>
                  </label>
                </div>

                <div className="relative">
                  {recoveryMethod === 'email' ? (
                    <>
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <Input
                        type="email"
                        value={recoveryValue}
                        onChange={(e) => setRecoveryValue(e.target.value)}
                        placeholder="tu@email.com"
                        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                      />
                    </>
                  ) : (
                    <>
                      <KeyRound className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <Input
                        type="text"
                        value={recoveryValue}
                        onChange={(e) => setRecoveryValue(e.target.value)}
                        placeholder="12345678"
                        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                      />
                    </>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleRecoveryRequest}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Continuar'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setStep('login')}
                    className="text-slate-300 hover:text-white hover:bg-slate-700/50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: Reset Password */}
            {step === 'reset' && (
              <div className="space-y-4">
                <p className="text-slate-300 text-sm">Establece tu nueva contraseña.</p>

                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <Input
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Tu DNI"
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nueva contraseña"
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
                    placeholder="Confirmar contraseña"
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Restablecer'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setStep('login')}
                    className="text-slate-300 hover:text-white hover:bg-slate-700/50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-slate-400 text-xs mt-6">
          © 2024 FLABEF E-Commerce. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
