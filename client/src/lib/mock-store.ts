import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

// Atributos por categoría
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>; // ej: { size: 'M', color: 'Rojo' }
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  images?: string[]; // Galería de múltiples imágenes
  stock: number;
  rating?: number;
  featured?: boolean;
  onSale?: boolean;
  originalPrice?: number;
  available?: boolean;
  variants?: ProductVariant[]; // Variantes específicas del producto
  attributeSchema?: {
    // Define qué atributos puede tener este producto
    name: string;
    type: 'select' | 'multiselect';
    options: string[];
  }[];
}

export interface FlashSale {
  id: string;
  productId: string;
  discountPercent: number;
  startTime: number; // timestamp
  endTime: number; // timestamp
  maxQuantityPerUser?: number;
  active: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedAttributes?: Record<string, string>; // Atributos seleccionados para este item del carrito
}

export interface Order {
  id: string;
  userId: string;
  // Datos del cliente
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  // Correlativo / Boleta
  invoiceNumber?: string;
  // Detalles de la orden
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  address: string;
  notes?: string; // Notas internas de la orden
}

interface StoreState {
  categories: Category[];
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  // Invoice settings
  invoicePrefix: string;
  invoiceNextNumber: number;
  invoiceDigits: number; // cantidad de dígitos fijos para padding (ej: 5 -> 00001)
  // Audit log for invoice/correlativo changes
  invoiceAudit: {
    id: string;
    type: 'prefix' | 'nextNumber' | 'manualInvoice' | 'digits';
    actorId?: string;
    actorName?: string;
    timestamp: string;
    details?: string;
    orderId?: string; // opcional, si la entrada aplica a una orden específica
  }[];
  flashSales: FlashSale[];
  
  // Static pages CMS
  pages: Record<string, { slug: string; title: string; content: string }>;
  updatePage: (slug: string, page: { title: string; content: string }) => void;
  deletePage: (slug: string) => void;

