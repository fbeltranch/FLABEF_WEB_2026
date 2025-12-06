import { Link, useLocation } from "wouter";
import { ShoppingCart, User, Menu, Search, LogOut, ShieldCheck, ChevronRight, X } from "lucide-react";
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
import { useAuth } from "@/lib/mock-auth";
import { useStore } from "@/lib/mock-store";
import { useState } from "react";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { cart, categories } = useStore();
  const [location, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black text-white supports-[backdrop-filter]:bg-black/95 backdrop-blur">
      {/* Top Bar - Retail Style */}
      <div className="bg-primary text-white text-xs py-1 px-4 text-center font-medium hidden sm:block">
        ¡Envíos GRATIS por compras mayores a S/. 200! | Compra 100% Segura
      </div>
      
      <div className="container flex h-16 items-center px-4 gap-4">
        {/* Hamburger Menu - Categories */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 -ml-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <SheetHeader className="p-4 border-b bg-primary text-white">
              <SheetTitle className="text-white flex items-center gap-2">
                <ShieldCheck size={20} /> Hola, {currentUser?.fullName.split(' ')[0] || 'Invitado'}
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
                      {/* Fallback icon logic or real icon render if available */}
                      {cat.name}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                ))}
              </div>
              
              <div className="mt-4 border-t pt-4">
                 <div className="px-4 py-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">Mi Cuenta</div>
                 <Link href="/profile">
                   <a className="block px-6 py-3 text-sm hover:bg-gray-100">Mis Pedidos</a>
                 </Link>
                 {currentUser ? (
                   <button onClick={() => logout()} className="w-full text-left px-6 py-3 text-sm hover:bg-gray-100 text-red-600">
                     Cerrar Sesión
                   </button>
                 ) : (
                   <Link href="/login">
                     <a className="block px-6 py-3 text-sm hover:bg-gray-100 text-primary font-bold">Iniciar Sesión / Registrarse</a>
                   </Link>
                 )}
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
              className="h-10 w-full rounded-full bg-white text-black border-0 focus-visible:ring-2 focus-visible:ring-primary pl-4 pr-10"
            />
          </div>
        </div>

        {/* Mobile Search Icon (triggers nothing for now, just UI) */}
        <Button variant="ghost" size="icon" className="md:hidden text-white">
           <Search className="h-5 w-5" />
        </Button>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-4 ml-auto">
          {currentUser ? (
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="hidden md:flex items-center gap-2 text-white hover:bg-white/10 hover:text-white">
                   <div className="flex flex-col items-start text-xs">
                     <span className="font-normal opacity-80">Hola,</span>
                     <span className="font-bold">{currentUser.fullName.split(' ')[0]}</span>
                   </div>
                   <User className="h-6 w-6" />
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-56">
                 <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={() => setLocation('/profile')}>Mis Pedidos</DropdownMenuItem>
                 <DropdownMenuItem onClick={() => setLocation('/profile')}>Mi Perfil</DropdownMenuItem>
                 {['super_admin', 'admin_gestor', 'admin_basico'].includes(currentUser.role) && (
                   <>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={() => setLocation('/dashboard')}>Panel Admin</DropdownMenuItem>
                   </>
                 )}
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={() => { logout(); setLocation('/'); }} className="text-red-600">
                   <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
          ) : (
            <Link href="/login">
              <div className="hidden md:flex flex-col items-start text-xs text-white cursor-pointer hover:text-primary mr-2">
                <span className="font-normal opacity-80">Bienvenido</span>
                <span className="font-bold flex items-center gap-1">Inicia Sesión <ChevronRight size={12}/></span>
              </div>
            </Link>
          )}

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 hover:text-white">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-black">
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