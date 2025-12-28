# 💡 EJEMPLOS PRÁCTICOS - Sistema de Variantes FLABEF

## 🛍️ CASO DE USO 1: Cliente Compra Zapatillas

### Paso 1: Cliente navega al catálogo
```
Usuario entra a: http://localhost:5000/products
Ve categoría "Deportes" con zapatillas disponibles
```

### Paso 2: Cliente ve opciones disponibles
```
TARJETA DEL PRODUCTO:
┌─────────────────────┐
│ Zapatillas Running  │
│ Elite               │
│ S/ 350              │
│                     │
│ Opciones:           │
│ [Talla] [Color]     │
│                     │
│ [VER DETALLES]      │
└─────────────────────┘
```

### Paso 3: Cliente abre el modal
```
Click en "VER DETALLES" → Abre Modal Grande
```

### Paso 4: Cliente selecciona talla
```
MODAL:
┌────────────────────────────────────────┐
│ Zapatillas Running Elite                │
│                                         │
│ Selecciona opciones:                    │
│                                         │
│ Talla:                                  │
│ [35] [36] [37] [38] [39] [40]          │
│ [41] [42] [43] [44] [45] [46]          │
│                                         │
│ Usuario elige: [40 ← SELECCIONADA]     │
└────────────────────────────────────────┘
```

### Paso 5: Cliente selecciona color
```
MODAL (Continuación):
│                                         │
│ Color:                                  │
│ [Negro/Rojo] [Blanco/Azul]             │
│ [Gris/Naranja] [Blanco/Negro]          │
│ [Multicolor ← SELECCIONADA]            │
│                                         │
│ ✅ Ambas opciones seleccionadas        │
└────────────────────────────────────────┘
```

### Paso 6: Cliente selecciona cantidad
```
│                                         │
│ Cantidad:                               │
│ [−] 2 [+]                              │
│                                         │
│ Total: S/ 700.00                       │
│                                         │
│ [🛒 AGREGAR AL CARRITO]                │
└────────────────────────────────────────┘
```

### Paso 7: Sistema valida
```
Sistema verifica:
✓ Talla seleccionada: 40
✓ Color seleccionado: Multicolor
✓ Cantidad: 2
✓ Stock disponible: 4 > 2 ✅

Acción: AGREGA AL CARRITO
```

### Paso 8: Carrito actualizado
```
CARRITO:
┌─────────────────────────────────┐
│ 1. Zapatillas Running Elite      │
│    Talla: 40                    │
│    Color: Multicolor            │
│    Cantidad: 2                  │
│    Subtotal: S/ 700.00          │
│                                 │
│ TOTAL CARRITO: S/ 700.00        │
└─────────────────────────────────┘
```

---

## 👕 CASO DE USO 2: Cliente Compra Ropa Infantil

### Escenario: Madre comprando para su hijo

**Paso 1:** Abre catálogo
```
Va a → Categorías → "Niños y Bebés"
```

**Paso 2:** Ve opciones disponibles
```
SUDADERA INFANTIL CÓMODA
Precio: S/ 75
Opciones: Talla Infantil, Color
[VER DETALLES]
```

**Paso 3:** Abre modal
```
Modal abierto, ve:
- Imagen grande de la sudadera
- Descripción: "Sudadera para niños de algodón..."
- Stock disponible
```

**Paso 4:** Selecciona talla infantil
```
Talla:
[2-3 años] [4-5 años] [6-7 años ← AQUÍ]
[8-9 años] [10-12 años]

Madre selecciona: 6-7 años
(Su hijo tiene 6 años)
```

**Paso 5:** Selecciona color
```
Color:
[Azul] [Rosa ← AQUÍ] [Verde] [Naranja] [Morado]

Madre selecciona: Rosa
(Color favorito de su hijo)
```

**Paso 6:** Cantidad y compra
```
Cantidad: [−] 1 [+]
Total: S/ 75.00

[🛒 AGREGAR AL CARRITO]
```

