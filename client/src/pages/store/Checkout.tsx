import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/lib/mock-auth";
import { useStore } from "@/lib/mock-store";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle, CreditCard, Truck, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const checkoutSchema = z.object({
  fullName: z.string().min(3, "Nombre completo requerido"),
  email: z.string().email("Email inválido"),
  address: z.string().min(5, "Dirección de envío requerida"),
  city: z.string().min(3, "Ciudad requerida"),
  phone: z.string().min(9, "Teléfono requerido"),
  cardNumber: z.string().min(16, "Número de tarjeta inválido"),
  expiry: z.string().min(5, "Fecha inválida (MM/YY)"),
  cvc: z.string().min(3, "CVC inválido")
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
      cardNumber: "",
      expiry: "",
      cvc: ""
    }
  });

  const onSubmit = async (data: CheckoutForm) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const userId = currentUser?.id || 'guest';
    await placeOrder(userId, `${data.address}, ${data.city}`);
    
    setIsProcessing(false);
    setStep('success');
    toast({
      title: "¡Pedido Confirmado!",
      description: "Gracias por tu compra en FLABEF.",
    });
  };

  if (cart.length === 0 && step !== 'success') {
    setLocation('/products');
    return null;
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-2xl font-bold mb-2">¡Gracias por tu compra!</h1>
          <p className="text-muted-foreground mb-8">Tu pedido ha sido confirmado y está siendo procesado. Recibirás un correo con los detalles.</p>
          <Button className="w-full" onClick={() => setLocation('/')}>Volver a la Tienda</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-heading font-bold mb-8">Finalizar Compra</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MapPin className="text-primary" /> Dirección de Envío</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre Completo</Label>
                      <Input {...form.register('fullName')} />
                      {form.formState.errors.fullName && <p className="text-xs text-red-500">{form.formState.errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Teléfono</Label>
                      <Input {...form.register('phone')} />
                      {form.formState.errors.phone && <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input {...form.register('email')} />
                    {form.formState.errors.email && <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Dirección</Label>
                      <Input placeholder="Av. Principal 123..." {...form.register('address')} />
                      {form.formState.errors.address && <p className="text-xs text-red-500">{form.formState.errors.address.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Ciudad</Label>
                      <Input {...form.register('city')} />
                      {form.formState.errors.city && <p className="text-xs text-red-500">{form.formState.errors.city.message}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CreditCard className="text-primary" /> Método de Pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 mb-4">
                    <p>Modo de Prueba: No se realizarán cargos reales. Usa cualquier número ficticio.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Número de Tarjeta</Label>
                    <Input placeholder="0000 0000 0000 0000" maxLength={19} {...form.register('cardNumber')} />
                    {form.formState.errors.cardNumber && <p className="text-xs text-red-500">{form.formState.errors.cardNumber.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vencimiento (MM/YY)</Label>
                      <Input placeholder="12/25" maxLength={5} {...form.register('expiry')} />
                      {form.formState.errors.expiry && <p className="text-xs text-red-500">{form.formState.errors.expiry.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>CVC</Label>
                      <Input placeholder="123" maxLength={3} {...form.register('cvc')} />
                      {form.formState.errors.cvc && <p className="text-xs text-red-500">{form.formState.errors.cvc.message}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full h-12 text-lg" disabled={isProcessing}>
                {isProcessing ? <Loader2 className="animate-spin mr-2" /> : `Pagar S/. ${total.toFixed(2)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
               <h3 className="font-bold text-lg mb-4">Resumen</h3>
               <div className="space-y-4">
                 {cart.map(item => (
                   <div key={item.id} className="flex justify-between text-sm">
                     <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                     <span className="font-medium">S/. {(item.price * item.quantity).toFixed(2)}</span>
                   </div>
                 ))}
                 <Separator />
                 <div className="flex justify-between text-muted-foreground">
                   <span>Subtotal</span>
                   <span>S/. {subtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-muted-foreground">
                   <span>Envío</span>
                   <span>{shipping === 0 ? 'Gratis' : `S/. ${shipping.toFixed(2)}`}</span>
                 </div>
                 <Separator />
                 <div className="flex justify-between font-bold text-lg">
                   <span>Total</span>
                   <span>S/. {total.toFixed(2)}</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}