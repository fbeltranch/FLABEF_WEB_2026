import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Recovery from "@/pages/auth/Recovery";
import AdminDashboard from "@/pages/admin/Dashboard";
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
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;