**Resultado:**
```
CARRITO:
└─ Sudadera Infantil Cómoda
   ├─ Talla: 6-7 años
   ├─ Color: Rosa
   ├─ Cantidad: 1
   └─ Subtotal: S/ 75.00
```

---

## 📱 CASO DE USO 3: Cliente Compra Smartphone con Validación

### Escenario: Usuario intenta comprar sin seleccionar atributo

**Paso 1:** Abre producto
```
Click en: Smartphone Pro Max
Modal abierto
```

**Paso 2:** Selecciona almacenamiento
```
Almacenamiento:
[128GB] [256GB ← SELECCIONADA] [512GB] [1TB]

Usuario selecciona: 256GB ✓
```

**Paso 3:** ❌ Intenta agregar sin color
```
Usuario hace click en: [🛒 AGREGAR AL CARRITO]

Sistema valida:
✓ Almacenamiento: 256GB ✓
✗ Color: NO SELECCIONADO ✗

Sistema muestra: ⚠️ ALERTA
"Por favor selecciona: Color"
```

**Paso 4:** Usuario selecciona color
```
Color:
[Negro] [Plata ← AQUÍ] [Oro] [Azul]

Usuario selecciona: Plata ✓
```

**Paso 5:** ✅ Ahora sí puede agregar
```
Todas las opciones completas:
✓ Almacenamiento: 256GB
✓ Color: Plata
✓ Cantidad: 1

Click en: [🛒 AGREGAR AL CARRITO]
✅ ÉXITO - Se agrega al carrito
```

---

## 🔄 CASO DE USO 4: Cliente Compra Mismo Producto con Diferentes Atributos

### Escenario: Comprar una camiseta en talla S y talla M

**Primer Intento:**
```
Producto: Camiseta Premium Algodón
Talla: S
Color: Negro
Cantidad: 1
Acción: AGREGAR AL CARRITO

CARRITO:
└─ Camiseta Premium - S, Negro x1 → S/ 89.00
```

**Segundo Intento (mismo producto, diferente atalla):**
```
Vuelve a abrir la misma camiseta
Selecciona:
  Talla: M
  Color: Azul
  Cantidad: 2
Acción: AGREGAR AL CARRITO

CARRITO:
├─ Camiseta Premium - S, Negro x1 → S/ 89.00
└─ Camiseta Premium - M, Azul x2 → S/ 178.00

TOTAL: S/ 267.00
```

**Sistema reconoce:**
- Son el mismo producto (ID: 101)
- Pero atributos diferentes
- ∴ Son LINE ITEMS separados en el carrito

---

## 🏠 CASO DE USO 5: Sofá con Múltiples Atributos

### Escenario: Cliente compra sofá personalizado

**Modal:**
```
SOFÁ MODERNO 3 CUERPOS
Precio: S/ 1,200

Color:
[Gris ← AQUÍ] [Negro] [Beige] [Azul marino]

Material:
[Tela ← AQUÍ] [Cuero sintético]

Total: S/ 1,200.00
(Precio igual para ambas combinaciones)

[🛒 AGREGAR AL CARRITO]
```

**Carrito:**
```
└─ Sofá Moderno 3 Cuerpos
   ├─ Color: Gris
   ├─ Material: Tela
   ├─ Cantidad: 1
   └─ Subtotal: S/ 1,200.00
```

---

## 💄 CASO DE USO 6: Maquillaje Según Tipo de Piel

### Escenario: Persona con piel grasosa compra set

**Modal:**
```
SET DE MAQUILLAJE PREMIUM
Precio: S/ 280

Tipo de piel:
[Piel sensible]
[Piel normal]
[Piel grasosa ← AQUÍ]
[Piel seca]

✓ Adaptado específicamente para piel grasosa
  Ingredients: Oil-control, Matte finish, Hypoallergenic

[🛒 AGREGAR AL CARRITO]
```

**Ventaja:**
- Cliente obtiene producto específico para su tipo de piel
- Menos probabilidad de devoluciones
- Mejor experiencia de compra

---

## 🎁 CASO DE USO 7: Flash Sale en Home Page

