import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { ShieldCheck, ShoppingBag } from 'lucide-react';
import generatedBg from '@assets/generated_images/abstract_security_technology_background.png';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 xl:p-16 relative z-10">
        <div className="w-full max-w-[440px] space-y-8">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white">
                  <ShieldCheck size={24} />
                </div>
                <span className="font-heading font-bold text-2xl text-primary tracking-tight">FLABEF</span>
              </div>
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground font-heading tracking-tight">{title}</h1>
            <p className="text-muted-foreground text-lg">{subtitle}</p>
          </div>

          <div className="mt-8">
            {children}
          </div>

          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 FLABEF Secure Systems. All rights reserved.</p>
            <div className="flex gap-4 justify-center mt-2">
              <a href="#" className="hover:text-primary hover:underline">Privacy</a>
              <a href="#" className="hover:text-primary hover:underline">Terms</a>
              <a href="#" className="hover:text-primary hover:underline">Security</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:block flex-1 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-primary/20 z-10 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent z-20"></div>
        
        <img 
          src={generatedBg} 
          alt="Security Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 z-30 flex flex-col justify-between p-12 text-white">
          <div className="flex justify-end">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              System Operational
            </div>
          </div>
          
          <div className="max-w-md space-y-4 mb-12">
            <div className="h-16 w-16 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center mb-6">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-4xl font-heading font-bold leading-tight">
              Bank-grade security for your shopping experience.
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              FLABEF uses advanced encryption and multi-factor authentication to ensure your data never falls into the wrong hands.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}