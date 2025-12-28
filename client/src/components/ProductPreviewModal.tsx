import { useState, useRef, useEffect } from "react";
import { X, ShoppingCart, Star, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/mock-store";

interface ProductPreviewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, selectedAttributes?: Record<string,string>) => void;
}

export default function ProductPreviewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductPreviewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all images (fallback to single image if images array doesn't exist)
  const images = product?.images && product.images.length > 0 ? product.images : [product?.image || ''];

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prevActive = document.activeElement as HTMLElement | null;
    // focus modal for keyboard users
    setTimeout(() => { modalRef.current?.focus(); }, 0);
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') { onClose(); } }
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); try { prevActive?.focus?.(); } catch(e) {} };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    // Validar que todos los atributos requeridos estén seleccionados
    if (product.attributeSchema && product.attributeSchema.length > 0) {
      const missingAttributes = product.attributeSchema.filter(
        schema => !selectedAttributes[schema.name.toLowerCase().replace(/\s+/g, '-')]
      );
      if (missingAttributes.length > 0) {
        alert(`Por favor selecciona: ${missingAttributes.map(a => a.name).join(', ')}`);
        return;
      }
    }
    
    onAddToCart(product, selectedAttributes);
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      onClose();
    }, 1500);
  };

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div ref={modalRef} role="dialog" aria-modal="true" aria-label={`Vista previa ${product.name}`} tabIndex={-1} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Cerrar vista previa"
          title="Cerrar vista previa"
          className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition z-10 border border-gray-200"
        >
          <X size={24} className="text-gray-900" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Product Image - Gallery */}
          <div className="flex flex-col items-center justify-center">
            {/* Main Image */}
            <div className="relative w-full bg-gray-100 rounded-xl overflow-hidden mb-4">
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-auto object-cover"
                style={{ maxHeight: '500px' }}
              />
              
              {/* Navigation Arrows - Only show if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    aria-label="Imagen anterior"
                    title="Imagen anterior"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition z-10"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-900" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    aria-label="Siguiente imagen"
                    title="Siguiente imagen"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition z-10"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-900" />
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails - Only show if multiple images */}
            {images.length > 1 && (
              <div className="flex gap-2 w-full overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}                    aria-label={`Ver imagen ${idx + 1}`}
                    title={`Ver imagen ${idx + 1}`}                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      idx === currentImageIndex ? 'border-lime-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            {/* Header Section */}
            <div>
              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {product.featured && (
                  <span className="bg-lime-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                    DESTACADO
                  </span>
                )}
                {product.onSale && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    EN OFERTA
                  </span>
                )}
                {product.stock < 5 && product.stock > 0 && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ¡ÚLTIMAS UNIDADES!
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < (product.rating || 4)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  ({product.rating || 4}/5)
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">
                  Características
                </h3>
                <p className="text-gray-700 leading-relaxed text-base">
                  {product.description}
                </p>
              </div>

              {/* Stock Status */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    Disponibilidad
                  </span>
                  <span
                    className={`font-bold ${
                      product.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.stock > 0 ? (
                      <span className="flex items-center gap-1">
                        <Check size={16} /> {product.stock} en stock
                      </span>
                    ) : (
                      "Agotado"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Action Section */}
            <div className="border-t border-gray-200 pt-6">
              {/* Price Section - Enhanced */}
              <div className="mb-6 bg-gradient-to-r from-lime-50 to-green-50 rounded-xl p-4">
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2">Precio</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-4xl font-bold text-gray-900">
                    S/ {product.price.toFixed(2)}
                  </p>
                  {product.onSale && product.originalPrice && (
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-500 line-through">
                        S/ {product.originalPrice.toFixed(2)}
                      </p>
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                        Ahorra {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
                {product.onSale && (
                  <p className="text-xs text-green-700 font-semibold mt-2">✓ Oferta especial activa</p>
                )}
              </div>

              {/* Features List */}
              <div className="mb-6">
                <p className="text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">Beneficios</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2 items-start">
                    <span className="text-lime-600 font-bold">✓</span>
                    <span>Calidad garantizada y verificada</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-lime-600 font-bold">✓</span>
                    <span>Envío rápido a todo el país</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-lime-600 font-bold">✓</span>
                    <span>30 días para cambios o devoluciones</span>
                  </li>
                </ul>
              </div>

              {/* Attribute Selection */}
              {product.attributeSchema && product.attributeSchema.length > 0 && (
                <div className="mb-6 border-t border-gray-200 pt-6">
                  <p className="text-gray-700 font-semibold mb-4 text-sm uppercase tracking-wide">
                    Selecciona opciones
                  </p>
                  <div className="space-y-4">
                    {product.attributeSchema.map((schema) => {
                      const attrKey = schema.name.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <div key={schema.name}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {schema.name}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {schema.options.map((option) => (
                              <button
                                key={option}
                                onClick={() =>
                                  setSelectedAttributes({
                                    ...selectedAttributes,
                                    [attrKey]: option,
                                  })
                                }
                                className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition ${
                                  selectedAttributes[attrKey] === option
                                    ? 'border-lime-500 bg-lime-100 text-gray-900'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <p className="text-gray-700 font-semibold mb-3 text-sm">
                    Cantidad
                  </p>
                  <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-lg w-fit">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity === 1}
                      aria-label="Disminuir cantidad"
                      title="Disminuir cantidad"
                      className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-lg"
                    >
                      −
                    </button>
                    <span className="text-lg font-bold text-gray-900 w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= product.stock}
                      aria-label="Aumentar cantidad"
                      title="Aumentar cantidad"
                      className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Máximo disponible: {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'}
                  </p>
                </div>
              )}

              {/* Total Price Display */}
              {product.stock > 0 && (
                <div className="bg-lime-100 rounded-lg p-3 mb-6">
                  <p className="text-xs text-gray-600 mb-1">Total por {quantity} {quantity === 1 ? 'unidad' : 'unidades'}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    S/ {(product.price * quantity).toFixed(2)}
                  </p>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addedToCart}
                className="w-full h-13 text-base bg-lime-400 text-black hover:bg-lime-500 font-bold rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
              >
                {addedToCart ? (
                  <>
                    <Check size={20} /> ¡Agregado al carrito!
                  </>
                ) : product.stock === 0 ? (
                  <>Agotado</>
                ) : (
                  <>
                    <ShoppingCart size={20} /> Agregar al Carrito
                  </>
                )}
              </Button>

              {/* Trust Badge */}
              <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-600">
                <span>🔒</span> Compra segura garantizada
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