  // Actions
  addToCart: (product: Product, selectedAttributes?: Record<string,string>, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (userId: string, customerData: { name: string; email: string; phone: string; address: string }) => Promise<boolean>;
  
  // Admin Actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // Flash Sales Management
  addFlashSale: (sale: FlashSale) => void;
  updateFlashSale: (id: string, sale: Partial<FlashSale>) => void;
  deleteFlashSale: (id: string) => void;
  getActiveFlashSales: () => FlashSale[];
  // Invoice management
  setInvoicePrefix: (prefix: string, by?: { id?: string; name?: string }) => void;
  setInvoiceNextNumber: (n: number, by?: { id?: string; name?: string }) => void;
  setInvoiceDigits: (n: number, by?: { id?: string; name?: string }) => void;
  updateOrder: (orderId: string, patch: Partial<Order>, by?: { id?: string; name?: string }) => Promise<{ success: boolean; error?: string }>;
  addInvoiceAudit: (entry: { type: 'prefix' | 'nextNumber' | 'manualInvoice' | 'digits'; actorId?: string; actorName?: string; details?: string; orderId?: string }) => void;
}

// Initial Data
export const CATEGORIES: Category[] = [
  { id: '1', name: 'Moda', slug: 'moda', icon: 'shirt' },
  { id: '2', name: 'Tecnología', slug: 'tecnologia', icon: 'cpu' },
  { id: '3', name: 'Celulares y Accesorios', slug: 'celulares', icon: 'smartphone' },
  { id: '4', name: 'Electrohogar', slug: 'electrohogar', icon: 'washing-machine' },
  { id: '5', name: 'Comidas', slug: 'comidas', icon: 'utensils' },
  { id: '6', name: 'Servicios IT', slug: 'servicios-it', icon: 'server' },
  { id: '7', name: 'Hogar y Decoración', slug: 'hogar', icon: 'home' },
  { id: '8', name: 'Salud y Belleza', slug: 'salud', icon: 'heart' },
  { id: '9', name: 'Mascotas', slug: 'mascotas', icon: 'dog' },
  { id: '10', name: 'Videojuegos', slug: 'videojuegos', icon: 'gamepad' },
  { id: '11', name: 'Deportes', slug: 'deportes', icon: 'dumbbell' },
  { id: '12', name: 'Niños y Bebés', slug: 'ninos', icon: 'baby' },
];

const MOCK_PRODUCTS: Product[] = [
  // Ropa - Tallas (XS, S, M, L, XL, XXL)
  {
    id: '101',
    name: 'Camiseta Premium Algodón',
    description: 'Camiseta de algodón 100% con excelente calidad',
    price: 89,
    categoryId: '1',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1455849318169-8c8e4f1490b1?w=500&auto=format&fit=crop&q=60'
    ],
    featured: true,
    onSale: false,
    available: true,
    rating: 4.5,
    attributeSchema: [
      { name: 'Talla', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { name: 'Color', type: 'select', options: ['Blanco', 'Negro', 'Gris', 'Azul', 'Rojo'] }
    ],
    variants: [
      { id: 'v1', name: 'XS - Blanco', price: 89, stock: 8, attributes: { talla: 'XS', color: 'Blanco' } },
      { id: 'v2', name: 'S - Blanco', price: 89, stock: 12, attributes: { talla: 'S', color: 'Blanco' } },
      { id: 'v3', name: 'M - Negro', price: 89, stock: 15, attributes: { talla: 'M', color: 'Negro' } },
      { id: 'v4', name: 'L - Azul', price: 89, stock: 10, attributes: { talla: 'L', color: 'Azul' } },
    ]
  },
  // Smartphone
  {
    id: '102',
    name: 'Smartphone Pro Max',
    description: 'Último modelo con cámara 8K y procesador de última generación',
    price: 4500,
    categoryId: '3',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1592286927505-1def25115558?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1606933248051-5ce98c3e6ebc?w=500&auto=format&fit=crop&q=60'
    ],
    featured: true,
    onSale: false,
    available: true,
    rating: 4.8,
    attributeSchema: [
      { name: 'Almacenamiento', type: 'select', options: ['128GB', '256GB', '512GB', '1TB'] },
      { name: 'Color', type: 'select', options: ['Negro', 'Plata', 'Oro', 'Azul'] }
    ],
    variants: [
      { id: 'v5', name: '128GB - Negro', price: 4500, stock: 3, attributes: { almacenamiento: '128GB', color: 'Negro' } },
      { id: 'v6', name: '256GB - Plata', price: 5200, stock: 4, attributes: { almacenamiento: '256GB', color: 'Plata' } },
      { id: 'v7', name: '512GB - Oro', price: 6200, stock: 2, attributes: { almacenamiento: '512GB', color: 'Oro' } },
    ]
  },
  // Laptop
  {
    id: '103',
    name: 'Laptop Developer Edition',
    description: '32GB RAM, 1TB SSD, Procesador última generación',
    price: 6200,
    categoryId: '2',
    stock: 5,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1588675753839-ab7003f3c0d7?w=500&auto=format&fit=crop&q=60'
    ],
    featured: false,
    onSale: false,
    available: true,
    rating: 4.7,
    attributeSchema: [
      { name: 'Procesador', type: 'select', options: ['Intel i7', 'Intel i9', 'AMD Ryzen 7', 'AMD Ryzen 9'] },
      { name: 'Color', type: 'select', options: ['Plateado', 'Gris espacial', 'Negro'] }
    ],
    variants: [
      { id: 'v8', name: 'i7 - Plateado', price: 6200, stock: 2, attributes: { procesador: 'Intel i7', color: 'Plateado' } },
      { id: 'v9', name: 'i9 - Gris', price: 7500, stock: 2, attributes: { procesador: 'Intel i9', color: 'Gris espacial' } },
    ]
  },
  // Zapatillas - Talla y Color
  {
    id: '104',
    name: 'Zapatillas Running Elite',
    description: 'Máxima comodidad para correr con amortiguación premium',
    price: 350,
    categoryId: '11',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1515521396207-6211f368b3d4?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60'
    ],
    featured: false,
    onSale: true,
    available: true,
    rating: 4.6,
    originalPrice: 500,
    attributeSchema: [
      { name: 'Talla', type: 'select', options: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'] },
      { name: 'Color', type: 'select', options: ['Negro/Rojo', 'Blanco/Azul', 'Gris/Naranja', 'Blanco/Negro', 'Multicolor'] }
    ],
    variants: [
      { id: 'v10', name: 'Talla 38 - Negro/Rojo', price: 350, stock: 3, attributes: { talla: '38', color: 'Negro/Rojo' } },
      { id: 'v11', name: 'Talla 40 - Blanco/Azul', price: 350, stock: 5, attributes: { talla: '40', color: 'Blanco/Azul' } },
      { id: 'v12', name: 'Talla 42 - Multicolor', price: 350, stock: 4, attributes: { talla: '42', color: 'Multicolor' } },
    ]
  },
  // Ropa para niños - Talla infantil
  {
    id: '105',
    name: 'Sudadera Infantil Cómoda',
    description: 'Sudadera para niños de algodón suave y elástica',
    price: 75,
    categoryId: '12',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3dd85?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3dd85?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1556821552-5ff63b1b62d7?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3dd85?w=500&auto=format&fit=crop&q=60'
    ],
    featured: false,
    onSale: false,
    available: true,
    rating: 4.4,
    attributeSchema: [
      { name: 'Talla', type: 'select', options: ['2-3 años', '4-5 años', '6-7 años', '8-9 años', '10-12 años'] },
      { name: 'Color', type: 'select', options: ['Azul', 'Rosa', 'Verde', 'Naranja', 'Morado'] }
    ],
    variants: [
      { id: 'v13', name: '4-5 años - Azul', price: 75, stock: 8, attributes: { talla: '4-5 años', color: 'Azul' } },
      { id: 'v14', name: '6-7 años - Rosa', price: 75, stock: 7, attributes: { talla: '6-7 años', color: 'Rosa' } },
      { id: 'v15', name: '8-9 años - Verde', price: 75, stock: 8, attributes: { talla: '8-9 años', color: 'Verde' } },
    ]
  },
  // Sofá
  {
    id: '106',
    name: 'Sofá Moderno 3 Cuerpos',
    description: 'Diseño minimalista gris con estructura de madera',
    price: 1200,
    categoryId: '7',
    stock: 3,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1561439984882-3fee8e2d8b8d?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60'
    ],
    featured: false,
    onSale: false,
    available: true,
    rating: 4.5,
    attributeSchema: [
      { name: 'Color', type: 'select', options: ['Gris', 'Negro', 'Beige', 'Azul marino'] },
      { name: 'Material', type: 'select', options: ['Tela', 'Cuero sintético'] }
    ],
    variants: [
      { id: 'v16', name: 'Gris - Tela', price: 1200, stock: 2, attributes: { color: 'Gris', material: 'Tela' } },
      { id: 'v17', name: 'Negro - Cuero', price: 1500, stock: 1, attributes: { color: 'Negro', material: 'Cuero sintético' } },
    ]
  },
  // Consola
  {
    id: '107',
    name: 'Consola Next-Gen',
    description: '4K 120fps Gaming con controlador inalámbrico incluido',
    price: 2500,
    categoryId: '10',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1605559424843-9e4c3dec3579?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500&auto=format&fit=crop&q=60'
    ],
    featured: true,
    onSale: true,
    available: true,
    rating: 4.9,
    originalPrice: 3000,
    attributeSchema: [
      { name: 'Almacenamiento', type: 'select', options: ['500GB', '1TB', '2TB'] },
      { name: 'Color', type: 'select', options: ['Blanco', 'Negro', 'Rojo'] }
    ],
    variants: [
      { id: 'v18', name: '500GB - Blanco', price: 2500, stock: 3, attributes: { almacenamiento: '500GB', color: 'Blanco' } },
      { id: 'v19', name: '1TB - Negro', price: 2800, stock: 3, attributes: { almacenamiento: '1TB', color: 'Negro' } },
      { id: 'v20', name: '2TB - Rojo', price: 3200, stock: 2, attributes: { almacenamiento: '2TB', color: 'Rojo' } },
    ]
  },
  // Maquillaje
  {
    id: '108',
    name: 'Set de Maquillaje Premium',
    description: 'Kit completo profesional con 30+ productos',
    price: 280,
    categoryId: '8',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1522335789203-abd65242ce63?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1522335789203-abd65242ce63?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1487412947cee-3b5553f70bc8?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1522335789203-abd65242ce63?w=500&auto=format&fit=crop&q=60'
    ],
    featured: false,
    onSale: false,
    available: true,
    rating: 4.3,
    attributeSchema: [
      { name: 'Tipo de piel', type: 'select', options: ['Piel sensible', 'Piel normal', 'Piel grasosa', 'Piel seca'] }
    ],
    variants: [
      { id: 'v21', name: 'Para piel sensible', price: 280, stock: 5, attributes: { 'tipo-de-piel': 'Piel sensible' } },
      { id: 'v22', name: 'Para piel normal', price: 280, stock: 5, attributes: { 'tipo-de-piel': 'Piel normal' } },
      { id: 'v23', name: 'Para piel grasosa', price: 280, stock: 5, attributes: { 'tipo-de-piel': 'Piel grasosa' } },
    ]
  },
  // Ropa de mujer
  {
    id: '109',
    name: 'Vestido de Verano Floral',
    description: 'Tela ligera y fresca perfecta para el verano',
    price: 120,
    categoryId: '1',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1595777713142-62bdd5f6ef9e?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60'
    ],
    featured: false,
    onSale: false,
    available: true,
    rating: 4.2,
    attributeSchema: [
      { name: 'Talla', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL'] },
      { name: 'Diseño', type: 'select', options: ['Floral Rojo', 'Floral Azul', 'Floral Multicolor', 'Liso blanco'] }
    ],
    variants: [
      { id: 'v24', name: 'S - Floral Rojo', price: 120, stock: 3, attributes: { talla: 'S', diseño: 'Floral Rojo' } },
      { id: 'v25', name: 'M - Floral Multicolor', price: 120, stock: 4, attributes: { talla: 'M', diseño: 'Floral Multicolor' } },
      { id: 'v26', name: 'L - Floral Azul', price: 120, stock: 5, attributes: { talla: 'L', diseño: 'Floral Azul' } },
    ]
  },
];

