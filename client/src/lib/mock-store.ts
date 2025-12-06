import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  stock: number;
  rating?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  address: string;
}

interface StoreState {
  categories: Category[];
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  
  // Actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (userId: string, address: string) => Promise<boolean>;
  
  // Admin Actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
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
  { id: '101', name: 'Smartphone Pro Max', description: 'Último modelo con cámara 8K', price: 4500, categoryId: '3', stock: 10, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60' },
  { id: '102', name: 'Laptop Developer Edition', description: '32GB RAM, 1TB SSD', price: 6200, categoryId: '2', stock: 5, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60' },
  { id: '103', name: 'Zapatillas Running Elite', description: 'Máxima comodidad para correr', price: 350, categoryId: '11', stock: 20, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60' },
  { id: '104', name: 'Sofá Moderno 3 Cuerpos', description: 'Diseño minimalista gris', price: 1200, categoryId: '7', stock: 3, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60' },
  { id: '105', name: 'Consola Next-Gen', description: '4K 120fps Gaming', price: 2500, categoryId: '10', stock: 8, image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500&auto=format&fit=crop&q=60' },
  { id: '106', name: 'Set de Maquillaje Premium', description: 'Kit completo profesional', price: 280, categoryId: '8', stock: 15, image: 'https://images.unsplash.com/photo-1522335789203-abd65242ce63?w=500&auto=format&fit=crop&q=60' },
  { id: '107', name: 'Alimento Premium Perro', description: 'Saco 15kg Balanceado', price: 180, categoryId: '9', stock: 50, image: 'https://images.unsplash.com/photo-1589924691195-41432c84c161?w=500&auto=format&fit=crop&q=60' },
  { id: '108', name: 'Vestido de Verano Floral', description: 'Tela ligera y fresca', price: 120, categoryId: '1', stock: 12, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60' },
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      categories: CATEGORIES,
      products: MOCK_PRODUCTS,
      cart: [],
      orders: [],

      addToCart: (product) => {
        const { cart } = get();
        const existing = cart.find(item => item.id === product.id);
        
        if (existing) {
          set({
            cart: cart.map(item => 
              item.id === product.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            )
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
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

      placeOrder: async (userId, address) => {
        const { cart, orders } = get();
        if (cart.length === 0) return false;

        const newOrder: Order = {
          id: Math.random().toString(36).substr(2, 9),
          userId,
          items: [...cart],
          total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          status: 'pending',
          date: new Date().toISOString(),
          address
        };

        set({
          orders: [newOrder, ...orders],
          cart: []
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
      }
    }),
    {
      name: 'flabef-store-storage',
    }
  )
);