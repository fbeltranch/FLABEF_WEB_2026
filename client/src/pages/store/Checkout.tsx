import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/lib/mock-auth";
import { useStore } from "@/lib/mock-store";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle, CreditCard, Truck, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const paymentMethods = [
  { id: 'yape', label: 'Yape', icon: '💳' },
  { id: 'plin', label: 'Plin', icon: '📱' },
  { id: 'efectivo', label: 'Pago en Efectivo', icon: '💵' },
  { id: 'transferencia', label: 'Transferencia Bancaria', icon: '🏦' }
];

const checkoutSchema = z.object({
  fullName: z.string().min(3, "Nombre completo requerido"),
  email: z.string().email("Email inválido"),
  address: z.string().min(5, "Dirección de envío requerida"),
  city: z.string().min(3, "Ciudad requerida"),
  phone: z.string().min(9, "Teléfono requerido"),
  paymentMethod: z.enum(['yape', 'plin', 'efectivo', 'transferencia'], {
    errorMap: () => ({ message: "Selecciona un método de pago" })
  })
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { cart, placeOrder, clearCart } = useStore();
  const { currentUser } = useAuth();
  const [location, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: currentUser?.fullName || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      address: "",
      city: "Lima",
      paymentMethod: undefined
    }
  });

  const onSubmit = async (data: CheckoutForm) => {
    setIsProcessing(true);
    
    const cartItems = cart.map(item => `${item.quantity}x ${item.name} (S/. ${item.price})`).join('\n');
    const paymentMethodLabel = paymentMethods.find(m => m.id === data.paymentMethod)?.label;
    
    const message = `Hola, me gustaría confirmar mi compra en FLABEF:\n\n*DATOS DE CONTACTO*\nNombre: ${data.fullName}\nTeléfono: ${data.phone}\nEmail: ${data.email}\nDirección: ${data.address}, ${data.city}\n\n*PRODUCTOS*\n${cartItems}\n\n*RESUMEN DE COMPRA*\nSubtotal: S/. ${subtotal.toFixed(2)}\nEnvío: ${shipping === 0 ? 'Gratis' : `S/. ${shipping.toFixed(2)}`}\nTotal: S/. ${total.toFixed(2)}\n\n*MÉTODO DE PAGO*\n${paymentMethodLabel}`;

    const whatsappNumber = '51912345678';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    const userId = currentUser?.id || 'guest';
    await placeOrder(userId, {
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      address: `${data.address}, ${data.city}`
    });
    
    window.open(whatsappUrl, '_blank');
    
    setIsProcessing(false);
    setStep('success');
    toast({
      title: "¡Redirigiendo a WhatsApp!",
      description: "Confirma tu pedido en la conversación de WhatsApp.",
    });
  };

  if (cart.length === 0 && step !== 'success') {
    setLocation('/products');
    return null;
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-200">
          <div className="h-24 w-24 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-3xl font-bold mb-3 text-gray-900">¡Compra Enviada!</h1>
          <p className="text-gray-600 mb-2">Se abrirá una conversación en WhatsApp.</p>
          <p className="text-gray-600 mb-8">Por favor confirma los detalles de tu pedido con nosotros.</p>
          <Button 
            className="w-full bg-lime-400 text-black hover:bg-lime-500 font-semibold" 
            onClick={() => setLocation('/')}
          >
            Volver a la Tienda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Finalizar Compra</h1>
          <p className="text-gray-600">Completa tus datos y elige método de pago</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Shipping Address Card */}
              <Card className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <MapPin size={24} className="text-lime-600" /> 
                    Dirección de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-900">Nombre Completo</Label>
                      <Input 
                        {...form.register('fullName')} 
                        className="border border-gray-300 rounded-lg h-11"
                        placeholder="Tu nombre completo"
                      />
                      {form.formState.errors.fullName && <p className="text-xs text-red-500">{form.formState.errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-900">Teléfono</Label>
                      <Input 
                        {...form.register('phone')} 
                        className="border border-gray-300 rounded-lg h-11"
                        placeholder="987654321"
                      />
                      {form.formState.errors.phone && <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-900">Email</Label>
                    <Input 
                      {...form.register('email')} 
                      className="border border-gray-300 rounded-lg h-11"
                      placeholder="tu@email.com"
                    />
                    {form.formState.errors.email && <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-900">Dirección</Label>
                      <Input 
                        placeholder="Av. Principal 123..." 
                        {...form.register('address')} 
                        className="border border-gray-300 rounded-lg h-11"
                      />
                      {form.formState.errors.address && <p className="text-xs text-red-500">{form.formState.errors.address.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-900">Ciudad</Label>
                      <Input 
                        {...form.register('city')} 
                        className="border border-gray-300 rounded-lg h-11"
                      />
                      {form.formState.errors.city && <p className="text-xs text-red-500">{form.formState.errors.city.message}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method Card */}
              <Card className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <CreditCard size={24} className="text-lime-600" /> 
                    Método de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="p-4 bg-lime-50 border border-lime-200 rounded-lg text-sm text-lime-900">
                    <p className="font-semibold mb-1">Compra segura por WhatsApp</p>
                    <p>Elige tu método de pago preferido y confirmarás los detalles en nuestra conversación de WhatsApp.</p>
                  </div>
                  <div className="space-y-3">
                    {paymentMethods.map(method => (
                      <label key={method.id} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition duration-200 hover:border-lime-300">
                        <input
                          type="radio"
                          value={method.id}
                          {...form.register('paymentMethod')}
                          className="w-5 h-5 text-lime-400"
                        />
                        <span className="ml-4">
                          <span className="text-lg mr-2">{method.icon}</span>
                          <span className="font-semibold text-gray-900">{method.label}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  {form.formState.errors.paymentMethod && (
                    <p className="text-xs text-red-500">{form.formState.errors.paymentMethod.message}</p>
                  )}
                </CardContent>
              </Card>

              {/* CTA Button */}
              <Button 
                type="submit" 
                className="w-full h-13 text-base bg-lime-400 text-black hover:bg-lime-500 font-bold rounded-lg flex items-center justify-center gap-2" 
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <><Loader2 className="animate-spin w-5 h-5" /> Procesando...</>
                ) : (
                  <><MessageCircle className="w-5 h-5" /> Comprar por WhatsApp</>
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-32">
              <h3 className="font-bold text-xl mb-6 text-gray-900">Resumen de Pedido</h3>
              
              {/* Items List */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.quantity}x {item.name}</span>
                    <span className="font-semibold text-gray-900">S/ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Envío</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-lime-600 font-bold">Gratis</span>
                    ) : (
                      <>S/ {shipping.toFixed(2)}</>
                    )}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center pt-3">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-lime-600">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-900 text-sm">
                <ShieldCheck size={18} className="text-green-600 flex-shrink-0" />
                <span className="font-semibold">Pago 100% Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}