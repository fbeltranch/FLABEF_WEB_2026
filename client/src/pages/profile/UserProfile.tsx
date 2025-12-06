import { useAuth } from "@/lib/mock-auth";
import { useStore } from "@/lib/mock-store";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Package, User as UserIcon, MapPin } from "lucide-react";

export default function UserProfile() {
  const { currentUser, logout } = useAuth();
  const { orders } = useStore();
  const [_, setLocation] = useLocation();

  if (!currentUser) {
    setLocation('/login');
    return null;
  }

  const myOrders = orders.filter(o => o.userId === currentUser.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-20 w-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon size={32} />
                </div>
                <h2 className="font-bold text-xl">{currentUser.fullName}</h2>
                <p className="text-sm text-muted-foreground mb-4">{currentUser.email}</p>
                <p className="text-xs border px-2 py-1 rounded-full inline-block mb-6">{currentUser.role}</p>
                
                <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => { logout(); setLocation('/'); }}>
                  <LogOut size={16} className="mr-2" /> Cerrar Sesión
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="md:col-span-3 space-y-6">
            <h1 className="text-2xl font-bold font-heading">Mis Pedidos</h1>
            
            {myOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Package size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Aún no has realizado ningún pedido.</p>
                  <Link href="/products">
                    <Button variant="link">Ir a comprar</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myOrders.map(order => (
                  <Card key={order.id}>
                    <CardHeader className="bg-gray-50/50 border-b py-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold">Pedido #{order.id}</p>
                          <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">S/. {order.total.toFixed(2)}</p>
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full capitalize">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2 mb-4">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="text-muted-foreground">S/. {item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-4">
                         <MapPin size={12} /> Enviado a: {order.address}
                      </div>
                    </CardContent>
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