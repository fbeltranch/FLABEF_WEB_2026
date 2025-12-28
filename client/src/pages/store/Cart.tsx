import { useStore } from "@/lib/mock-store";
import { Link, useLocation } from "wouter";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, ShieldCheck, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useStore();
  const [_, setLocation] = useLocation();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="h-32 w-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-8">
            <ShoppingCart size={64} />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gray-900">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8 text-center max-w-sm">Descubre nuestros productos exclusivos y crea tu perfecto carrito de compras.</p>
          <Link href="/products">
            <Button size="lg" className="bg-lime-400 text-black hover:bg-lime-500 font-semibold">
              <ShoppingCart className="mr-2 h-4 w-4" /> Ir a Comprar
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Carrito de Compras</h1>
          <p className="text-gray-600">{cart.length} {cart.length === 1 ? 'producto' : 'productos'} en tu carrito</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="h-28 w-28 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h3>
                          <p className="text-2xl font-bold text-gray-900">S/ {item.price.toFixed(2)}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          aria-label={`Eliminar ${item.name}`}
                          title={`Eliminar ${item.name}`}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full" 
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 size={20} />
                        </Button>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button 
                            className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 text-gray-700"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            aria-label={`Disminuir cantidad de ${item.name}`}
                            title={`Disminuir cantidad`}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                          <button 
                            className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 text-gray-700"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label={`Aumentar cantidad de ${item.name}`}
                            title={`Aumentar cantidad`}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="ml-auto">
                          <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                          <p className="text-xl font-bold text-gray-900">
                            S/ {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-96">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-32">
              {/* Free Shipping Banner */}
              {shipping === 0 && (
                <div className="bg-lime-50 border border-lime-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                  <Tag size={20} className="text-lime-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-lime-900">¡Envío Gratis!</p>
                    <p className="text-sm text-lime-800">Tu compra califica para envío gratuito</p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <h3 className="font-bold text-xl mb-6 text-gray-900">Resumen</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Envío</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-lime-600">Gratis</span>
                    ) : (
                      <>S/ {shipping.toFixed(2)}</>
                    )}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-lime-600">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button 
                className="w-full h-12 text-base bg-lime-400 text-black hover:bg-lime-500 font-semibold rounded-lg mb-4" 
                onClick={() => setLocation('/checkout')}
              >
                Procesar Compra <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              {/* Continue Shopping */}
              <Link href="/products">
                <Button 
                  variant="outline" 
                  className="w-full h-10 border-gray-300 text-gray-900 hover:bg-gray-50"
                >
                  Continuar Comprando
                </Button>
              </Link>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-600 text-sm">
                <ShieldCheck size={16} className="text-green-600" />
                <span>Pago 100% Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}