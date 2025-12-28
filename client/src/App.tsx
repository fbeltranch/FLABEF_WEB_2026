import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { useEffect } from 'react';
import { useAuth } from '@/lib/mock-auth';
import { useLocation } from 'wouter';

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Recovery from "@/pages/auth/Recovery";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminPanel from "@/pages/admin/AdminPanel";
import AdminEntry from "@/pages/admin/AdminEntry";
import Home from "@/pages/Home";

// Store Pages
import Catalog from "@/pages/store/Catalog";
import Cart from "@/pages/store/Cart";
import Checkout from "@/pages/store/Checkout";
import UserProfile from "@/pages/profile/UserProfile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/recovery" component={Recovery} />
      
      {/* Store Routes */}
      <Route path="/products" component={Catalog} />
      <Route path="/category/:category" component={Catalog} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      
      {/* Protected Routes (Mock protection in component) */}
      <Route path="/profile" component={UserProfile} />
      <Route path="/dashboard" component={AdminDashboard} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/admin-secret-2024" component={AdminEntry} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      try {
        // Accept previewClosed regardless of origin (popup may have a blob URL with null origin)
        if (e.data && e.data.type === 'previewClosed') {
          // Logout and redirect to login
          logout();
          setLocation('/login');
        }

        // Test hook: seed an order programmatically when running in development/tests
        if (process.env.NODE_ENV !== 'production' && e.data && e.data.type === 'TEST_SEED_ORDER') {
          // import the store dynamically and place an order
          (async () => {
            try {
              const mod = await import('@/lib/mock-store');
              const store = mod.useStore;
              await store.getState().placeOrder(e.data.userId || 'test', e.data.customerData || {
                name: 'Test User', email: 'test@example.com', phone: '987654321', address: 'Av. Test 123'
              });
            } catch (err) {
              // ignore test seed errors
            }
          })();
        }
      } catch (err) {
        // ignore
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [logout, setLocation]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;