// Default attribute schemas por categoría (si un producto no define attributeSchema)
const DEFAULT_ATTRIBUTES_BY_CATEGORY: Record<string, Product['attributeSchema']> = {
  '1': [ // Moda
    { name: 'Talla', type: 'select', options: ['XS','S','M','L','XL','XXL'] },
    { name: 'Color', type: 'select', options: ['Blanco','Negro','Gris','Azul','Rojo'] }
  ],
  '11': [ // Deportes - calzado
    { name: 'Talla', type: 'select', options: ['35','36','37','38','39','40','41','42','43','44','45','46'] },
    { name: 'Color', type: 'select', options: ['Negro/Rojo','Blanco/Azul','Gris/Naranja','Blanco/Negro','Multicolor'] }
  ],
  '12': [ // Niños
    { name: 'Talla', type: 'select', options: ['2-3 años','4-5 años','6-7 años','8-9 años','10-12 años'] },
    { name: 'Color', type: 'select', options: ['Azul','Rosa','Verde','Naranja','Morado'] }
  ],
  '3': [ // Celulares
    { name: 'Almacenamiento', type: 'select', options: ['128GB','256GB','512GB','1TB'] },
    { name: 'Color', type: 'select', options: ['Negro','Plata','Oro','Azul'] }
  ],
  '2': [ // Tecnología (laptops)
    { name: 'Procesador', type: 'select', options: ['Intel i7','Intel i9','AMD Ryzen 7','AMD Ryzen 9'] },
    { name: 'Color', type: 'select', options: ['Plateado','Gris espacial','Negro'] }
  ],
  '10': [ // Videojuegos - consolas
    { name: 'Almacenamiento', type: 'select', options: ['500GB','1TB','2TB'] },
    { name: 'Color', type: 'select', options: ['Blanco','Negro','Rojo'] }
  ],
  '7': [ // Hogar
    { name: 'Color', type: 'select', options: ['Gris','Negro','Beige','Azul marino'] },
    { name: 'Material', type: 'select', options: ['Tela','Cuero sintético'] }
  ],
  '8': [ // Salud y Belleza
    { name: 'Tipo de piel', type: 'select', options: ['Piel sensible','Piel normal','Piel grasosa','Piel seca'] }
  ]
};

