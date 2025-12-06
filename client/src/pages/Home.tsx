import { useStore } from "@/lib/mock-store";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, Truck, CreditCard, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import generatedHero from '@assets/generated_images/modern_ecommerce_lifestyle_hero_banner.png';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function Home() {
  const { categories } = useStore();
  const [_, setLocation] = useLocation();

  const featuredCategories = categories.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      {/* Retail Banner Carousel */}
      <section className="w-full bg-black">
         <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
           <img src={generatedHero} className="w-full h-full object-cover opacity-80" alt="Hero Banner" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-start">
             <div className="container mx-auto px-6 md:px-12">
               <div className="max-w-xl">
                 <span className="bg-primary text-white px-3 py-1 text-sm font-bold uppercase tracking-widest mb-4 inline-block">
                   Cyber Flabef
                 </span>
                 <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-4 leading-none">
                   OFERTAS <br/>
                   <span className="text-primary">IMBATIBLES</span>
                 </h1>
                 <p className="text-xl text-gray-200 mb-8 font-light">
                   Hasta 60% dscto. en Tecnología, Moda y Hogar.
                 </p>
                 <Button size="lg" className="h-14 px-8 text-xl font-bold bg-primary hover:bg-primary/90 text-white rounded-full" onClick={() => setLocation('/products')}>
                   Comprar Ahora
                 </Button>
               </div>
             </div>
           </div>
         </div>
      </section>

      {/* Trust Badges Strip */}
      <section className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-gray-100">
             <div className="flex flex-col items-center justify-center gap-2">
               <Truck className="text-primary h-6 w-6" />
               <div className="text-xs md:text-sm">
                 <span className="font-bold block">Envío Gratis</span>
                 <span className="text-muted-foreground">En compras sobre S/. 200</span>
               </div>
             </div>
             <div className="flex flex-col items-center justify-center gap-2">
               <ShieldCheck className="text-primary h-6 w-6" />
               <div className="text-xs md:text-sm">
                 <span className="font-bold block">Garantía Extendida</span>
                 <span className="text-muted-foreground">Compra 100% Protegida</span>
               </div>
             </div>
             <div className="flex flex-col items-center justify-center gap-2">
               <CreditCard className="text-primary h-6 w-6" />
               <div className="text-xs md:text-sm">
                 <span className="font-bold block">Hasta 12 Cuotas</span>
                 <span className="text-muted-foreground">Sin intereses con TC</span>
               </div>
             </div>
             <div className="flex flex-col items-center justify-center gap-2">
               <Star className="text-primary h-6 w-6" />
               <div className="text-xs md:text-sm">
                 <span className="font-bold block">Top Brands</span>
                 <span className="text-muted-foreground">Marcas Originales</span>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Categories Circle Grid */}
      <section className="py-12 bg-white mb-4">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Busca por Categoría</h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {featuredCategories.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`}>
                <div className="group cursor-pointer flex flex-col items-center gap-3 w-24 md:w-32">
                  <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gray-100 border-2 border-transparent group-hover:border-primary transition-all overflow-hidden relative">
                    {/* Placeholder for category image */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold text-4xl bg-gray-50">
                      {cat.name.charAt(0)}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-center group-hover:text-primary transition-colors">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Grids */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="h-[300px] bg-gray-900 rounded-xl overflow-hidden relative group cursor-pointer" onClick={() => setLocation('/category/tecnologia')}>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="text-3xl font-bold text-white mb-2">Tecnología</h3>
              <p className="text-gray-300 mb-4">Laptops, Tablets y más</p>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">Ver Ofertas</Button>
            </div>
            <img src="https://images.unsplash.com/photo-1531297461136-82lwde71290?w=800&auto=format&fit=crop&q=60" className="absolute top-0 right-0 w-1/2 h-full object-cover mask-gradient-l opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Tech" />
          </div>
          <div className="h-[300px] bg-primary rounded-xl overflow-hidden relative group cursor-pointer" onClick={() => setLocation('/category/moda')}>
            <div className="absolute inset-0 bg-primary"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="text-3xl font-bold text-white mb-2">Moda 2025</h3>
              <p className="text-white/90 mb-4">Tendencias de temporada</p>
              <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">Comprar</Button>
            </div>
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=60" className="absolute top-0 right-0 w-1/2 h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Fashion" />
          </div>
        </div>
      </section>

    </div>
  );
}