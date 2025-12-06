import { useStore } from "@/lib/mock-store";
import { Link, useLocation } from "wouter";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { Separator } from "@/components/ui/separator";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useStore();
  const [_, setLocation] = useLocation();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 200 ? 0 : 15; // Free shipping over S/. 200
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
           <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
             <ShoppingCart size={48} />
           </div>
           <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
           <p className="text-muted-foreground mb-6">Parece que aún no has agregado productos.</p>
           <Link href="/products">
             <Button size="lg">Ir a Comprar</Button>
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-heading font-bold mb-8">Carrito de Compras</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-24 w-24 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">S/. {item.price.toFixed(2)}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={18} />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border rounded-md">
                        <button 
                          className="h-8 w-8 flex items-center justify-center hover:bg-gray-100"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          className="h-8 w-8 flex items-center justify-center hover:bg-gray-100"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="ml-auto font-bold">
                        S/. {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Resumen del Pedido</h3>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>S/. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Envío</span>
                  <span>{shipping === 0 ? 'Gratis' : `S/. ${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded text-center">
                    ¡Envío gratis aplicado!
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg text-foreground">
                  <span>Total</span>
                  <span>S/. {total.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full h-12 text-base" onClick={() => setLocation('/checkout')}>
                Procesar Compra <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
                <ShieldCheck size={16} />
                <span className="text-xs">Pago 100% Seguro y Encriptado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}