const PRODUCTS: Product[] = MOCK_PRODUCTS.map(p => {
  if (p.attributeSchema && p.attributeSchema.length > 0) return p;
  const defaults = DEFAULT_ATTRIBUTES_BY_CATEGORY[p.categoryId];
  if (defaults) {
    return { ...p, attributeSchema: defaults };
  }
  return p;
});

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      categories: CATEGORIES,
      products: PRODUCTS,
      cart: [],
      orders: [],
      invoicePrefix: 'BOL',
      invoiceNextNumber: 1,
      invoiceDigits: 5,
      invoiceAudit: [],
      flashSales: [
        // Mock flash sale for testing
        {
          id: 'fs-001',
          productId: '103',
          discountPercent: 40,
          startTime: Date.now() - 3600000, // 1 hour ago
          endTime: Date.now() + 86400000, // 24 hours from now
          maxQuantityPerUser: 2,
          active: true
        },
        {
          id: 'fs-002',
          productId: '105',
          discountPercent: 35,
          startTime: Date.now() - 7200000, // 2 hours ago
          endTime: Date.now() + 82800000, // ~23 hours from now
          maxQuantityPerUser: 3,
          active: true
        }
      ],

      // Static pages that can be edited from the admin panel (simple CMS)
      pages: {
        cookies: { slug: 'cookies', title: 'Política de Cookies', content: 'Aquí puedes editar la Política de Cookies desde el panel de administración.' },
        sitemap: { slug: 'sitemap', title: 'Mapa del Sitio', content: 'Mapa del sitio - se puede editar desde la administración.' },
        security: { slug: 'security', title: 'Seguridad', content: 'Información sobre seguridad y prácticas de la tienda.' }
      },
      updatePage: (slug: string, page: { title: string; content: string }) => {
        set(state => ({ pages: { ...state.pages, [slug]: { slug, title: page.title, content: page.content } } }));
      },
      deletePage: (slug: string) => {
        set(state => {
          const next = { ...state.pages } as Record<string, any>;
          delete next[slug];
          return { pages: next };
        });
      },

      addToCart: (product, selectedAttributes, quantity = 1) => {
        const { cart } = get();
        // distinguish items by product id + attributes
        const match = (item: CartItem) => {
          if (item.id !== product.id) return false;
          const a = JSON.stringify(item.selectedAttributes || {});
          const b = JSON.stringify(selectedAttributes || {});
          return a === b;
        };
        const existing = cart.find(match);

        if (existing) {
          set({
            cart: cart.map(item => 
              match(item) 
                ? { ...item, quantity: item.quantity + quantity } 
                : item
            )
          });
        } else {
          const newItem: CartItem = { ...product, quantity, selectedAttributes };
          set({ cart: [...cart, newItem] });
        }
      },

      removeFromCart: (productId) => {
        set(state => ({
          cart: state.cart.filter(item => item.id !== productId)
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set(state => ({
          cart: state.cart.map(item => 
            item.id === productId ? { ...item, quantity } : item
          )
        }));
      },

      clearCart: () => set({ cart: [] }),

      // Invoice settings initialized below
      placeOrder: async (userId, customerData) => {
        const { cart, orders, invoicePrefix, invoiceNextNumber, invoiceDigits } = get();
        if (cart.length === 0) return false;

        // build invoice number: PREFIX-00001 (using configured digits)
        const pad = (n: number, width = invoiceDigits || 5) => String(n).padStart(width, '0');
        const invoiceNum = `${invoicePrefix}-${pad(invoiceNextNumber)}`;

        const newOrder: Order = {
          id: Math.random().toString(36).substr(2, 9),
          userId,
          customerName: customerData.name,
          customerEmail: customerData.email,
          customerPhone: customerData.phone,
          customerAddress: customerData.address,
          invoiceNumber: invoiceNum,
          items: [...cart],
          total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          status: 'pending',
          date: new Date().toISOString(),
          address: customerData.address
        };

        set({
          orders: [newOrder, ...orders],
          cart: [],
          invoiceNextNumber: invoiceNextNumber + 1
        });

        return true;
      },
      
      addProduct: (product) => {
        set(state => ({ products: [product, ...state.products] }));
      },

      updateProduct: (id, updates) => {
        set(state => ({
          products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
        }));
      },

      deleteProduct: (id) => {
        set(state => ({
          products: state.products.filter(p => p.id !== id)
        }));
      },

      addCategory: (category) => {
        set(state => ({ categories: [...state.categories, category] }));
      },

      deleteCategory: (id) => {
        set(state => ({
          categories: state.categories.filter(c => c.id !== id)
        }));
      },

      updateOrderStatus: (orderId, status) => {
        set(state => ({
          orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
        }));
      },

      addFlashSale: (sale) => {
        set(state => ({ flashSales: [...state.flashSales, sale] }));
      },

      updateFlashSale: (id, updates) => {
        set(state => ({
          flashSales: state.flashSales.map(s => s.id === id ? { ...s, ...updates } : s)
        }));
      },

      deleteFlashSale: (id) => {
        set(state => ({
          flashSales: state.flashSales.filter(s => s.id !== id)
        }));
      },

      getActiveFlashSales: () => {
        const { flashSales } = get();
        const now = Date.now();
        return flashSales.filter(s => s.active && s.startTime <= now && s.endTime > now);
      }
      ,
      // Invoice management
      setInvoicePrefix: (prefix: string, by) => {
        const prev = get().invoicePrefix;
        // sanitize: only letters and numbers, uppercase, max length 6
        const cleaned = (prefix || '').toString().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0,6);
        if (!cleaned) return;
        const ts = new Date().toISOString();
        set(state => ({
          invoicePrefix: cleaned,
          invoiceAudit: [
            ...state.invoiceAudit,
            { id: Math.random().toString(36).substr(2,9), type: 'prefix', actorId: by?.id, actorName: by?.name, timestamp: ts, details: `Prefijo cambiado de ${prev} a ${cleaned}` }
          ]
        }));
      },
      setInvoiceNextNumber: (n: number, by) => {
        const prev = get().invoiceNextNumber;
        const val = Math.max(1, Math.floor(Number(n) || 1));
        const ts = new Date().toISOString();
        set(state => ({
          invoiceNextNumber: val,
          invoiceAudit: [
            ...state.invoiceAudit,
            { id: Math.random().toString(36).substr(2,9), type: 'nextNumber', actorId: by?.id, actorName: by?.name, timestamp: ts, details: `Siguiente correlativo cambiado de ${prev} a ${val}` }
          ]
        }));
      },
      setInvoiceDigits: (n: number, by) => {
        const prev = get().invoiceDigits;
        const val = Math.min(8, Math.max(3, Math.floor(Number(n) || prev || 5)));
        const ts = new Date().toISOString();
        set(state => ({
          invoiceDigits: val,
          invoiceAudit: [
            ...state.invoiceAudit,
            { id: Math.random().toString(36).substr(2,9), type: 'digits', actorId: by?.id, actorName: by?.name, timestamp: ts, details: `Digitos de padding cambiados de ${prev} a ${val}` }
          ]
        }));
      },
      updateOrder: async (orderId, patch, by) => {
        const { orders, invoiceDigits, invoicePrefix } = get();
        if (patch.invoiceNumber) {
          // Validate format: PREFIX-00001 with fixed digits
          const digits = invoiceDigits || 5;
          const re = new RegExp(`^[A-Z0-9]+-\\d{${digits}}$`, 'i');
          if (!re.test(patch.invoiceNumber)) {
            const example = `${(invoicePrefix || 'BOL')}-${'0'.repeat(Math.max(1, digits-1))}1`;
            return { success: false, error: `Formato inválido. Ej: ${example}` };
          }
          const duplicate = orders.find(o => o.invoiceNumber === patch.invoiceNumber && o.id !== orderId);
          if (duplicate) {
            return { success: false, error: 'Número de boleta ya existe' };
          }
        }
        set(state => ({
          orders: state.orders.map(o => o.id === orderId ? { ...o, ...patch } : o)
        }));
        if (patch.invoiceNumber) {
          const ts = new Date().toISOString();
          set(state => ({
            invoiceAudit: [
              ...state.invoiceAudit,
              { id: Math.random().toString(36).substr(2,9), type: 'manualInvoice', actorId: by?.id, actorName: by?.name, timestamp: ts, details: `Boleta ${patch.invoiceNumber} asignada a orden ${orderId}`, orderId }
            ]
          }));
        }
        return { success: true };
      },
      addInvoiceAudit: (entry) => {
        const ts = new Date().toISOString();
        set(state => ({ invoiceAudit: [...state.invoiceAudit, { id: Math.random().toString(36).substr(2,9), timestamp: ts, ...entry }] }));
      }
    }),
    {
      name: 'flabef-store-storage',
    }
  )
);