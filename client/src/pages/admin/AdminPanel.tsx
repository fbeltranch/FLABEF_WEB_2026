import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Settings, Palette, CreditCard, LogOut, Home, BarChart3, Filter, Zap, Plus, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useStore, Product, Category, FlashSale, Order } from "@/lib/mock-store";
import { useAuth } from "@/lib/mock-auth";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OrderPreviewModal from "@/components/OrderPreviewModal";

export default function AdminPanel() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("general");

  // Verificar token de admin
  const isAdmin = sessionStorage.getItem("adminToken") === "true";

  if (!isAdmin) {
    setLocation("/");
    return null;
  }

  // Estado para configuración general
  const [config, setConfig] = useState({
    storeName: "FLABEF E-Commerce",
    whatsappNumber: "51912345678",
    storeDescription: "Tienda de ropa y accesorios de calidad"
  });

  // Estado para colores
  const [colors, setColors] = useState({
    navbarColor: "#000000",
    footerColor: "#000000",
    primaryColor: "#0066ff"
  });

  // Productos, categorías y flash sales desde el store
  const products = useStore(state => state.products);
  const categories = useStore(state => state.categories);
  const flashSales = useStore(state => state.flashSales);
  const addProduct = useStore(state => state.addProduct);
  const updateProduct = useStore(state => state.updateProduct);
  const deleteProduct = useStore(state => state.deleteProduct);
  const addCategory = useStore(state => state.addCategory);
  const deleteCategory = useStore(state => state.deleteCategory);
  const addFlashSale = useStore(state => state.addFlashSale);
  const updateFlashSale = useStore(state => state.updateFlashSale);
  const deleteFlashSale = useStore(state => state.deleteFlashSale);
  const orders = useStore(state => state.orders);
  const updateOrderStatus = useStore(state => state.updateOrderStatus);

  const auth = useAuth();
  const invoicePrefix = useStore(state => state.invoicePrefix);
  const invoiceNextNumber = useStore(state => state.invoiceNextNumber);
  const invoiceDigits = useStore(state => state.invoiceDigits);
  const setInvoicePrefix = useStore(state => state.setInvoicePrefix);
  const setInvoiceNextNumber = useStore(state => state.setInvoiceNextNumber);
  const setInvoiceDigits = useStore(state => state.setInvoiceDigits);
  const invoiceAudit = useStore(state => state.invoiceAudit);

  // Local inputs to avoid logging on every keystroke
  const [localInvoicePrefix, setLocalInvoicePrefix] = useState(invoicePrefix);
  const [localInvoiceNextNumber, setLocalInvoiceNextNumber] = useState(String(invoiceNextNumber));
  const [localInvoiceDigits, setLocalInvoiceDigits] = useState(String(invoiceDigits));

  // Product form state
  const emptyProductForm: Partial<Product> = {
    name: '',
    description: '',
    price: 0,
    categoryId: categories[0]?.id || '',
    image: '',
    images: [],
    stock: 0,
    featured: false,
    onSale: false,
    available: true
  };

  const [productForm, setProductForm] = useState<Partial<Product>>(emptyProductForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');

  // States for attribute/variant management
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const selectedProduct = products.find(p => p.id === selectedProductId) || null;

  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrType, setNewAttrType] = useState<'select' | 'multiselect'>('select');
  const [newAttrOptions, setNewAttrOptions] = useState('');
  const [editingAttrIndex, setEditingAttrIndex] = useState<number | null>(null);
  const [editAttrName, setEditAttrName] = useState('');
  const [editAttrType, setEditAttrType] = useState<'select' | 'multiselect'>('select');
  const [editAttrOptions, setEditAttrOptions] = useState('');

  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantPrice, setNewVariantPrice] = useState<number | null>(0);
  const [newVariantStock, setNewVariantStock] = useState<number | null>(0);
  const [newVariantAttrs, setNewVariantAttrs] = useState<Record<string,string>>({});

  // Handlers for attributes and variants
  const handleAddAttribute = () => {
    if (!selectedProduct) return toast({ title: 'Selecciona un producto' });
    if (!newAttrName) return toast({ title: 'Nombre de atributo requerido' });
    const options = newAttrOptions.split(',').map(s => s.trim()).filter(Boolean);
    const attr = { name: newAttrName, type: newAttrType, options };
    const updated = [...(selectedProduct.attributeSchema || []), attr];
    updateProduct(selectedProduct.id, { attributeSchema: updated });
    setNewAttrName(''); setNewAttrOptions(''); setNewAttrType('select');
    toast({ title: 'Atributo agregado' });
  };

  const handleRemoveAttribute = (productId: string, idx: number) => {
    const p = products.find(x => x.id === productId);
    if (!p) return;
    const next = (p.attributeSchema || []).filter((_, i) => i !== idx);
    updateProduct(productId, { attributeSchema: next });
    toast({ title: 'Atributo eliminado' });
  };

  const handleStartEditAttribute = (pId: string, idx: number) => {
    const p = products.find(x => x.id === pId);
    if (!p) return;
    const s = p.attributeSchema?.[idx];
    if (!s) return;
    setSelectedProductId(pId);
    setEditingAttrIndex(idx);
    setEditAttrName(s.name);
    setEditAttrType(s.type);
    setEditAttrOptions(s.options.join(', '));
  };

  const handleUpdateAttribute = () => {
    if (!selectedProduct || editingAttrIndex === null) return;
    const options = editAttrOptions.split(',').map(s => s.trim()).filter(Boolean);
    const updated = (selectedProduct.attributeSchema || []).map((a, i) => i === editingAttrIndex ? { name: editAttrName, type: editAttrType, options } : a);
    updateProduct(selectedProduct.id, { attributeSchema: updated });
    setEditingAttrIndex(null); setEditAttrName(''); setEditAttrOptions(''); setEditAttrType('select');
    toast({ title: 'Atributo actualizado' });
  };

  const handleExportProduct = (p: Product) => {
    const data = JSON.stringify(p, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${p.id}-${p.name.replace(/\s+/g,'-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exportado', description: 'Producto exportado como JSON' });
  };

  const handleAddVariant = () => {
    if (!selectedProduct) return toast({ title: 'Selecciona un producto' });
    if (!newVariantName) return toast({ title: 'Nombre de variante requerido' });
    const variantId = 'v-' + Math.random().toString(36).substr(2,9);
    const variant = {
      id: variantId,
      name: newVariantName,
      price: newVariantPrice || selectedProduct.price,
      stock: newVariantStock || 0,
      attributes: newVariantAttrs
    } as any;
    const updated = [...(selectedProduct.variants || []), variant];
    updateProduct(selectedProduct.id, { variants: updated });
    setNewVariantName(''); setNewVariantPrice(0); setNewVariantStock(0); setNewVariantAttrs({});
    toast({ title: 'Variante creada' });
  };

  const handleDeleteVariant = (productId: string, variantId: string) => {
    const p = products.find(x => x.id === productId);
    if (!p) return;
    const next = (p.variants || []).filter(v => v.id !== variantId);
    updateProduct(productId, { variants: next });
    toast({ title: 'Variante eliminada' });
  };

  // Category form
  const [categoryName, setCategoryName] = useState('');

  // Admins list
  const [admins, setAdmins] = useState(auth.getAdmins());

  useEffect(() => {
    setAdmins(auth.getAdmins());
  }, [auth]);

  const resetProductForm = () => {
    setProductForm(emptyProductForm);
    setEditingId(null);
    setNewImageUrl('');
  };

  const handleProductSave = () => {
    if (!productForm.name || !productForm.price) {
      toast({ title: 'Error', description: 'Nombre y precio son obligatorios' });
      return;
    }

    if (editingId) {
      updateProduct(editingId, productForm as Partial<Product>);
      toast({ title: 'Producto actualizado', description: 'El producto fue modificado.' });
    } else {
      const newProduct: Product = {
        id: Math.random().toString(36).substr(2, 9),
        name: productForm.name || 'Nuevo Producto',
        description: productForm.description || '',
        price: productForm.price || 0,
        categoryId: productForm.categoryId || categories[0]?.id || '',
        image: productForm.image || '',
        images: productForm.images && productForm.images.length > 0 ? productForm.images : [],
        stock: productForm.stock || 0,
        featured: !!productForm.featured,
        onSale: !!productForm.onSale,
        available: productForm.available !== undefined ? !!productForm.available : true,
      };
      addProduct(newProduct);
      toast({ title: 'Producto creado', description: 'Nuevo producto agregado al catálogo.' });
    }

    resetProductForm();
  };

  const handleEditProduct = (p: Product) => {
    setProductForm({ ...p });
    setEditingId(p.id);
    setActiveTab('products');
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm('¿Eliminar producto? Esta acción no se puede deshacer.')) return;
    deleteProduct(id);
    toast({ title: 'Producto eliminado' });
  };

  const handleAddCategory = () => {
    if (!categoryName) return toast({ title: 'Nombre requerido' });
    const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
    const newCat: Category = { id: Math.random().toString(36).substr(2, 9), name: categoryName, slug };
    addCategory(newCat);
    setCategoryName('');
    toast({ title: 'Categoría creada' });
  };

  const handleDeleteCategory = (id: string) => {
    if (!confirm('¿Eliminar categoría? Los productos no serán eliminados automáticamente.')) return;
    deleteCategory(id);
    toast({ title: 'Categoría eliminada' });
  };

  // Admins management
  const [newAdmin, setNewAdmin] = useState({ fullName: '', email: '', dni: '', phone: '', password: '', documentType: 'DNI' as any, role: 'admin_basico' as any });
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [editingAdminData, setEditingAdminData] = useState<any>(null);

  const handleCreateAdmin = async () => {
    const res = await auth.createAdmin({ ...newAdmin, active: true, blocked: false } as any);
    if (!res.success) return toast({ title: 'Error', description: res.error });
    setAdmins(auth.getAdmins());
    toast({ title: 'Administrador creado' });
    setNewAdmin({ fullName: '', email: '', dni: '', phone: '', password: '', documentType: 'DNI', role: 'admin_basico' });
  };

  const handleDeleteAdmin = async (id: string) => {
    const res = await auth.deleteAdmin(id);
    if (!res.success) return toast({ title: 'Error', description: res.error });
    setAdmins(auth.getAdmins());
    toast({ title: 'Administrador eliminado' });
  };

  const handleEditAdminStart = (admin: any) => {
    setEditingAdminId(admin.id);
    setEditingAdminData({ ...admin });
  };

  const handleEditAdminSave = async () => {
    if (!editingAdminId || !editingAdminData) return;
    const res = await auth.updateAdmin(editingAdminId, editingAdminData);
    if (!res.success) return toast({ title: 'Error', description: res.error });
    setAdmins(auth.getAdmins());
    toast({ title: 'Datos de administrador actualizados' });
    setEditingAdminId(null);
    setEditingAdminData(null);
  };

  const handleEditAdminCancel = () => {
    setEditingAdminId(null);
    setEditingAdminData(null);
  };

  // Estado para métodos de pago
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'yape', label: 'Yape', number: '', enabled: true },
    { id: 'plin', label: 'Plin', number: '', enabled: true },
    { id: 'efectivo', label: 'Pago en Efectivo', number: '', enabled: true },
    { id: 'transferencia', label: 'Transferencia Bancaria', number: '', enabled: true }
  ]);

  // Estado para filtros de productos
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // name, price-asc, price-desc, stock
  const [reportPeriod, setReportPeriod] = useState('monthly'); // daily, weekly, monthly, yearly

  // Estados para órdenes
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderNotes, setOrderNotes] = useState<Record<string, string>>({});

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    setLocation("/");
  };

  const handleConfigChange = (field: string, value: string) => {
    setConfig({ ...config, [field]: value });
  };

  const handleColorChange = (field: string, value: string) => {
    setColors({ ...colors, [field]: value });
  };

  const handlePaymentMethodChange = (index: number, field: string, value: any) => {
    const updated = [...paymentMethods];
    if (field === 'enabled') {
      updated[index].enabled = value;
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setPaymentMethods(updated);
  };

  const handleSaveConfig = () => {
    // Persist config to localStorage
    localStorage.setItem('storeConfig', JSON.stringify(config));
    localStorage.setItem('storeColors', JSON.stringify(colors));
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
    
    toast({
      title: "Configuración guardada",
      description: "Los cambios se han aplicado correctamente."
    });
  };

  // Load config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('storeConfig');
    const savedColors = localStorage.getItem('storeColors');
    const savedMethods = localStorage.getItem('paymentMethods');
    
    if (savedConfig) setConfig(JSON.parse(savedConfig));
    if (savedColors) setColors(JSON.parse(savedColors));
    if (savedMethods) setPaymentMethods(JSON.parse(savedMethods));
  }, []);

  // Función para filtrar productos
  const getFilteredProducts = () => {
    let filtered = [...products];

    if (filterCategory) {
      filtered = filtered.filter(p => p.categoryId === filterCategory);
    }
    
    if (filterMinPrice) {
      filtered = filtered.filter(p => p.price >= Number(filterMinPrice));
    }
    
    if (filterMaxPrice) {
      filtered = filtered.filter(p => p.price <= Number(filterMaxPrice));
    }
    
    if (filterAvailable) {
      filtered = filtered.filter(p => p.available && p.stock > 0);
    }
    
    if (filterFeatured) {
      filtered = filtered.filter(p => p.featured);
    }

    // Ordenamiento
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'stock') {
      filtered.sort((a, b) => b.stock - a.stock);
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  };

  // Función para generar reportes
  const generateSalesReport = () => {
    const now = new Date();
    const reportData: any = {
      daily: [],
      weekly: [],
      monthly: [],
      yearly: []
    };

    // Agrupar órdenes por período
    const groupByDate = (format: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
      const grouped: { [key: string]: { date: string; total: number; count: number } } = {};

      orders.forEach(order => {
        const date = new Date(order.date);
        let key = '';

        if (format === 'daily') {
          key = date.toISOString().split('T')[0];
        } else if (format === 'weekly') {
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = `Semana ${weekStart.toISOString().split('T')[0]}`;
        } else if (format === 'monthly') {
          key = date.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
        } else if (format === 'yearly') {
          key = date.getFullYear().toString();
        }

        if (!grouped[key]) {
          grouped[key] = { date: key, total: 0, count: 0 };
        }
        grouped[key].total += order.total;
        grouped[key].count += 1;
      });

      return Object.values(grouped).sort((a, b) => {
        if (format === 'daily' || format === 'weekly') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        return 0;
      });
    };

    return {
      daily: groupByDate('daily'),
      weekly: groupByDate('weekly'),
      monthly: groupByDate('monthly'),
      yearly: groupByDate('yearly')
    };
  };

  const salesReport = generateSalesReport();
  const currentReport = reportPeriod === 'daily' ? salesReport.daily : 
                       reportPeriod === 'weekly' ? salesReport.weekly :
                       reportPeriod === 'monthly' ? salesReport.monthly :
                       salesReport.yearly;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Panel de Administración</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setLocation("/")}>
              <Home className="mr-2 h-4 w-4" /> Ir al Sitio
            </Button>
            <Button variant="default" size="sm" onClick={() => setLocation('/admin/pages') }>
              Páginas
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Salir
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-11">
              <TabsTrigger value="general">Configuración General</TabsTrigger>
              <TabsTrigger value="design">Diseño</TabsTrigger>
              <TabsTrigger value="payments">Métodos de Pago</TabsTrigger>
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="categories">Categorías</TabsTrigger>
              <TabsTrigger value="flashsales">⚡ Ofertas Relámpago</TabsTrigger>
              <TabsTrigger value="attributes">Atributos / Variantes</TabsTrigger>
              <TabsTrigger value="admins">Administradores</TabsTrigger>
              <TabsTrigger value="orders">Órdenes</TabsTrigger>
              <TabsTrigger value="filters">Filtros</TabsTrigger>
              <TabsTrigger value="reports">Reportes</TabsTrigger>
            </TabsList>

          {/* TAB 1: Configuración General */}
          <TabsContent value="general">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Configuración General de la Tienda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Nombre de la Tienda</Label>
                    <Input
                      value={config.storeName}
                      onChange={(e) => handleConfigChange('storeName', e.target.value)}
                      placeholder="FLABEF E-Commerce"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Número de WhatsApp (con código de país)</Label>
                    <Input
                      value={config.whatsappNumber}
                      onChange={(e) => handleConfigChange('whatsappNumber', e.target.value)}
                      placeholder="51912345678"
                    />
                    <p className="text-xs text-muted-foreground">
                      Ejemplo: 51912345678 (Perú con código 51)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Descripción de la Tienda</Label>
                    <Input
                      value={config.storeDescription}
                      onChange={(e) => handleConfigChange('storeDescription', e.target.value)}
                      placeholder="Describa su tienda"
                    />
                  </div>

                  <Separator className="my-4" />

                  <Button onClick={handleSaveConfig} className="w-full">
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB X: Atributos / Variantes */}
          <TabsContent value="attributes">
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestionar Atributos y Variantes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">Selecciona un producto para ver y editar sus atributos y variantes.</p>
                    <div className="flex gap-3 items-center">
                      <select
                        className="border rounded p-2 w-full"
                        value={String(selectedProductId || '')}
                        onChange={(e) => setSelectedProductId(e.target.value || null)}
                      >
                        <option value="">-- Seleccionar Producto --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      {selectedProduct && (
                        <Button variant="outline" onClick={() => handleExportProduct(selectedProduct)}>Exportar JSON</Button>
                      )}
                    </div>

                    {selectedProduct && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">Atributos (attributeSchema)</h4>
                          {selectedProduct.attributeSchema && selectedProduct.attributeSchema.length > 0 ? (
                            <div className="space-y-2 mt-2">
                              {selectedProduct.attributeSchema.map((s, idx) => (
                                <div key={s.name} className="border rounded p-2">
                                  {editingAttrIndex === idx ? (
                                    <div className="space-y-2">
                                      <div className="grid grid-cols-3 gap-2">
                                        <Input value={editAttrName} onChange={(e) => setEditAttrName(e.target.value)} />
                                        <select className="border rounded p-2" value={editAttrType} onChange={(e) => setEditAttrType(e.target.value as 'select'|'multiselect')}>
                                          <option value="select">select</option>
                                          <option value="multiselect">multiselect</option>
                                        </select>
                                        <Input value={editAttrOptions} onChange={(e) => setEditAttrOptions(e.target.value)} />
                                      </div>
                                      <div className="flex gap-2 justify-end">
                                        <Button size="sm" onClick={handleUpdateAttribute}>Guardar</Button>
                                        <Button size="sm" variant="secondary" onClick={() => setEditingAttrIndex(null)}>Cancelar</Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="font-medium">{s.name}</div>
                                        <div className="text-xs text-muted-foreground">{s.type} — {s.options.join(', ')}</div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleStartEditAttribute(selectedProduct.id, idx)}>Editar</Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleRemoveAttribute(selectedProduct.id, idx)}>Eliminar</Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground mt-2">Este producto no tiene atributos definidos.</p>
                          )}
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-2">Añadir Atributo</h4>
                          <div className="grid grid-cols-3 gap-2">
                            <Input placeholder="Nombre (ej: Talla)" value={newAttrName} onChange={(e) => setNewAttrName(e.target.value)} />
                            <select className="border rounded p-2" value={newAttrType} onChange={(e) => setNewAttrType(e.target.value as 'select' | 'multiselect')}>
                              <option value="select">select</option>
                              <option value="multiselect">multiselect</option>
                            </select>
                            <Input placeholder="Opciones (coma separadas)" value={newAttrOptions} onChange={(e) => setNewAttrOptions(e.target.value)} />
                          </div>
                          <div className="mt-2 flex gap-2">
                            <Button onClick={handleAddAttribute}>Agregar Atributo</Button>
                            <Button variant="secondary" onClick={() => { setNewAttrName(''); setNewAttrOptions(''); setNewAttrType('select'); }}>Limpiar</Button>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-semibold">Variantes</h4>
                          {selectedProduct.variants && selectedProduct.variants.length > 0 ? (
                            <div className="space-y-2 mt-2">
                              {selectedProduct.variants.map(v => (
                                <div key={v.id} className="flex items-center justify-between border rounded p-2">
                                  <div>
                                    <div className="font-medium">{v.name}</div>
                                    <div className="text-xs text-muted-foreground">S/ {v.price} — Stock: {v.stock} — {Object.entries(v.attributes).map(([k,val])=>`${k}: ${val}`).join(', ')}</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleDeleteVariant(selectedProduct.id, v.id)}>Eliminar</Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground mt-2">No hay variantes.</p>
                          )}

                          <div className="mt-4 border-t pt-4">
                            <h5 className="font-semibold mb-2">Agregar Variante</h5>
                            <div className="grid grid-cols-2 gap-2">
                              <Input placeholder="Nombre variante" value={newVariantName} onChange={(e) => setNewVariantName(e.target.value)} />
                              <Input placeholder="Precio" type="number" value={String(newVariantPrice || '')} onChange={(e) => setNewVariantPrice(Number(e.target.value))} />
                              <Input placeholder="Stock" type="number" value={String(newVariantStock || '')} onChange={(e) => setNewVariantStock(Number(e.target.value))} />
                              <div />
                            </div>
                            {/* Dynamic attribute selects */}
                            {selectedProduct.attributeSchema && selectedProduct.attributeSchema.map((s) => {
                              const key = s.name.toLowerCase().replace(/\s+/g,'-');
                              return (
                                <div key={s.name} className="mt-2">
                                  <Label>{s.name}</Label>
                                  <div className="flex gap-2 mt-1 flex-wrap">
                                    {s.options.map(opt => (
                                      <button key={opt} onClick={() => setNewVariantAttrs({ ...newVariantAttrs, [key]: opt })} className={`px-3 py-1 rounded border ${newVariantAttrs[key] === opt ? 'border-lime-500 bg-lime-50' : 'border-gray-200'}`}>
                                        {opt}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}

                            <div className="mt-3 flex gap-2">
                              <Button onClick={handleAddVariant}>Crear Variante</Button>
                              <Button variant="secondary" onClick={() => { setNewVariantName(''); setNewVariantPrice(0); setNewVariantStock(0); setNewVariantAttrs({}); }}>Limpiar</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Ayuda Rápida</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Selecciona un producto y luego añade atributos y variantes. Los cambios se guardan directamente en el store.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: Productos */}
          <TabsContent value="products">
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Listado de Productos ({products.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {products.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No hay productos</p>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {products.map(p => (
                          <div key={p.id} className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.name} className="h-12 w-12 object-cover rounded" />
                              <div>
                                <div className="font-semibold text-sm">{p.name}</div>
                                <div className="text-xs text-muted-foreground">S/{p.price} — Stock: {p.stock}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="outline" onClick={() => handleEditProduct(p)}>Editar</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(p.id)}>X</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>{editingId ? 'Editar Producto' : 'Nuevo Producto'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Nombre</Label>
                      <Input value={productForm.name || ''} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                    </div>
                    <div>
                      <Label>Descripción</Label>
                      <Input value={productForm.description || ''} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
                    </div>
                    <div>
                      <Label>Precio</Label>
                      <Input type="number" value={String(productForm.price ?? '')} onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })} />
                    </div>
                    <div>
                      <Label>Categoría</Label>
                      <select className="w-full border rounded p-2" value={productForm.categoryId || ''} onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Imagen Principal (URL)</Label>
                      <Input value={productForm.image || ''} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} placeholder="https://..." />
                    </div>

                    {/* Galería de Imágenes Múltiples */}
                    <div>
                      <Label>Galería de Imágenes Adicionales (Máx. 5)</Label>
                      <div className="space-y-2">
                        {productForm.images && productForm.images.length > 0 && (
                          <div className="space-y-2 mb-2">
                            <div className="text-sm font-semibold text-gray-700">
                              {productForm.images.length} / 5 imágenes
                            </div>
                            {productForm.images.map((img, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Input value={img} disabled className="text-sm" />
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    const updated = productForm.images?.filter((_, i) => i !== idx) || [];
                                    setProductForm({ ...productForm, images: updated });
                                  }}
                                >
                                  Quitar
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        {(!productForm.images || productForm.images.length < 5) && (
                          <div className="flex gap-2">
                            <Input
                              value={newImageUrl}
                              onChange={(e) => setNewImageUrl(e.target.value)}
                              placeholder="Agregar URL de imagen..."
                              className="text-sm"
                            />
                            <Button
                              size="sm"
                              onClick={() => {
                                if (newImageUrl.trim()) {
                                  const images = [...(productForm.images || []), newImageUrl];
                                  if (images.length <= 5) {
                                    setProductForm({ ...productForm, images });
                                    setNewImageUrl('');
                                  } else {
                                    toast({ title: 'Límite alcanzado', description: 'Máximo 5 imágenes por producto' });
                                  }
                                }
                              }}
                            >
                              Agregar
                            </Button>
                          </div>
                        )}
                        {productForm.images && productForm.images.length >= 5 && (
                          <div className="p-2 bg-orange-100 border border-orange-300 rounded text-sm text-orange-700">
                            ✓ Límite de 5 imágenes alcanzado
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Agregar 1-5 imágenes para la galería del modal</p>
                    </div>
                    <div>
                      <Label>Stock</Label>
                      <Input type="number" value={String(productForm.stock ?? '')} onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })} />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2"><input type="checkbox" checked={!!productForm.featured} onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })} /> Destacado</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={!!productForm.onSale} onChange={(e) => setProductForm({ ...productForm, onSale: e.target.checked })} /> Oferta</label>
                    </div>

                    <Button onClick={handleProductSave} className="w-full">{editingId ? 'Actualizar' : 'Crear'}</Button>
                    {editingId && <Button variant="secondary" onClick={resetProductForm} className="w-full">Cancelar</Button>}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 5: Categorías */}
          <TabsContent value="categories">
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Listado de Categorías</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categories.map(c => (
                      <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-semibold">{c.name}</div>
                          <div className="text-sm text-muted-foreground">/{c.slug}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={() => { setCategoryName(c.name); }}>Editar</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteCategory(c.id)}>Eliminar</Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Nueva Categoría</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Nombre</Label>
                      <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                    </div>
                    <Button onClick={handleAddCategory} className="w-full">Crear Categoría</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 6: Administradores */}
          <TabsContent value="admins">
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Administradores</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {admins.map(a => (
                      <div key={a.id}>
                        {editingAdminId === a.id ? (
                          // Modo edición
                          <div className="p-4 border rounded-lg bg-blue-50 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-sm">Nombre completo</Label>
                                <Input 
                                  value={editingAdminData.fullName} 
                                  onChange={(e) => setEditingAdminData({ ...editingAdminData, fullName: e.target.value })}
                                  className="mt-1 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-sm">Rol</Label>
                                <select 
                                  className="w-full border rounded p-2 text-sm mt-1" 
                                  value={editingAdminData.role}
                                  onChange={(e) => setEditingAdminData({ ...editingAdminData, role: e.target.value })}
                                >
                                  <option value="admin_basico">Admin Básico</option>
                                  <option value="admin_gestor">Admin Gestor</option>
                                  <option value="super_admin">Super Admin</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-sm">Email</Label>
                                <Input 
                                  value={editingAdminData.email} 
                                  onChange={(e) => setEditingAdminData({ ...editingAdminData, email: e.target.value })}
                                  className="mt-1 text-sm"
                                  type="email"
                                />
                              </div>
                              <div>
                                <Label className="text-sm">Email de Recuperación</Label>
                                <Input 
                                  value={editingAdminData.recoveryEmail || ''} 
                                  onChange={(e) => setEditingAdminData({ ...editingAdminData, recoveryEmail: e.target.value })}
                                  className="mt-1 text-sm"
                                  type="email"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-sm">Tipo de Documento</Label>
                                <select 
                                  className="w-full border rounded p-2 text-sm mt-1" 
                                  value={editingAdminData.documentType}
                                  onChange={(e) => setEditingAdminData({ ...editingAdminData, documentType: e.target.value })}
                                >
                                  <option value="DNI">DNI</option>
                                  <option value="Pasaporte">Pasaporte</option>
                                  <option value="Cédula">Cédula</option>
                                  <option value="RUC">RUC</option>
                                </select>
                              </div>
                              <div>
                                <Label className="text-sm">Número de Documento</Label>
                                <Input 
                                  value={editingAdminData.dni} 
                                  onChange={(e) => setEditingAdminData({ ...editingAdminData, dni: e.target.value })}
                                  className="mt-1 text-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm">Teléfono</Label>
                              <Input 
                                value={editingAdminData.phone} 
                                onChange={(e) => setEditingAdminData({ ...editingAdminData, phone: e.target.value })}
                                className="mt-1 text-sm"
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={handleEditAdminSave}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                Guardar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={handleEditAdminCancel}
                                className="flex-1"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // Modo visualización
                          <div className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
                            <div className="flex-1">
                              <div className="font-semibold">{a.fullName} <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded ml-2">({a.role})</span></div>
                              <div className="text-sm text-muted-foreground mt-1">
                                <div>📧 {a.email}</div>
                                {a.recoveryEmail && <div>🔄 Recuperación: {a.recoveryEmail}</div>}
                                <div>{a.documentType}: {a.dni}</div>
                                <div>📱 {a.phone}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button size="sm" variant="outline" onClick={() => handleEditAdminStart(a)}>Editar</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteAdmin(a.id)}>Eliminar</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Crear Administrador</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Nombre completo</Label>
                      <Input value={newAdmin.fullName} onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} type="email" />
                    </div>
                    <div>
                      <Label>Tipo de Documento</Label>
                      <select className="w-full border rounded p-2 text-sm" value={newAdmin.documentType} onChange={(e) => setNewAdmin({ ...newAdmin, documentType: e.target.value })}>
                        <option value="DNI">DNI</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="Cédula">Cédula</option>
                        <option value="RUC">RUC</option>
                      </select>
                    </div>
                    <div>
                      <Label>Número de Documento</Label>
                      <Input value={newAdmin.dni} onChange={(e) => setNewAdmin({ ...newAdmin, dni: e.target.value })} />
                    </div>
                    <div>
                      <Label>Teléfono</Label>
                      <Input value={newAdmin.phone} onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })} />
                    </div>
                    <div>
                      <Label>Contraseña</Label>
                      <Input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} placeholder="Contraseña inicial" />
                    </div>
                    <div>
                      <Label>Rol</Label>
                      <select className="w-full border rounded p-2" value={newAdmin.role} onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}>
                        <option value="admin_basico">Admin Básico</option>
                        <option value="admin_gestor">Admin Gestor</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>
                    <Button onClick={handleCreateAdmin} className="w-full">Crear Administrador</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: Diseño */}
          <TabsContent value="design">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" /> Personalización de Colores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Color del Navbar</Label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={colors.navbarColor}
                          onChange={(e) => handleColorChange('navbarColor', e.target.value)}
                          className="h-12 w-20 cursor-pointer rounded border"
                        />
                        <Input
                          value={colors.navbarColor}
                          onChange={(e) => handleColorChange('navbarColor', e.target.value)}
                          className="font-mono"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Código hexadecimal del color</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Color del Footer</Label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={colors.footerColor}
                          onChange={(e) => handleColorChange('footerColor', e.target.value)}
                          className="h-12 w-20 cursor-pointer rounded border"
                        />
                        <Input
                          value={colors.footerColor}
                          onChange={(e) => handleColorChange('footerColor', e.target.value)}
                          className="font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Color Primario (Botones, Links)</Label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={colors.primaryColor}
                          onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                          className="h-12 w-20 cursor-pointer rounded border"
                        />
                        <Input
                          value={colors.primaryColor}
                          onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                          className="font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-semibold">Vista Previa:</p>
                    <div
                      style={{ backgroundColor: colors.navbarColor }}
                      className="h-20 rounded-lg flex items-center justify-center text-white font-bold"
                    >
                      Navbar
                    </div>
                    <div
                      style={{ backgroundColor: colors.footerColor }}
                      className="h-20 rounded-lg flex items-center justify-center text-white font-bold"
                    >
                      Footer
                    </div>
                    <div
                      style={{ backgroundColor: colors.primaryColor }}
                      className="h-20 rounded-lg flex items-center justify-center text-white font-bold"
                    >
                      Color Primario
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />
                <Button onClick={handleSaveConfig} className="w-full">
                  Guardar Cambios de Diseño
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: Métodos de Pago */}
          <TabsContent value="payments">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> Métodos de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {paymentMethods.map((method, index) => (
                  <div key={method.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{method.label}</h3>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={method.enabled}
                          onChange={(e) => handlePaymentMethodChange(index, 'enabled', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{method.enabled ? 'Habilitado' : 'Deshabilitado'}</span>
                      </label>
                    </div>

                    {method.id !== 'efectivo' && (
                      <div className="space-y-2">
                        <Label className="text-sm">Número/Cuenta {method.label}</Label>
                        <Input
                          value={method.number}
                          onChange={(e) => handlePaymentMethodChange(index, 'number', e.target.value)}
                          placeholder={`Número de ${method.label}`}
                          disabled={!method.enabled}
                        />
                        <p className="text-xs text-muted-foreground">
                          {method.id === 'yape' && 'Número de teléfono asociado a Yape'}
                          {method.id === 'plin' && 'Número de teléfono asociado a Plin'}
                          {method.id === 'transferencia' && 'Número de cuenta bancaria (IBAN o similar)'}
                        </p>
                      </div>
                    )}

                    {method.id === 'efectivo' && (
                      <p className="text-xs text-muted-foreground">
                        El pago en efectivo se coordinará con el cliente por WhatsApp.
                      </p>
                    )}
                  </div>
                ))}

                <Separator className="my-4" />
                <Button onClick={handleSaveConfig} className="w-full">
                  Guardar Métodos de Pago
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 7: Órdenes */}
          <TabsContent value="orders">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Gestión de Órdenes</CardTitle>
              </CardHeader>
              <CardContent>
                {auth.currentUser?.role === 'super_admin' && (
                  <div className="mb-4 grid grid-cols-3 gap-3 items-end">
                    <div>
                      <Label>Prefijo de Boleta</Label>
                      <Input
                        value={localInvoicePrefix}
                        onChange={(e) => setLocalInvoicePrefix(e.target.value)}
                        onBlur={() => setInvoicePrefix(localInvoicePrefix, { id: auth.currentUser?.id, name: auth.currentUser?.fullName })}
                      />
                    </div>
                    <div>
                      <Label>Siguiente Correlativo</Label>
                      <Input
                        type="number"
                        value={localInvoiceNextNumber}
                        onChange={(e) => setLocalInvoiceNextNumber(e.target.value)}
                        onBlur={() => setInvoiceNextNumber(Number(localInvoiceNextNumber || 0), { id: auth.currentUser?.id, name: auth.currentUser?.fullName })}
                      />
                    </div>
                    <div>
                      <Label>Ejemplo</Label>
                      <div className="text-sm font-semibold">{localInvoicePrefix}-{String(Number(localInvoiceNextNumber || invoiceNextNumber)).padStart(Number(localInvoiceDigits || invoiceDigits),'0')}</div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div>
                        <Label>Dígitos (padding)</Label>
                        <Input type="number" min={3} max={8} value={localInvoiceDigits} onChange={e => setLocalInvoiceDigits(e.target.value)} onBlur={() => setInvoiceDigits(Number(localInvoiceDigits || invoiceDigits), { id: auth.currentUser?.id, name: auth.currentUser?.fullName })} />
                      </div>
                    </div>
                  </div>
                )}
                {/* Auditoría de cambios de correlativo */}
                {auth.currentUser?.role === 'super_admin' && (
                  <div className="mb-4 border rounded p-3 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">Historial de Cambios de Correlativo</div>
                      <Button size="sm" onClick={() => {
                        // Exportar CSV
                        const rows = [['id','tipo','actorId','actorName','timestamp','orderId','details'], ...invoiceAudit.map(a => [a.id, a.type, a.actorId || '', a.actorName || '', a.timestamp, a.orderId || '', (a.details || '').replace(/\n/g,' ' )])];
                        const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
                        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `invoice-audit-${new Date().toISOString().slice(0,10)}.csv`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}>Exportar CSV</Button>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">Últimos registros</div>
                    <div className="space-y-2 max-h-44 overflow-auto">
                      {invoiceAudit.slice().reverse().slice(0,30).map(entry => (
                        <div key={entry.id} className="text-xs border-b pb-1">
                          <div className="font-semibold">{entry.type} — {entry.timestamp}</div>
                          <div className="text-muted-foreground">{entry.actorName || entry.actorId || 'Sistema'} — {entry.details}</div>
                        </div>
                      ))}
                      {invoiceAudit.length === 0 && <div className="text-xs text-muted-foreground">Sin actividad aún</div>}
                    </div>
                  </div>
                )}
                {orders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No hay órdenes aún</p>
                ) : (
                    <div className="space-y-3">
                      {orders.map(order => (
                        <div key={order.id} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                            <div className="grid grid-cols-5 gap-4">
                              {/* ID y Estado */}
                              <div>
                                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Orden</div>
                                <div className="font-bold text-lg">#{order.id.substring(0, 8)}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {new Date(order.date).toLocaleDateString('es-PE')}
                                </div>
                              </div>

                              {/* Cliente */}
                              <div>
                                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Cliente</div>
                                <div className="font-semibold text-sm">{order.customerName}</div>
                                <div className="text-xs text-green-600 font-semibold mt-1">📱 {order.customerPhone}</div>
                              </div>

                              {/* Email y Dirección */}
                              <div>
                                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Email</div>
                                <div className="text-xs text-blue-600 break-all">{order.customerEmail}</div>
                                <div className="text-xs text-muted-foreground mt-2 font-semibold">📍 Entrega</div>
                                <div className="text-xs truncate">{order.customerAddress}</div>
                              </div>

                              {/* Total y Items */}
                              <div>
                                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Total</div>
                                <div className="font-bold text-lg text-lime-600">S/ {order.total.toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                                </div>
                              </div>

                              {/* Acciones */}
                              <div className="flex flex-col gap-2">
                                <select 
                                  value={order.status} 
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                  className="p-2 border rounded text-sm font-semibold"
                                >
                                  <option value="pending">Pendiente</option>
                                  <option value="processing">En Proceso</option>
                                  <option value="shipped">Enviado</option>
                                  <option value="delivered">Entregado</option>
                                </select>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setOrderModalOpen(true);
                                  }}
                                  className="gap-1"
                                >
                                  <Eye className="w-4 h-4" /> Vista Previa
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Resumen de Productos (Expandible) */}
                          <div className="px-4 py-3 bg-gray-50 text-sm">
                            <div className="font-semibold mb-2 text-xs uppercase text-muted-foreground">Productos:</div>
                            <div className="grid grid-cols-2 gap-2">
                              {order.items.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="text-xs">
                                  • {item.name} x{item.quantity}
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <div className="text-xs text-muted-foreground col-span-2">
                                  ... +{order.items.length - 2} más
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                )}
              </CardContent>
            </Card>
              {/* Modal de Vista Previa */}
              <OrderPreviewModal 
                order={selectedOrder}
                open={orderModalOpen}
                onOpenChange={setOrderModalOpen}
              />
          </TabsContent>

          {/* TAB 6: Ofertas Relámpago (Flash Sales) */}
          <TabsContent value="flashsales">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" /> Gestionar Ofertas Relámpago
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">Crea ofertas por tiempo limitado con descuentos especiales</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Agregar Nueva Oferta */}
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                  <h3 className="font-bold mb-4">+ Crear Nueva Oferta Relámpago</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Producto</Label>
                      <select className="w-full border rounded p-2">
                        <option value="">Selecciona un producto</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Descuento (%)</Label>
                      <Input type="number" placeholder="20" min="1" max="100" />
                    </div>
                    <div className="space-y-2">
                      <Label>Duración (horas)</Label>
                      <Input type="number" placeholder="24" min="1" max="168" />
                    </div>
                    <div className="space-y-2">
                      <Label>Máx. por Usuario</Label>
                      <Input type="number" placeholder="2" min="1" max="10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha de Inicio</Label>
                      <Input type="datetime-local" />
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">
                        <Plus className="mr-2 h-4 w-4" /> Crear Oferta
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Ofertas Activas */}
                <div>
                  <h3 className="font-bold mb-4">Ofertas Activas 🔥</h3>
                  <div className="space-y-3">
                    {flashSales && flashSales.filter(s => s.active).length > 0 ? (
                      flashSales.filter(s => s.active).map(sale => {
                        const product = products.find(p => p.id === sale.productId);
                        const timeLeft = sale.endTime - Date.now();
                        const hoursLeft = Math.floor(timeLeft / 3600000);
                        const minutesLeft = Math.floor((timeLeft % 3600000) / 60000);
                        
                        return (
                          <div key={sale.id} className="p-4 border border-orange-300 bg-orange-50 rounded-lg">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="font-bold text-lg">{product?.name}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                  Descuento: <span className="font-bold text-orange-600">{sale.discountPercent}%</span> | 
                                  Máx. por usuario: {sale.maxQuantityPerUser} unidades
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-orange-600">{hoursLeft}h {minutesLeft}m</div>
                                <p className="text-xs text-gray-600">Tiempo restante</p>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">Editar</Button>
                                <Button size="sm" variant="destructive">Finalizar</Button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No hay ofertas activas</p>
                    )}
                  </div>
                </div>

                {/* Ofertas Programadas */}
                <div>
                  <h3 className="font-bold mb-4">Ofertas Programadas 📅</h3>
                  <div className="space-y-3">
                    {flashSales && flashSales.filter(s => !s.active && s.startTime > Date.now()).length > 0 ? (
                      flashSales.filter(s => !s.active && s.startTime > Date.now()).map(sale => {
                        const product = products.find(p => p.id === sale.productId);
                        const timeUntilStart = sale.startTime - Date.now();
                        const hoursUntil = Math.floor(timeUntilStart / 3600000);
                        
                        return (
                          <div key={sale.id} className="p-4 border border-blue-300 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="font-bold">{product?.name}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                  Inicia en: {hoursUntil} horas | Descuento: {sale.discountPercent}%
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">Editar</Button>
                                <Button size="sm" variant="destructive">Eliminar</Button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No hay ofertas programadas</p>
                    )}
                  </div>
                </div>

                {/* Historial */}
                <div>
                  <h3 className="font-bold mb-4">Historial 📊</h3>
                  <p className="text-sm text-muted-foreground">Las ofertas finalizadas aparecerán aquí</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 7: Órdenes */}
          <TabsContent value="orders">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Gestión de Órdenes</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No hay órdenes aún</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">Orden #{order.id.substring(0, 8)}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(order.date).toLocaleDateString('es-PE')}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">S/ {order.total.toFixed(2)}</div>
                            <select 
                              value={order.status} 
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                              className="mt-2 p-1 border rounded text-sm"
                            >
                              <option value="pending">Pendiente</option>
                              <option value="processing">En Proceso</option>
                              <option value="shipped">Enviado</option>
                              <option value="delivered">Entregado</option>
                            </select>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <div className="font-semibold mb-2">Items:</div>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span>{item.name} x{item.quantity}</span>
                              <span>S/ {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="text-sm text-muted-foreground">
                          Dirección: {order.address}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 8: Filtros */}
          <TabsContent value="filters">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" /> Filtros y Búsqueda Avanzada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Categoría</Label>
                      <select 
                        value={filterCategory} 
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full border rounded p-2 mt-1"
                      >
                        <option value="">Todas las categorías</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label>Precio Mínimo (S/)</Label>
                      <Input 
                        type="number" 
                        value={filterMinPrice}
                        onChange={(e) => setFilterMinPrice(e.target.value)}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <Label>Precio Máximo (S/)</Label>
                      <Input 
                        type="number" 
                        value={filterMaxPrice}
                        onChange={(e) => setFilterMaxPrice(e.target.value)}
                        placeholder="10000"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={filterAvailable}
                        onCheckedChange={(checked) => setFilterAvailable(checked as boolean)}
                      />
                      <Label className="mb-0">Solo disponibles (stock &gt; 0)</Label>
                    </div>

                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={filterFeatured}
                        onCheckedChange={(checked) => setFilterFeatured(checked as boolean)}
                      />
                      <Label className="mb-0">Solo destacados</Label>
                    </div>

                    <div>
                      <Label>Ordenar por:</Label>
                      <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full border rounded p-2 mt-1"
                      >
                        <option value="name">Nombre (A-Z)</option>
                        <option value="price-asc">Precio (menor a mayor)</option>
                        <option value="price-desc">Precio (mayor a menor)</option>
                        <option value="stock">Stock (mayor a menor)</option>
                      </select>
                    </div>

                    <Button 
                      onClick={() => {
                        setFilterCategory('');
                        setFilterMinPrice('');
                        setFilterMaxPrice('');
                        setFilterAvailable(false);
                        setFilterFeatured(false);
                        setSortBy('name');
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Limpiar Filtros
                    </Button>
                  </div>

                  <div>
                    <p className="font-semibold mb-4">Resultados ({getFilteredProducts().length})</p>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {getFilteredProducts().map(p => (
                        <div key={p.id} className="p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold text-sm">{p.name}</div>
                              <div className="text-xs text-muted-foreground">
                                S/ {p.price} — Stock: {p.stock}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {p.featured && <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded mr-1">Destacado</span>}
                                {p.onSale && <span className="inline-block bg-red-100 text-red-800 px-2 py-0.5 rounded">Oferta</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {getFilteredProducts().length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No hay productos que coincidan</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 9: Reportes */}
          <TabsContent value="reports">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" /> Reportes de Ventas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4 items-center">
                  <Label>Período:</Label>
                  <select 
                    value={reportPeriod} 
                    onChange={(e) => setReportPeriod(e.target.value)}
                    className="border rounded p-2"
                  >
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>

                {orders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No hay datos de ventas</p>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">Total Ventas</div>
                          <div className="text-2xl font-bold">
                            S/ {orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">Total Órdenes</div>
                          <div className="text-2xl font-bold">{orders.length}</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">Promedio Venta</div>
                          <div className="text-2xl font-bold">
                            S/ {orders.length > 0 ? (orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toFixed(2) : '0.00'}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-orange-50 border-orange-200">
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">Items Vendidos</div>
                          <div className="text-2xl font-bold">
                            {orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-semibold mb-4">
                        {reportPeriod === 'daily' ? 'Ventas por Día' : 
                         reportPeriod === 'weekly' ? 'Ventas por Semana' :
                         reportPeriod === 'monthly' ? 'Ventas por Mes' :
                         'Ventas por Año'}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100 border-b">
                            <tr>
                              <th className="text-left p-3 font-semibold">Período</th>
                              <th className="text-right p-3 font-semibold">Órdenes</th>
                              <th className="text-right p-3 font-semibold">Total</th>
                              <th className="text-right p-3 font-semibold">Promedio</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentReport.map((row, idx) => (
                              <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="p-3">{row.date}</td>
                                <td className="text-right p-3">{row.count}</td>
                                <td className="text-right p-3 font-semibold">S/ {row.total.toFixed(2)}</td>
                                <td className="text-right p-3">S/ {(row.total / row.count).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {currentReport.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">No hay datos para este período</p>
                        )}
                      </div>
                    </div>

                    <Button 
                      onClick={() => window.print()} 
                      className="w-full mt-4"
                    >
                      Imprimir Reporte
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
