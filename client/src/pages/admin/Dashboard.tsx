import { useState } from 'react';
import { useAuth } from '@/lib/mock-auth';
import { useStore, Product, Category } from '@/lib/mock-store';
import { Link, useLocation } from 'wouter';
import { 
  Shield, Users, AlertTriangle, Lock, LogOut, Search, 
  Package, ShoppingBag, LayoutGrid, TrendingUp, Plus, 
  Edit, Trash2, CheckCircle, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { recoveryAttempts, users, unlockUser, logout, currentUser } = useAuth();
  const { 
    products, categories, orders, 
    addProduct, updateProduct, deleteProduct, 
    addCategory, deleteCategory, updateOrderStatus 
  } = useStore();
  
  const [_, setLocation] = useLocation();
  
  // Redirect if not admin (simple check)
  if (!currentUser || !['super_admin', 'admin_gestor', 'admin_basico'].includes(currentUser.role)) {
    setLocation('/login');
    return null;
  }

  const blockedUsers = users.filter(u => u.blocked);

  // Stats
  const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  // State for forms
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', description: '', price: 0, stock: 0, categoryId: '', image: ''
  });

  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.categoryId) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, newProduct);
      toast({ title: "Producto actualizado", description: "El producto ha sido modificado correctamente." });
    } else {
      addProduct({
        ...newProduct as Product,
        id: Math.random().toString(36).substr(2, 9),
        rating: 5
      });
      toast({ title: "Producto creado", description: "El nuevo producto ha sido agregado al catálogo." });
    }
    setIsProductDialogOpen(false);
    setEditingProduct(null);
    setNewProduct({ name: '', description: '', price: 0, stock: 0, categoryId: '', image: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white">
             <Shield size={18} />
           </div>
           <span className="font-heading font-bold text-xl text-primary">FLABEF Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground font-medium hidden md:inline-block">
            {currentUser.fullName} ({currentUser.role.replace('_', ' ')})
          </span>
          <Button variant="outline" size="sm" onClick={() => { logout(); setLocation('/'); }}>
            <LogOut size={16} className="mr-2" /> Salir
          </Button>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border p-1 h-auto flex-wrap">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white">Resumen</TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-white">Productos</TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-primary data-[state=active]:text-white">Categorías</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-white">Pedidos</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-white">Usuarios</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-white">Seguridad</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex justify-between items-start">
                   <div>
                     <p className="text-sm text-muted-foreground font-medium">Ventas Totales</p>
                     <h3 className="text-2xl font-bold mt-2">S/. {totalSales.toFixed(2)}</h3>
                   </div>
                   <div className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={20} /></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex justify-between items-start">
                   <div>
                     <p className="text-sm text-muted-foreground font-medium">Pedidos Pendientes</p>
                     <h3 className="text-2xl font-bold mt-2">{pendingOrders}</h3>
                   </div>
                   <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Package size={20} /></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex justify-between items-start">
                   <div>
                     <p className="text-sm text-muted-foreground font-medium">Usuarios Totales</p>
                     <h3 className="text-2xl font-bold mt-2">{users.length}</h3>
                   </div>
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex justify-between items-start">
                   <div>
                     <p className="text-sm text-muted-foreground font-medium">Productos</p>
                     <h3 className="text-2xl font-bold mt-2">{products.length}</h3>
                   </div>
                   <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><ShoppingBag size={20} /></div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-lg mb-4">Últimos Pedidos</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">Pedido #{order.id}</p>
                        <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">S/. {order.total.toFixed(2)}</p>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-lg mb-4">Logs de Seguridad Recientes</h3>
                <div className="space-y-4">
                  {recoveryAttempts.slice(0, 5).map(log => (
                    <div key={log.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium capitalize">{log.method.replace('_', ' + ')} Recovery</p>
                        <p className="text-xs text-muted-foreground">{log.ip}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* PRODUCTS TAB */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar productos..." className="pl-8" />
              </div>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingProduct(null); setNewProduct({}); }}>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Nombre</Label>
                      <Input className="col-span-3" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Precio (S/.)</Label>
                      <Input type="number" className="col-span-3" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Stock</Label>
                      <Input type="number" className="col-span-3" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Categoría</Label>
                      <Select value={newProduct.categoryId} onValueChange={v => setNewProduct({...newProduct, categoryId: v})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Imagen URL</Label>
                      <Input className="col-span-3" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Descripción</Label>
                      <Textarea className="col-span-3" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSaveProduct}>Guardar Producto</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-muted-foreground font-medium">
                  <tr>
                    <th className="px-6 py-3">Producto</th>
                    <th className="px-6 py-3">Categoría</th>
                    <th className="px-6 py-3">Precio</th>
                    <th className="px-6 py-3">Stock</th>
                    <th className="px-6 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 flex items-center gap-3">
                        <img src={product.image} className="h-10 w-10 rounded object-cover bg-gray-100" alt={product.name} />
                        <span className="font-medium">{product.name}</span>
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {categories.find(c => c.id === product.categoryId)?.name}
                      </td>
                      <td className="px-6 py-3 font-medium">S/. {product.price.toFixed(2)}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${product.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {product.stock} un.
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Button variant="ghost" size="icon" aria-label={`Editar ${product.name}`} title={`Editar ${product.name}`} onClick={() => { setEditingProduct(product); setNewProduct(product); setIsProductDialogOpen(true); }}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label={`Eliminar ${product.name}`} title={`Eliminar ${product.name}`} className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteProduct(product.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders" className="space-y-6">
             <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-muted-foreground font-medium">
                  <tr>
                    <th className="px-6 py-3">ID Pedido</th>
                    <th className="px-6 py-3">Cliente</th>
                    <th className="px-6 py-3">Fecha</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3">Dirección</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono">#{order.id}</td>
                      <td className="px-6 py-3">{users.find(u => u.id === order.userId)?.fullName || 'Guest'}</td>
                      <td className="px-6 py-3 text-muted-foreground">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="px-6 py-3 font-bold">S/. {order.total.toFixed(2)}</td>
                      <td className="px-6 py-3">
                        <Select 
                          defaultValue={order.status} 
                          onValueChange={(val) => updateOrderStatus(order.id, val as any)}
                        >
                          <SelectTrigger className="h-8 w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="processing">Procesando</SelectItem>
                            <SelectItem value="shipped">Enviado</SelectItem>
                            <SelectItem value="delivered">Entregado</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-3 text-xs max-w-[200px] truncate" title={order.address}>{order.address}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No hay pedidos registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* CATEGORIES TAB */}
          <TabsContent value="categories" className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {categories.map(cat => (
                 <div key={cat.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-primary/5 rounded-lg flex items-center justify-center text-primary font-bold">
                       {cat.name.charAt(0)}
                     </div>
                     <div>
                       <p className="font-medium">{cat.name}</p>
                       <p className="text-xs text-muted-foreground">/{cat.slug}</p>
                     </div>
                   </div>
                   <Button variant="ghost" size="icon" aria-label={`Eliminar categoría ${cat.name}`} title={`Eliminar ${cat.name}`} className="text-red-500 hover:bg-red-50" onClick={() => deleteCategory(cat.id)}>
                     <Trash2 size={16} />
                   </Button>
                 </div>
               ))}
               <div className="bg-gray-50 p-4 rounded-xl border border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => toast({description: "Funcionalidad simplificada para este demo"})}>
                 <div className="text-center text-muted-foreground">
                   <Plus className="mx-auto mb-1" />
                   <span className="text-sm font-medium">Agregar Categoría</span>
                 </div>
               </div>
             </div>
          </TabsContent>

          {/* USERS TAB (Existing) */}
          <TabsContent value="users">
             <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                  <h3 className="font-bold text-lg">Gestión de Usuarios</h3>
                  <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input placeholder="Buscar por DNI..." className="h-9 pl-8 w-[200px]" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-muted-foreground font-medium">
                      <tr>
                        <th className="px-6 py-3">Nombre</th>
                        <th className="px-6 py-3">DNI</th>
                        <th className="px-6 py-3">Rol</th>
                        <th className="px-6 py-3">Estado</th>
                        <th className="px-6 py-3">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 font-medium">{user.fullName}</td>
                          <td className="px-6 py-3 text-muted-foreground">{user.dni}</td>
                          <td className="px-6 py-3">
                            <Badge variant="outline" className="uppercase text-[10px]">{user.role.replace('_', ' ')}</Badge>
                          </td>
                          <td className="px-6 py-3">
                            {user.blocked ? <Badge variant="destructive">Bloqueado</Badge> : <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Activo</Badge>}
                          </td>
                          <td className="px-6 py-3">
                            {user.blocked && (
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => unlockUser(user.id)}>
                                Desbloquear
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </TabsContent>

          {/* SECURITY TAB (Existing) */}
          <TabsContent value="security">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
             <div className="p-6 border-b flex justify-between items-center">
               <h3 className="font-bold text-lg">Auditoría de Seguridad</h3>
               <Button variant="ghost" size="sm">Exportar CSV</Button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 text-muted-foreground font-medium">
                   <tr>
                     <th className="px-6 py-3">Hora</th>
                     <th className="px-6 py-3">ID Usuario</th>
                     <th className="px-6 py-3">Método</th>
                     <th className="px-6 py-3">IP Origen</th>
                     <th className="px-6 py-3">Resultado</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y">
                   {recoveryAttempts.map((log) => (
                     <tr key={log.id} className="hover:bg-gray-50">
                       <td className="px-6 py-3 text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</td>
                       <td className="px-6 py-3 font-medium">{log.userId}</td>
                       <td className="px-6 py-3 capitalize">{log.method.replace('_', ' + ')}</td>
                       <td className="px-6 py-3 font-mono text-xs">{log.ip}</td>
                       <td className="px-6 py-3">
                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                           log.status === 'success' ? 'bg-green-100 text-green-700' : 
                           log.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                         }`}>
                           {log.status}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}