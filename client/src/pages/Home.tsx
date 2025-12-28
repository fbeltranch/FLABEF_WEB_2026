import { useState, useEffect } from "react";
import { useStore } from "@/lib/mock-store";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Truck, Shield, Zap, Star, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductPreviewModal from "@/components/ProductPreviewModal";
import type { Product } from "@/lib/mock-store";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Home() {
  const { categories, products, addToCart } = useStore();
  const [_, setLocation] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 23, minutes: 45, seconds: 30 });

  const featuredProducts = products.filter(p => p.featured).slice(0, 8);
  const saleProducts = products.filter(p => p.onSale).slice(0, 4);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleOpenPreview = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* HERO BANNER - CYBER FLABEF */}
      <section className="w-full bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70"></div>
        <div className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center">
          {/* Background Image Grid */}
          <div className="absolute inset-0 opacity-40">
            <div className="grid grid-cols-3 gap-4 h-full p-8">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg"></div>
              <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg"></div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg"></div>
            </div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-block bg-gradient-to-r from-lime-400 to-lime-500 text-black px-6 py-2 rounded-full font-bold text-sm mb-6 shadow-lg">
                CYBER FLABEF
              </div>

              {/* Main Title */}
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                OFERTAS<br />
                <span className="bg-gradient-to-r from-lime-400 to-lime-300 bg-clip-text text-transparent">
                  IMBATIBLES
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light">
                Hasta 60% dscto. en Tecnología, Moda y Hogar.
              </p>

              {/* CTA Button */}
              <Button 
                size="lg" 
                onClick={() => setLocation('/products')}
                className="h-16 px-10 text-lg font-bold bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-500 hover:to-lime-600 text-black rounded-full shadow-lg transform hover:scale-105 transition-all"
              >
                Comprar Ahora
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PROMO BAR */}
      <div className="bg-gradient-to-r from-lime-50 to-white text-black py-3 px-4 text-center font-medium text-sm md:text-base border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-center gap-3">
          <Shield className="h-5 w-5 text-lime-600" />
          <span>Envíos gratis en compras desde <strong>S/.200</strong> • Pago 100% seguro • Soporte 24/7</span>
        </div>
      </div>

      {/* BENEFITS SECTION */}
      <section className="bg-gray-50 py-12 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Envío Gratis */}
            <div className="benefit-card">
              <div className="flex justify-center mb-3">
                <Truck className="h-8 w-8 text-black" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1">Envío Gratis</h3>
              <p className="text-xs md:text-sm text-gray-600">En compras sobre S/. 200</p>
            </div>

            {/* Garantía */}
            <div className="benefit-card">
              <div className="flex justify-center mb-3">
                <Shield className="h-8 w-8 text-black" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1">Garantía Extendida</h3>
              <p className="text-xs md:text-sm text-gray-600">Compra 100% Protegida</p>
            </div>

            <div className="benefit-card">
              <div className="flex justify-center mb-3">
                <Zap className="h-8 w-8 text-black" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1">Soporte 24/7</h3>
              <p className="text-xs md:text-sm text-gray-600">Asistencia rápida y confiable</p>
            </div>

            {/* Top Brands */}
            <div className="benefit-card">
              <div className="flex justify-center mb-3">
                <Star className="h-8 w-8 text-black" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1">Top Brands</h3>
              <p className="text-xs md:text-sm text-gray-600">Marcas Originales</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      {featuredProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-black">
                Destacados
              </h2>
              <Link href="/products">
                <a className="text-black hover:text-primary font-bold flex items-center gap-1 border-b-2 border-primary pb-1">
                  Ver Todos <ChevronRight className="h-4 w-4" />
                </a>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {featuredProducts.map(product => {
                const discountPercent = product.onSale && product.originalPrice
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0;
                
                return (
                  <div 
                    key={product.id} 
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-lime-400 cursor-pointer rounded-lg bg-white flex flex-col h-full"
                    onClick={() => handleOpenPreview(product)}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Top Badges - Stack */}
                      <div className="absolute top-2 left-2 right-2 flex flex-col gap-1">
                        {product.featured && (
                          <div className="bg-lime-400 text-black font-bold border-0 text-xs w-fit px-2 py-1 rounded">
                            ⭐ DESTACADO
                          </div>
                        )}
                        {product.onSale && discountPercent > 0 && (
                          <div className="bg-red-500 text-white font-bold border-0 text-xs w-fit px-2 py-1 rounded">
                            -{discountPercent}%
                          </div>
                        )}
                        {product.stock < 3 && product.stock > 0 && (
                          <div className="bg-orange-500 text-white border-0 text-xs w-fit px-2 py-1 rounded">
                            ¡{product.stock} left!
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="bg-gray-800 text-white border-0 text-xs w-fit px-2 py-1 rounded">
                            Agotado
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      {/* Category */}
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Destacado
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
                              S/ {product.originalPrice?.toFixed(2)}
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

                      {/* CTA Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (product.attributeSchema && product.attributeSchema.length > 0) {
                            handleOpenPreview(product);
                          } else {
                            addToCart(product);
                          }
                        }}
                        disabled={product.stock === 0}
                        className={`w-full py-1.5 text-xs font-semibold rounded-lg transition ${
                          product.stock === 0 
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                            : 'bg-lime-400 text-black hover:bg-lime-500 active:scale-95'
                        }`}
                      >
                        🛒 Agregar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SALE SECTION */}
      {saleProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
          <div className="container mx-auto px-4">
            {/* Header con Timer */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                    <span className="text-xl">🔥</span> OFERTAS RELÁMPAGO
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Productos con descuento limitado</p>
              </div>
              {/* Timer */}
              <div className="bg-red-50 border-2 border-red-300 rounded-lg px-6 py-3 animate-pulse">
                <p className="text-xs text-red-600 font-semibold uppercase tracking-wide mb-1">Termina en:</p>
                <p className="text-2xl font-black text-red-600">{String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {saleProducts.map(product => {
                const discountPercent = product.onSale && product.originalPrice 
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 40;
                const originalPrice = product.originalPrice || product.price * 1.67;
                
                return (
                  <div 
                    key={product.id} 
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-red-300 hover:border-red-500 cursor-pointer rounded-xl bg-white hover:scale-105 transform flex flex-col h-full"
                    onClick={() => handleOpenPreview(product)}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Big Discount Badge */}
                      <div className="absolute top-2 right-2 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center flex-col shadow-lg transform group-hover:scale-110 transition-transform">
                        <p className="text-2xl font-black">{discountPercent}%</p>
                        <p className="text-xs font-bold">DSCTO</p>
                      </div>

                      {/* Flash Badge */}
                      <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                        ⚡ FLASH
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      {/* Title */}
                      <h3 className="font-bold text-sm leading-tight mb-2 text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Attribute Tags */}
                      {product.attributeSchema && product.attributeSchema.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1">
                          {product.attributeSchema.slice(0, 2).map(schema => (
                            <span key={schema.name} className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-medium">
                              {schema.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Pricing */}
                      <div className="mb-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 line-through">
                          S/ {originalPrice.toFixed(2)}
                        </p>
                        <p className="text-xl font-black text-red-600">
                          S/ {product.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-green-600 font-semibold">
                          Ahorras: S/ {(originalPrice - product.price).toFixed(2)}
                        </p>
                      </div>

                      {/* Stock Bar */}
                      <div className="mb-2">
                        <p className="text-xs text-gray-600 mb-1 font-semibold">Stock: {product.stock}/50</p>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all"
                            style={{ width: `${(product.stock / 50) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPreview(product);
                        }}
                        className="w-full py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold rounded-lg transition active:scale-95"
                      >
                        🛒 Comprar Ahora
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Warning Banner */}
            <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-red-700 font-semibold">
                ⏰ <strong>¡Oferta limitada!</strong> Los productos se agotan rápidamente. Stock limitado por cliente (máx 2 unidades).
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIES GRID */}
      <section className="py-12 md:py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black mb-8">Compra por Categoría</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map(category => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <a className="group bg-gradient-to-br from-gray-100 to-gray-200 hover:from-lime-50 hover:to-lime-100 p-6 rounded-lg text-center transition-all border border-gray-200 hover:border-lime-300">
                  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                    {category.icon === 'shirt' && '👕'}
                    {category.icon === 'cpu' && '💻'}
                    {category.icon === 'smartphone' && '📱'}
                    {category.icon === 'washing-machine' && '🏠'}
                    {category.icon === 'utensils' && '🍽️'}
                    {category.icon === 'server' && '⚙️'}
                    {category.icon === 'home' && '🏠'}
                    {category.icon === 'heart' && '❤️'}
                    {category.icon === 'dog' && '🐕'}
                    {category.icon === 'gamepad' && '🎮'}
                    {category.icon === 'dumbbell' && '💪'}
                    {category.icon === 'baby' && '👶'}
                  </div>
                  <h3 className="font-bold text-sm md:text-base">{category.name}</h3>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview Modal */}
      <ProductPreviewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <Footer />
    </div>
  );
}