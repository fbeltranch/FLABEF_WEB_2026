import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, Search, ChevronRight, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/mock-store";
import { useState } from "react";

export default function Navbar() {
  const { cart, categories } = useStore();
  const [location, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const q = searchTerm.trim();
      if (q.length > 0) {
        setLocation(`/products?search=${encodeURIComponent(q)}`);
      } else {
        setLocation('/products');
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black text-white supports-[backdrop-filter]:bg-black/95 backdrop-blur">
      {/* Top Bar - Promo (subtle, trust-focused) */}
      <div className="hidden sm:block w-full">
        <div className="bg-gradient-to-r from-lime-50 to-white text-black text-xs py-1 px-4 text-center font-medium border-b border-gray-200">
          <div className="container mx-auto flex items-center justify-center gap-3">
            <Shield className="h-4 w-4 text-lime-600" />
            <span>Envíos gratis desde <strong>S/.200</strong> • Pago 100% seguro • Soporte 24/7</span>
          </div>
        </div>
      </div>
      
      <div className="container flex h-16 items-center px-4 gap-4">
        {/* Hamburger Menu - Categories */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Abrir menú" title="Abrir menú" className="text-white hover:bg-white/10 -ml-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <SheetHeader className="p-4 border-b bg-primary text-white">
              <SheetTitle className="text-white flex items-center gap-2">
                FLABEF Menú
              </SheetTitle>
            </SheetHeader>
            <div className="py-2">
              <div className="px-4 py-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">Categorías</div>
              <div className="flex flex-col">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setLocation(`/category/${cat.slug}`);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-between px-6 py-3 text-sm hover:bg-gray-100 transition-colors text-left border-b border-gray-100 last:border-0"
                  >
                    <span className="flex items-center gap-3">
                      {cat.name}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 font-heading font-black text-2xl tracking-tighter text-white hover:text-primary transition-colors mr-4">
            <span className="text-primary">FLA</span>BEF
          </a>
        </Link>

        {/* Search - Retail Style (Wide) */}
        <div className="flex-1 max-w-2xl hidden md:block">
          <div className="relative group">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder="Buscar en Flabef..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKey}
              className="h-10 w-full rounded-full bg-white text-black border-0 focus-visible:ring-2 focus-visible:ring-primary pl-4 pr-10"
            />
          </div>
        </div>

        {/* Mobile Search Icon (triggers nothing for now, just UI) */}
        <Button variant="ghost" size="icon" aria-label="Buscar" title="Buscar" className="md:hidden text-white">
           <Search className="h-5 w-5" />
        </Button>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-4 ml-auto">
          {/* Admin access via /admin-secret-2024 (no lock icon in navbar) */}

          <Link href="/cart">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:bg-white/10 hover:text-white"
            aria-label={`Carrito (${cartCount})`}
            title={`Carrito (${cartCount})`}
          >
            <ShoppingCart className="h-6 w-6 text-white" />

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1.5 rounded-full bg-lime-500 text-[10px] font-bold text-black flex items-center justify-center ring-2 ring-white shadow-sm transition-all">
                {cartCount}
              </span>
            )}

            <span className="sr-only">Carrito</span>
          </Button>
        </Link>
        </div>
      </div>
      
      {/* Secondary Nav (Desktop Categories) - Optional, but common in retail */}
      <div className="container hidden md:flex items-center gap-6 px-4 h-10 text-sm font-medium text-gray-300 overflow-x-auto">
        {categories.slice(0, 8).map(cat => (
          <Link key={cat.id} href={`/category/${cat.slug}`}>
            <a className="hover:text-primary whitespace-nowrap transition-colors">{cat.name}</a>
          </Link>
        ))}
        <Link href="/products">
           <a className="text-primary hover:underline whitespace-nowrap ml-auto">Ver Todo Ofertas</a>
        </Link>
      </div>
    </header>
  );
}