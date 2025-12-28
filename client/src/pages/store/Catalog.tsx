import { useState } from "react";
import { useStore } from "@/lib/mock-store";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ShoppingCart, Filter, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductPreviewModal from "@/components/ProductPreviewModal";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/lib/mock-store";

export default function Catalog({ params }: { params?: { category?: string } }) {
  const { products, categories, addToCart } = useStore();
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [location, setLocation] = useLocation();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const activeCategory = params?.category;

  // Extract search query from URL if present
  const query = (() => {
    try {
      const q = location.split('?')[1];
      if (!q) return '';
      return new URLSearchParams(q).get('search') || '';
    } catch (e) {
      return '';
    }
  })();

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory ? 
      categories.find(c => c.slug === activeCategory)?.id === p.categoryId 
      : true;
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchesSearch = query ? (
      p.name.toLowerCase().includes(query.toLowerCase()) || (p.description || '').toLowerCase().includes(query.toLowerCase())
    ) : true;
    return matchesCategory && matchesPrice && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    // If product has attribute schema, open preview to select attributes first
    if (product.attributeSchema && product.attributeSchema.length > 0) {
      handleOpenPreview(product);
      return;
    }
    addToCart(product);
    toast({
      title: "Producto agregado",
      description: `${product.name} se agregó al carrito.`,
    });
  };

  const handleOpenPreview = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            {activeCategory ? categories.find(c => c.slug === activeCategory)?.name : 'Catálogo de Productos'}
          </h1>
          <p className="text-gray-600">{filteredProducts.length} productos disponibles</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
                <Filter size={20} /> Filtros
              </h3>
              
              {/* Categories Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-sm mb-4 text-gray-800 uppercase tracking-wide">Categorías</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => setLocation('/products')}
                    className={`block text-sm w-full text-left px-3 py-2 rounded-lg transition ${
                      !activeCategory 
                        ? 'bg-lime-100 text-lime-900 font-semibold' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Todas las categorías
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setLocation(`/category/${cat.slug}`)}
                      className={`block text-sm w-full text-left px-3 py-2 rounded-lg transition ${
                        activeCategory === cat.slug
                          ? 'bg-lime-100 text-lime-900 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-sm mb-6 text-gray-800 uppercase tracking-wide">Rango de Precio</h4>
                <Slider 
                  defaultValue={[0, 10000]} 
                  max={10000} 
                  step={100} 
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm font-semibold text-gray-700">
                  <span>S/. {priceRange[0]}</span>
                  <span>S/. {priceRange[1]}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            <Filter size={18} /> Filtros
          </button>

          {/* Mobile Filters Modal */}
          {mobileFiltersOpen && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileFiltersOpen(false)}>
              <div className="bg-white absolute bottom-0 left-0 right-0 rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Filtros</h3>
                  <button onClick={() => setMobileFiltersOpen(false)}><X size={24} /></button>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-sm mb-4 uppercase text-gray-800">Categorías</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => { setLocation('/products'); setMobileFiltersOpen(false); }}
                      className={`block text-sm w-full text-left px-3 py-2 rounded-lg transition ${
                        !activeCategory ? 'bg-lime-100 text-lime-900 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      Todas
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => { setLocation(`/category/${cat.slug}`); setMobileFiltersOpen(false); }}
                        className={`block text-sm w-full text-left px-3 py-2 rounded-lg transition ${
                          activeCategory === cat.slug ? 'bg-lime-100 text-lime-900 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-sm mb-4 uppercase text-gray-800">Rango de Precio</h4>
                  <Slider 
                    defaultValue={[0, 10000]} 
                    max={10000} 
                    step={100} 
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm font-semibold text-gray-700">
                    <span>S/. {priceRange[0]}</span>
                    <span>S/. {priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <p className="text-gray-600 text-lg mb-4">No se encontraron productos con estos filtros.</p>
                <Button 
                  onClick={() => { setPriceRange([0, 10000]); setLocation('/products'); }}
                  className="bg-lime-400 text-black hover:bg-lime-500"
                >
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredProducts.map(product => {
                  const discountPercent = product.onSale && product.originalPrice 
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : 0;
                  const originalPrice = product.originalPrice || product.price;
                  
                  return (
                    <Card 
                      key={product.id} 
                      className="group overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-lime-400 cursor-pointer flex flex-col h-full"
                      onClick={() => handleOpenPreview(product)}
                    >
                      {/* Product Image Container */}
                      <div className="aspect-square overflow-hidden bg-gray-100 relative">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Top Badges - Stack */}
                        <div className="absolute top-2 left-2 right-2 flex flex-col gap-1">
                          {product.featured && (
                            <Badge className="bg-lime-400 text-black font-bold border-0 text-xs w-fit">
                              ⭐ DESTACADO
                            </Badge>
                          )}
                          {product.onSale && discountPercent > 0 && (
                            <Badge className="bg-red-500 text-white font-bold border-0 text-xs w-fit">
                              -{discountPercent}%
                            </Badge>
                          )}
                          {product.stock < 3 && product.stock > 0 && (
                            <Badge className="bg-orange-500 text-white border-0 text-xs w-fit">
                              ¡{product.stock} left!
                            </Badge>
                          )}
                          {product.stock === 0 && (
                            <Badge className="bg-gray-800 text-white border-0 text-xs w-fit">
                              Agotado
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Product Info - Scrollable Section */}
                      <CardContent className="p-3 flex-1 flex flex-col justify-between">
                        {/* Category */}
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          {categories.find(c => c.id === product.categoryId)?.name}
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-sm leading-tight mb-2 text-gray-900 group-hover:text-lime-600 transition-colors line-clamp-2">
                          {product.name}
                        </h3>

                        {/* Description - Truncated */}
                        {product.description && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2 group-hover:text-gray-700">
                            {product.description}
                          </p>
                        )}

                        {/* Rating */}
                        {product.rating && (
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < (product.rating ?? 0) ? "text-yellow-400 text-xs" : "text-gray-300 text-xs"}>★</span>
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">({product.rating})</span>
                          </div>
                        )}

                        {/* Pricing Section */}
                        <div className="mb-2 pt-2 border-t border-gray-200">
                          {product.onSale && discountPercent > 0 ? (
                            <div>
                              <p className="text-xs text-gray-500 line-through">
                                S/ {originalPrice.toFixed(2)}
                              </p>
                              <p className="text-lg font-bold text-red-600">
                                S/ {product.price.toFixed(2)}
                              </p>
                            </div>
                          ) : (
                            <p className="text-lg font-bold text-gray-900">
                              S/ {product.price.toFixed(2)}
                            </p>
                          )}
                        </div>

                        {/* Stock Indicator */}
                        <div className="text-xs mb-2">
                          {product.stock > 5 ? (
                            <span className="text-green-600 font-semibold">✓ En stock</span>
                          ) : product.stock > 0 ? (
                            <span className="text-orange-600 font-semibold">⚠ {product.stock} disponibles</span>
                          ) : (
                            <span className="text-red-600 font-semibold">✗ Agotado</span>
                          )}
                        </div>

                        {/* Attributes Info */}
                        {product.attributeSchema && product.attributeSchema.length > 0 && (
                          <div className="text-xs mb-2 pt-1 border-t border-gray-100">
                            <div className="font-semibold text-gray-700 mb-1">Opciones:</div>
                            <div className="flex flex-wrap gap-1">
                              {product.attributeSchema.map(schema => (
                                <span key={schema.name} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                                  {schema.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* CTA Button */}
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // If product requires attributes, open modal; otherwise add directly
                            if (product.attributeSchema && product.attributeSchema.length > 0) {
                              handleOpenPreview(product);
                            } else {
                              handleAddToCart(product);
                            }
                          }}
                          disabled={product.stock === 0}
                          className={`w-full py-1.5 text-xs font-semibold rounded-lg transition ${
                            product.stock === 0 
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                              : 'bg-lime-400 text-black hover:bg-lime-500 active:scale-95'
                          }`}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" /> Agregar al Carrito
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Preview Modal */}
      <ProductPreviewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={(product, selectedAttributes) => {
          addToCart(product, selectedAttributes);
          toast({ title: 'Producto agregado', description: `${product.name} se agregó al carrito.` });
          setIsModalOpen(false);
        }}
      />
      
      <Footer />
    </div>
  );
}