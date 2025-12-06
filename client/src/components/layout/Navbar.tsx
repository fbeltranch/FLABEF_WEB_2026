import { Link, useLocation } from "wouter";
import { ShoppingCart, User, Menu, Search, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { cart, categories } = useStore();
  const [location, setLocation] = useLocation();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center px-4">
        {/* Mobile Menu */}
        <div className="mr-4 hidden md:flex">
          <Link href="/">
            <a className="mr-6 flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white">
                <ShieldCheck size={18} />
              </div>
              <span className="hidden font-heading font-bold text-xl text-primary sm:inline-block">
                FLABEF
              </span>
            </a>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:flex">
                  Categorías
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 grid grid-cols-2 gap-1 p-2">
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.id} onClick={() => setLocation(`/category/${cat.slug}`)}>
                    {cat.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/products"><a className="transition-colors hover:text-foreground/80 text-foreground/60">Catálogo</a></Link>
            {/* <Link href="/deals"><a className="transition-colors hover:text-foreground/80 text-foreground/60 text-red-500 font-medium">Ofertas</a></Link> */}
          </nav>
        </div>

        {/* Mobile Logo */}
        <div className="flex flex-1 md:hidden">
          <Link href="/">
             <a className="flex items-center gap-2 font-heading font-bold text-primary">
               <ShieldCheck size={18} /> FLABEF
             </a>
          </Link>
        </div>

        {/* Search */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="h-9 w-full md:w-[300px] pl-8 rounded-full bg-muted/50"
              />
            </div>
          </div>

          {/* Actions */}
          <nav className="flex items-center space-x-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Carrito</span>
              </Button>
            </Link>

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Cuenta</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Hola, {currentUser.fullName}</DropdownMenuLabel>
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
                <Button size="sm">Ingresar</Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}