### Escenario: Cliente ve ofertas relámpago con atributos

**Home Page - Sección Flash Sale:**
```
🔥 OFERTAS RELÁMPAGO     Termina en: 23h 45m 30s

┌──────────────────┐  ┌──────────────────┐
│ ⚡ FLASH          │  │ ⚡ FLASH          │
│    -40%          │  │    -35%          │
│                  │  │                  │
│ [ZAPATILLAS]     │  │ [CONSOLA]        │
│                  │  │                  │
│ [Talla]          │  │ [Almac.]         │
│ [Color]          │  │ [Color]          │
│                  │  │                  │
│ S/ 350           │  │ S/ 2,500         │
│ Ahorras: S/ 233  │  │ Ahorras: S/ 500  │
│                  │  │                  │
│ Stock: 20/50     │  │ Stock: 8/50      │
│ ████████░░░░     │  │ ████░░░░░░░░     │
│                  │  │                  │
│ [🛒 COMPRAR AHORA]│  │ [🛒 COMPRAR AHORA]│
└──────────────────┘  └──────────────────┘
```

**Usuario interactúa:**
- Lee "Zapatillas - [Talla] [Color]"
- Sabe que tiene que seleccionar antes de comprar
- Click en tarjeta abre modal con selectores

---

## ⚙️ FLUJO DE DATOS COMPLETO

```
┌─────────────────────┐
│  Usuario navega     │
│  a catálogo        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Ve tarjetas con    │
│  badges de          │
│  "Opciones"         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Hace click para    │
│  ver detalles       │
│  (Modal abierto)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Selectores         │
│  dinámicos          │
│  aparecen           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Usuario            │
│  selecciona         │
│  atributos          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Sistema valida:    │
│  ¿Todos             │
│  seleccionados?     │
└────────┬────────┬───┘
         │        │
        NO       SÍ
         │        │
         ▼        ▼
      ⚠️ ALERTA  ✅ AGREGAR
      "Selecciona:"  CARRITO
         │           │
         │           ▼
         │      ┌──────────────┐
         │      │ Se guarda:   │
         │      │ • Producto   │
         │      │ • Atributos  │
         │      │ • Cantidad   │
         │      └──────────────┘
         │           │
         └───┬───────┘
             │
             ▼
        📦 CARRITO
        ACTUALIZADO
```

---

## 🚀 EXPANSIÓN FUTURA

### Cómo agregar nuevos atributos a un producto:

**Ejemplo: Agregar "Material" a la camiseta**

**Antes:**
```typescript
attributeSchema: [
  { name: 'Talla', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { name: 'Color', type: 'select', options: ['Blanco', 'Negro', 'Gris', 'Azul', 'Rojo'] }
]
```

**Después:**
```typescript
attributeSchema: [
  { name: 'Talla', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { name: 'Color', type: 'select', options: ['Blanco', 'Negro', 'Gris', 'Azul', 'Rojo'] },
  { name: 'Material', type: 'select', options: ['Algodón 100%', 'Poliéster', 'Mezcla'] }
]
```

**Nuevo selector en modal:**
```
Material:
[Algodón 100% ← AQUÍ] [Poliéster] [Mezcla]
```

✅ ¡Listo! Sistema es completamente escalable.

---

## 📊 Resumen de Ejemplos

| Caso | Producto | Atributos | Validación |
|------|----------|-----------|-----------|
| 1 | Zapatillas | Talla + Color | Obligatoria |
| 2 | Sudadera Infantil | Talla Infantil + Color | Obligatoria |
| 3 | Smartphone | Almac. + Color | Con Alerta |
| 4 | Múltiples Camisetas | Talla + Color | x2 items |
| 5 | Sofá | Color + Material | Obligatoria |
| 6 | Maquillaje | Tipo de piel | Obligatoria |
| 7 | Flash Sale | Variable | Dinámico |

---

**Versión:** 1.0  
**Ejemplos:** 7 casos de uso reales  
**Estado:** ✅ Todos funcionales  
**Servidor:** 🟢 Activo
