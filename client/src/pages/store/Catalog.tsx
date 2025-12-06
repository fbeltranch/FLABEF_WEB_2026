import { useState } from "react";
import { useStore } from "@/lib/mock-store";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, Filter } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { toast } from "@/hooks/use-toast";

export default function Catalog({ params }: { params?: { category?: string } }) {
  const { products, categories, addToCart } = useStore();
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [location, setLocation] = useLocation();
  
  const activeCategory = params?.category;

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory ? 
      categories.find(c => c.slug === activeCategory)?.id === p.categoryId 
      : true;
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "Producto agregado",
      description: `${product.name} se agregó al carrito.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 space-y-6">
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2"><Filter size={18} /> Filtros</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Categorías</h4>
                  <div className="space-y-2">
                    <div 
                      className={`text-sm cursor-pointer hover:text-primary ${!activeCategory ? 'font-bold text-primary' : 'text-muted-foreground'}`}
                      onClick={() => setLocation('/products')}
                    >
                      Todas
                    </div>
                    {categories.map(cat => (
                      <div 
                        key={cat.id}
                        className={`text-sm cursor-pointer hover:text-primary ${activeCategory === cat.slug ? 'font-bold text-primary' : 'text-muted-foreground'}`}
                        onClick={() => setLocation(`/category/${cat.slug}`)}
                      >
                        {cat.name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium text-sm mb-4">Precio (S/.)</h4>
                  <Slider 
                    defaultValue={[0, 10000]} 
                    max={10000} 
                    step={100} 
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>S/. {priceRange[0]}</span>
                    <span>S/. {priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
             <div className="mb-6">
               <h1 className="text-2xl font-heading font-bold">
                 {activeCategory ? categories.find(c => c.slug === activeCategory)?.name : 'Catálogo Completo'}
               </h1>
               <p className="text-muted-foreground">{filteredProducts.length} productos encontrados</p>
             </div>

             {filteredProducts.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                 <p className="text-muted-foreground">No se encontraron productos con estos filtros.</p>
                 <Button variant="link" onClick={() => { setPriceRange([0, 10000]); setLocation('/products'); }}>
                   Limpiar filtros
                 </Button>
               </div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredProducts.map(product => (
                   <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                     <div className="aspect-square overflow-hidden bg-gray-100 relative">
                       <img 
                         src={product.image} 
                         alt={product.name} 
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                       />
                       {product.stock < 5 && (
                         <Badge variant="destructive" className="absolute top-2 right-2">¡Últimos {product.stock}!</Badge>
                       )}
                     </div>
                     <CardContent className="p-4">
                       <div className="text-sm text-muted-foreground mb-1">
                         {categories.find(c => c.id === product.categoryId)?.name}
                       </div>
                       <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                         {product.name}
                       </h3>
                       <div className="flex items-baseline gap-1">
                         <span className="text-xs font-medium text-muted-foreground">S/.</span>
                         <span className="text-xl font-bold text-foreground">{product.price.toFixed(2)}</span>
                       </div>
                     </CardContent>
                     <CardFooter className="p-4 pt-0">
                       <Button className="w-full" onClick={() => handleAddToCart(product)}>
                         <ShoppingCart className="mr-2 h-4 w-4" /> Agregar
                       </Button>
                     </CardFooter>
                   </Card>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}