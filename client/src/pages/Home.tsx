import { Switch, Route, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShoppingBag, LogIn, Lock } from "lucide-react";
import generatedBg from '@assets/generated_images/abstract_security_technology_background.png';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="h-16 border-b flex items-center justify-between px-6 lg:px-12 fixed top-0 w-full bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white">
            <ShieldCheck size={18} />
          </div>
          <span className="font-heading font-bold text-xl text-primary">FLABEF</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 pt-16">
        <section className="relative h-[600px] flex items-center overflow-hidden">
           <div className="absolute inset-0 z-0">
             <img src={generatedBg} className="w-full h-full object-cover opacity-20" alt="background" />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
           </div>
           
           <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-primary text-sm font-medium mb-6 border border-blue-100">
               <ShieldCheck size={14} /> Bank-Grade Security Standard
             </div>
             <h1 className="text-5xl lg:text-7xl font-heading font-bold tracking-tight text-primary mb-6">
               Secure Ecommerce <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-500">Reimagined.</span>
             </h1>
             <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
               FLABEF provides an ultra-secure shopping environment with advanced multi-factor authentication and identity protection.
             </p>
             <div className="flex justify-center gap-4">
               <Link href="/register">
                 <Button size="lg" className="h-12 px-8 text-lg">Create Account</Button>
               </Link>
               <Link href="/login">
                 <Button size="lg" variant="outline" className="h-12 px-8 text-lg">Admin Portal</Button>
               </Link>
             </div>
           </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-gray-50 border hover:shadow-lg transition-all">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Identity Verification</h3>
                <p className="text-muted-foreground">Strict DNI validation and multi-layer identity checks to prevent fraud.</p>
              </div>
              <div className="p-8 rounded-2xl bg-gray-50 border hover:shadow-lg transition-all">
                <div className="h-12 w-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-4">
                  <Lock size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Advanced Recovery</h3>
                <p className="text-muted-foreground">Three-tier account recovery system ensuring you never lose access.</p>
              </div>
              <div className="p-8 rounded-2xl bg-gray-50 border hover:shadow-lg transition-all">
                <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                  <ShoppingBag size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Checkout</h3>
                <p className="text-muted-foreground">End-to-end encrypted transactions protecting your financial data.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}