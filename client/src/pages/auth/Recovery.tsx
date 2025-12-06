import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/mock-auth';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, ArrowRight, ArrowLeft, Mail, CreditCard, 
  ShieldCheck, Lock, CheckCircle, Timer
} from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

// Step definitions
type Step = 'select_method' | 'input_data' | 'verify_otp' | 'reset_password' | 'success';
type Method = 'dni_email' | 'email' | 'dni';

export default function Recovery() {
  const [step, setStep] = useState<Step>('select_method');
  const [method, setMethod] = useState<Method>('dni_email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const { initiateRecovery, verifyOTP, resetPassword } = useAuth();
  const [_, setLocation] = useLocation();

  // Form Data Handling
  const [formData, setFormData] = useState({
    email: '',
    dni: '',
    code: '',
    newPassword: ''
  });

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'verify_otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handlers
  const handleMethodSelect = (m: Method) => {
    setMethod(m);
    setStep('input_data');
    setError(null);
  };

  const handleInitiate = async () => {
    setIsLoading(true);
    setError(null);

    // Simple validation based on method
    if (method === 'dni_email' && (!formData.dni || !formData.email)) {
      setError("DNI and Email are required");
      setIsLoading(false);
      return;
    }
    if (method === 'email' && !formData.email) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }
    if (method === 'dni' && !formData.dni) {
      setError("DNI is required");
      setIsLoading(false);
      return;
    }

    const res = await initiateRecovery(method, formData);
    
    if (res.success) {
      if (method === 'dni' && res.maskedEmail) {
        setMaskedEmail(res.maskedEmail);
        // For DNI method, we show masked email first, then user confirms to send OTP
        // To keep UI simple for this mock, we'll jump to OTP and show the masked email there
      }
      setStep('verify_otp');
      setTimer(60);
    } else {
      setError(res.message || "Failed to initiate recovery");
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    const valid = await verifyOTP(formData.code);
    if (valid) {
      setStep('reset_password');
    } else {
      setError("Invalid or expired code");
    }
    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setIsLoading(true);
    await resetPassword(formData.newPassword);
    setStep('success');
    setIsLoading(false);
  };

  // Renderers
  const renderSelectMethod = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div 
        onClick={() => handleMethodSelect('dni_email')}
        className="p-4 border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group flex items-center gap-4"
      >
        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h3 className="font-medium text-foreground">DNI + Email</h3>
          <p className="text-sm text-muted-foreground">Recommended for highest security</p>
        </div>
        <ArrowRight className="ml-auto text-muted-foreground group-hover:text-primary" size={18} />
      </div>

      <div 
        onClick={() => handleMethodSelect('email')}
        className="p-4 border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group flex items-center gap-4"
      >
        <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Mail size={20} />
        </div>
        <div>
          <h3 className="font-medium text-foreground">Email Only</h3>
          <p className="text-sm text-muted-foreground">Standard recovery via inbox</p>
        </div>
        <ArrowRight className="ml-auto text-muted-foreground group-hover:text-primary" size={18} />
      </div>

      <div 
        onClick={() => handleMethodSelect('dni')}
        className="p-4 border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group flex items-center gap-4"
      >
        <div className="h-10 w-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
          <CreditCard size={20} />
        </div>
        <div>
          <h3 className="font-medium text-foreground">DNI Only</h3>
          <p className="text-sm text-muted-foreground">Use if you forgot your email</p>
        </div>
        <ArrowRight className="ml-auto text-muted-foreground group-hover:text-primary" size={18} />
      </div>
    </div>
  );

  const renderInputData = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {method !== 'email' && (
        <div className="space-y-2">
          <Label>DNI Number</Label>
          <Input 
            value={formData.dni}
            onChange={e => setFormData({...formData, dni: e.target.value})}
            maxLength={8}
            placeholder="Enter 8-digit DNI"
          />
        </div>
      )}
      
      {method !== 'dni' && (
        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            placeholder="Enter your email"
            type="email"
          />
        </div>
      )}

      <Button onClick={handleInitiate} className="w-full h-11" disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Send Recovery Code"}
      </Button>
    </div>
  );

  const renderVerifyOTP = () => (
    <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm mb-4">
        We sent a 6-digit code to {maskedEmail || formData.email || 'your email'}.
      </div>

      <div className="flex justify-center py-4">
        <InputOTP maxLength={6} value={formData.code} onChange={val => setFormData({...formData, code: val})}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <div className="w-4" />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Timer size={16} />
        <span>Code expires in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
      </div>

      <Button onClick={handleVerifyOTP} className="w-full h-11" disabled={isLoading || formData.code.length < 6}>
        {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Verify Code"}
      </Button>
      
      {timer === 0 && (
        <Button variant="ghost" onClick={() => setTimer(60)} className="text-sm">
          Resend Code
        </Button>
      )}
    </div>
  );

  const renderResetPassword = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <Label>New Password</Label>
        <Input 
          type="password"
          value={formData.newPassword}
          onChange={e => setFormData({...formData, newPassword: e.target.value})}
          placeholder="Minimum 8 characters"
        />
        {/* Password strength indicator could go here */}
        <div className="flex gap-1 mt-2">
           <div className={`h-1 flex-1 rounded-full ${formData.newPassword.length > 0 ? 'bg-red-400' : 'bg-gray-200'}`}></div>
           <div className={`h-1 flex-1 rounded-full ${formData.newPassword.length > 5 ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
           <div className={`h-1 flex-1 rounded-full ${formData.newPassword.length > 8 ? 'bg-green-400' : 'bg-gray-200'}`}></div>
        </div>
      </div>

      <Button onClick={handleResetPassword} className="w-full h-11" disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Update Password"}
      </Button>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6 animate-in zoom-in duration-300">
      <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle size={40} />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-foreground">Password Updated!</h3>
        <p className="text-muted-foreground mt-2">Your account has been secured with your new credentials.</p>
      </div>
      <Link href="/login">
        <Button className="w-full h-11">Go to Login</Button>
      </Link>
    </div>
  );

  const getTitle = () => {
    if (step === 'select_method') return "Account Recovery";
    if (step === 'input_data') return "Enter Details";
    if (step === 'verify_otp') return "Security Verification";
    if (step === 'reset_password') return "New Password";
    return "Success";
  }

  return (
    <AuthLayout 
      title={getTitle()}
      subtitle={step === 'select_method' ? "Choose how you want to recover your access" : "Follow the steps to secure your account"}
    >
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {step === 'select_method' && renderSelectMethod()}
      {step === 'input_data' && renderInputData()}
      {step === 'verify_otp' && renderVerifyOTP()}
      {step === 'reset_password' && renderResetPassword()}
      {step === 'success' && renderSuccess()}

      {step !== 'select_method' && step !== 'success' && (
        <button 
          onClick={() => setStep('select_method')}
          className="flex items-center text-sm text-muted-foreground hover:text-primary mt-6 mx-auto"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to methods
        </button>
      )}
    </AuthLayout>
  );
}