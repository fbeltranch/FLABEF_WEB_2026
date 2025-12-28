import { Order, useStore } from "@/lib/mock-store";
import { openInvoicePreview, openInvoiceOverlay, printInvoice, generateInvoiceHtml } from "@/components/InvoicePrintable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, MapPin, Package, Clock, DollarSign } from "lucide-react";
import { useAuth } from "@/lib/mock-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface OrderPreviewModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusLabels = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'En Proceso', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800' }
};

export default function OrderPreviewModal({ order, open, onOpenChange }: OrderPreviewModalProps) {
  if (!order) return null;

  const statusInfo = statusLabels[order.status];
  const auth = useAuth();
  const current = auth.currentUser;
  const updateOrder = useStore(state => state.updateOrder);
  const invoiceAudit = useStore(state => state.invoiceAudit);
  const [editingInvoice, setEditingInvoice] = useState(order.invoiceNumber || '');
  const [docType, setDocType] = useState<'comprobante' | 'boleta' | 'factura'>('boleta');


  const canEditInvoice = current?.role === 'super_admin';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div role="dialog" className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Orden #{order.id.substring(0, 8).toUpperCase()}</span>
            <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Correlativo / Boleta */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Boleta / Correlativo</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <select value={docType} onChange={(e) => setDocType(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
                  <option value="comprobante">Comprobante</option>
                  <option value="boleta">Boleta</option>
                  <option value="factura">Factura</option>
                </select>
                <span className="text-xs text-muted-foreground">Selecciona tipo de comprobante</span>
              </div>

              {canEditInvoice ? (
                <>
                  <Input value={editingInvoice} onChange={(e) => setEditingInvoice(e.target.value)} className="w-48 text-sm" />
                  <Button size="sm" onClick={async () => {
                    const auth = useAuth.getState();
                    const res = await updateOrder(order.id, { invoiceNumber: editingInvoice }, { id: auth.currentUser?.id, name: auth.currentUser?.fullName });
                    if (!res.success) return toast({ title: 'Error', description: res.error });
                    toast({ title: 'Boleta actualizada' });
                  }} >Guardar</Button>
                  <Button variant="ghost" size="sm" onClick={() => openInvoiceOverlay(order, docType)}>Vista previa</Button>
                  <Button variant="ghost" size="sm" onClick={() => printInvoice(order, docType)}>Imprimir</Button>
                </>
              ) : (
                <div className="font-semibold flex items-center gap-2">
                  <span>{order.invoiceNumber || '-'}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openInvoiceOverlay(order, docType)}>Vista previa</Button>
                    <Button variant="ghost" size="sm" onClick={() => printInvoice(order, docType)}>Imprimir</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Información del Cliente */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              Información del Cliente
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Nombre</span>
                <p className="font-semibold">{order.customerName}</p>
              </div>
              <div>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Mail className="w-4 h-4" /> Email
                </span>
                <p className="font-semibold text-blue-600 break-all">{order.customerEmail}</p>
              </div>
              <div>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Phone className="w-4 h-4" /> Teléfono/WhatsApp
                </span>
                <p className="font-semibold text-green-600">{order.customerPhone}</p>
              </div>
              <div>
                <span className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Dirección
                </span>
                <p className="font-semibold">{order.customerAddress}</p>
              </div>
            </div>
          </div>

          {/* Información de la Orden */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Detalles de la Orden
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Fecha</span>
                <p className="font-semibold">{new Date(order.date).toLocaleDateString('es-PE')}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Hora</span>
                <p className="font-semibold">{new Date(order.date).toLocaleTimeString('es-PE')}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total</span>
                <p className="font-semibold text-lime-600 text-lg">S/ {order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Productos ({order.items.length})
            </h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cantidad: <span className="font-semibold">{item.quantity}</span> × S/ {item.price.toFixed(2)}
                    </p>
                    {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-semibold">Atributos:</span> {Object.entries(item.selectedAttributes).map(([k, v]) => `${k}: ${v}`).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lime-600">S/ {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen */}
          <div className="border rounded-lg p-4 bg-lime-50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Resumen Financiero
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-semibold">S/ {order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-lg text-lime-600">S/ {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notas (si existen) */}
          {order.notes && (
            <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
              <h3 className="font-semibold mb-2">Notas Internas</h3>
              <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}

          {/* Historial de auditoría (por orden) */}
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-semibold mb-3">Historial de Auditoría (Orden)</h3>
            <div className="text-sm space-y-2 max-h-40 overflow-auto">
              {invoiceAudit.filter(a => a.orderId === order.id).slice().reverse().map(entry => (
                <div key={entry.id} className="p-2 border rounded">
                  <div className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString('es-PE')}</div>
                  <div className="font-semibold text-sm">{entry.type} — {entry.actorName || entry.actorId || 'Sistema'}</div>
                  <div className="text-xs text-muted-foreground">{entry.details}</div>
                </div>
              ))}
              {invoiceAudit.filter(a => a.orderId === order.id).length === 0 && (
                <div className="text-xs text-muted-foreground">Sin historial para esta orden</div>
              )}
            </div>
          </div>
        </div>
        </div>


    </Dialog>
  );
}
