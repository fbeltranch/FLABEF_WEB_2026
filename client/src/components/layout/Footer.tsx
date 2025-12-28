import { Link } from "wouter";
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail, Truck, Shield, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-20">
      {/* Top Accent Banner */}
      <div className="bg-lime-400 h-1 w-full"></div>

      <div className="container mx-auto px-4">
        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 py-12 border-b border-gray-800">
          <div className="flex items-start gap-4">
            <Truck className="text-lime-400 flex-shrink-0 mt-1" size={28} />
            <div>
              <h4 className="font-bold text-white mb-1">Envíos Rápidos</h4>
              <p className="text-sm text-gray-400">Entrega a toda la región en 24-48 horas</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Shield className="text-lime-400 flex-shrink-0 mt-1" size={28} />
            <div>
              <h4 className="font-bold text-white mb-1">100% Seguro</h4>
              <p className="text-sm text-gray-400">Transacciones protegidas y encriptadas</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="text-lime-400 flex-shrink-0 mt-1" size={28} />
            <div>
              <h4 className="font-bold text-white mb-1">Atención 24/7</h4>
              <p className="text-sm text-gray-400">Estamos aquí para ayudarte siempre</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 py-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold">
              <span className="text-lime-400">FLA</span><span className="text-white">BEF</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Tu tienda premium de confianza. Productos de calidad con envíos rápidos a toda la región.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="bg-gray-800 hover:bg-lime-400 hover:text-black p-2 rounded-full transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-lime-400 hover:text-black p-2 rounded-full transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-lime-400 hover:text-black p-2 rounded-full transition-all duration-300">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-lg">Tienda</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-lime-400 transition-colors">Inicio</a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="text-gray-400 hover:text-lime-400 transition-colors">Catálogo</a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
                  Promociones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
                  Nuevos Productos
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-lg">Soporte</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-lg">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-lime-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">Lima, Perú</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-lime-400 mt-0.5 flex-shrink-0" />
                <a href="tel:+51912345678" className="text-gray-400 hover:text-lime-400 transition-colors">
                  +51 912 345 678
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-lime-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@flabef.com" className="text-gray-400 hover:text-lime-400 transition-colors">
                  info@flabef.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {currentYear} FLABEF Premium E-Commerce. Todos los derechos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-lime-400 transition-colors">
              Política de Cookies
            </a>
            <a href="#" className="hover:text-lime-400 transition-colors">
              Mapa del Sitio
            </a>
            <a href="#" className="hover:text-lime-400 transition-colors">
              Seguridad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
