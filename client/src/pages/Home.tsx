import { useStore } from "@/lib/mock-store";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import generatedHero from '@assets/generated_images/modern_ecommerce_lifestyle_hero_banner.png';

export default function Home() {
  const { categories } = useStore();
  const [_, setLocation] = useLocation();

  const featuredCategories = categories.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[500px] lg:h-[600px] flex items-center overflow-hidden bg-gray-900 text-white">
         <div className="absolute inset-0 z-0">
           <img src={generatedHero} className="w-full h-full object-cover opacity-60" alt="Lifestyle Banner" />
           <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
         </div>
         
         <div className="container mx-auto px-6 relative z-10">
           <div className="max-w-2xl animate-in slide-in-from-left duration-700">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-md">
               <ShieldCheck size={14} /> Compra 100% Segura
             </div>
             <h1 className="text-5xl lg:text-7xl font-heading font-bold tracking-tight mb-6 leading-tight">
               Descubre lo último en <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Tecnología y Moda.</span>
             </h1>
             <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
               FLABEF te ofrece la mejor experiencia de compra con seguridad bancaria y envíos a todo el Perú.
             </p>
             <div className="flex gap-4">
               <Button size="lg" className="h-12 px-8 text-lg bg-primary hover:bg-primary/90" onClick={() => setLocation('/products')}>
                 Ver Catálogo <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
               <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-white text-white hover:bg-white hover:text-black bg-transparent" onClick={() => setLocation('/category/tecnologia')}>
                 Tecnología
               </Button>
             </div>
           </div>
         </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-heading font-bold text-foreground">Categorías Populares</h2>
              <p className="text-muted-foreground mt-2">Explora nuestra amplia selección de productos</p>
            </div>
            <Link href="/products">
              <Button variant="link">Ver todo</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredCategories.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`}>
                <div className="group cursor-pointer bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border text-center h-full flex flex-col items-center justify-center gap-4">
                  <div className="h-16 w-16 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                    {/* Placeholder icons based on category name would be better, simplified here */}
                    <span className="font-bold text-2xl">{cat.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Pagos Seguros</h3>
              <p className="text-muted-foreground">Todas las transacciones están encriptadas de extremo a extremo.</p>
            </div>
            <div className="p-6">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Envíos Rápidos</h3>
              <p className="text-muted-foreground">Recibe tus productos en 24-48 horas en Lima Metropolitana.</p>
            </div>
            <div className="p-6">
              <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Garantía Total</h3>
              <p className="text-muted-foreground">Devoluciones gratuitas dentro de los primeros 7 días.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}