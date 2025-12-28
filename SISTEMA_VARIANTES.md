# Sistema de Variantes/Atributos por Categoría - FLABEF E-COMMERCE

## 📋 Descripción General

Se ha implementado un sistema completo y flexible de variantes de productos que permite asignar atributos específicos según la categoría del producto. Cada producto puede tener múltiples variantes con diferentes combinaciones de atributos.

---

## 🏗️ Estructura Técnica

### 1. **Interfaz ProductVariant**
```typescript
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>; // ej: { size: 'M', color: 'Rojo' }
}
```

### 2. **Interfaz Product Extendida**
```typescript
export interface Product {
  // ... campos existentes ...
  variants?: ProductVariant[]; // Variantes específicas del producto
  attributeSchema?: {
    name: string;
    type: 'select' | 'multiselect';
    options: string[];
  }[];
}
```

### 3. **Interfaz CartItem Actualizada**
```typescript
export interface CartItem extends Product {
  quantity: number;
  selectedAttributes?: Record<string, string>; // Atributos seleccionados para este item
}
```

---

## 👕 Categorías y Atributos Específicos

### **1. MODA (Categoría ID: '1')**
- **Atributos Obligatorios:**
  - **Talla:** XS, S, M, L, XL, XXL
  - **Color:** Blanco, Negro, Gris, Azul, Rojo (y más según diseño)

**Ejemplos de Productos:**
- Camiseta Premium Algodón (ID: '101')
  - Variantes: XS-Blanco, S-Blanco, M-Negro, L-Azul
- Vestido de Verano Floral (ID: '109')
  - Variantes: S-Floral Rojo, M-Floral Multicolor, L-Floral Azul

---

### **2. NIÑOS Y BEBÉS (Categoría ID: '12')**
- **Atributos Obligatorios:**
  - **Talla:** 2-3 años, 4-5 años, 6-7 años, 8-9 años, 10-12 años
  - **Color:** Azul, Rosa, Verde, Naranja, Morado

**Ejemplo de Producto:**
- Sudadera Infantil Cómoda (ID: '105')
  - Variantes: 4-5 años-Azul, 6-7 años-Rosa, 8-9 años-Verde

---

### **3. DEPORTES - CALZADO (Categoría ID: '11')**
- **Atributos Obligatorios:**
  - **Talla:** 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46
  - **Color:** Negro/Rojo, Blanco/Azul, Gris/Naranja, Blanco/Negro, Multicolor

**Nota:** Los colores pueden ser mixtos (combinaciones) para zapatillas deportivas

**Ejemplo de Producto:**
- Zapatillas Running Elite (ID: '104')
  - Variantes: Talla 38-Negro/Rojo, Talla 40-Blanco/Azul, Talla 42-Multicolor

---

### **4. TECNOLOGÍA (Categoría ID: '2' y '3')**
- **Smartphone Pro Max (ID: '102'):**
  - **Almacenamiento:** 128GB, 256GB, 512GB, 1TB
  - **Color:** Negro, Plata, Oro, Azul
  
- **Laptop Developer Edition (ID: '103'):**
  - **Procesador:** Intel i7, Intel i9, AMD Ryzen 7, AMD Ryzen 9
  - **Color:** Plateado, Gris espacial, Negro

- **Consola Next-Gen (ID: '107'):**
  - **Almacenamiento:** 500GB, 1TB, 2TB
  - **Color:** Blanco, Negro, Rojo

---

### **5. HOGAR Y DECORACIÓN (Categoría ID: '7')**
- **Sofá Moderno 3 Cuerpos (ID: '106'):**
  - **Color:** Gris, Negro, Beige, Azul marino
  - **Material:** Tela, Cuero sintético

---

### **6. SALUD Y BELLEZA (Categoría ID: '8')**
- **Set de Maquillaje Premium (ID: '108'):**
  - **Tipo de piel:** Piel sensible, Piel normal, Piel grasosa, Piel seca

---

## 🎨 Interfaz de Usuario

### **Modal de Producto (ProductPreviewModal)**

#### Ubicación: `client/src/components/ProductPreviewModal.tsx`

Características:
1. **Selectores de Atributos Dinámicos**
   - Se muestran solo para productos con `attributeSchema` definido
   - Botones interactivos para seleccionar cada opción
   - Validación: No permite agregar al carrito sin seleccionar todos los atributos obligatorios

2. **Visualización Clara**
   - Nombre del atributo (ej: "Talla", "Color")
   - Botones con estado visual
   - Seleccionado: `border-lime-500 bg-lime-100`
   - No seleccionado: `border-gray-300 bg-white`

---

### **Catálogo (Catalog.tsx)**

#### Ubicación: `client/src/pages/store/Catalog.tsx`

Características:
1. **Badges de Atributos**
   - Muestra "Opciones:" seguido de los atributos disponibles
   - Se muestran en gris para no saturar el diseño
   - Ej: `Talla` | `Color`

---

### **Home Page (Home.tsx)**

#### Ubicación: `client/src/pages/Home.tsx`

Características:
1. **Indicadores en Flash Sales**
   - Muestra los 2 primeros atributos del producto
   - Badges rojos para mantener el tema de flash sale
   - Ej: `Talla` | `Color`

---

## 💾 Estructura de Datos de Ejemplo

```typescript
// Producto con Variantes
{
  id: '104',
  name: 'Zapatillas Running Elite',
  description: 'Máxima comodidad para correr con amortiguación premium',
  price: 350,
  categoryId: '11',
  stock: 20,
  originalPrice: 500,
  attributeSchema: [
    {
      name: 'Talla',
      type: 'select',
      options: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']
    },
    {
      name: 'Color',
      type: 'select',
      options: ['Negro/Rojo', 'Blanco/Azul', 'Gris/Naranja', 'Blanco/Negro', 'Multicolor']
    }
  ],
  variants: [
    {
      id: 'v10',
      name: 'Talla 38 - Negro/Rojo',
      price: 350,
      stock: 3,
      attributes: { talla: '38', color: 'Negro/Rojo' }
    },
    {
      id: 'v11',
      name: 'Talla 40 - Blanco/Azul',
      price: 350,
      stock: 5,
      attributes: { talla: '40', color: 'Blanco/Azul' }
    }
  ]
}
```

---

## ✅ Validaciones Implementadas

1. **Modal de Producto:**
   - Validación obligatoria de atributos antes de agregar al carrito
   - Mensaje de alerta si falta seleccionar atributos
   - No permite proceder sin completar

2. **Carrito:**
   - Almacena `selectedAttributes` de cada item
   - Permite diferencia entre items iguales con diferentes atributos

---

## 🔧 Cómo Agregar Nuevos Atributos

### Para un Producto Existente:

1. **Actualizar `mock-store.ts`:**
```typescript
{
  id: 'nuevo-id',
  name: 'Nombre del Producto',
  // ... otros campos ...
  attributeSchema: [
    {
      name: 'Nombre del Atributo',
      type: 'select',
      options: ['Opción 1', 'Opción 2', 'Opción 3']
    }
  ],
  variants: [
    {
      id: 'v-id',
      name: 'Opción 1',
      price: 100,
      stock: 10,
      attributes: { nombre: 'Opción 1' }
    }
  ]
}
```

---

## 📊 Categorías Disponibles

| ID | Nombre | Slug | Atributos |
|----|--------|------|-----------|
| 1 | Moda | moda | Talla, Color |
| 2 | Tecnología | tecnologia | Varía por producto |
| 3 | Celulares y Accesorios | celulares | Almacenamiento, Color |
| 4 | Electrohogar | electrohogar | - |
| 5 | Comidas | comidas | - |
| 6 | Servicios IT | servicios-it | - |
| 7 | Hogar y Decoración | hogar | Color, Material |
| 8 | Salud y Belleza | salud | Tipo de piel |
| 9 | Mascotas | mascotas | - |
| 10 | Videojuegos | videojuegos | Almacenamiento, Color |
| 11 | Deportes | deportes | Talla, Color |
| 12 | Niños y Bebés | ninos | Talla (infantil), Color |

---

## 🎯 Beneficios del Sistema

✅ **Flexible:** Cada producto puede tener sus propios atributos
✅ **Escalable:** Fácil de agregar nuevos atributos
✅ **Intuitivo:** UI clara para el usuario
✅ **Validado:** Previene errores de selección
✅ **Persistente:** Se guarda en localStorage mediante Zustand
✅ **Detallista:** Especificar exactamente lo que el usuario compra

---

## 🚀 Próximos Pasos Sugeridos

1. **Admin Panel:** Implementar CRUD para crear/editar variantes desde la interfaz
2. **Carrito Avanzado:** Mostrar atributos seleccionados en resumen de carrito
3. **Stock por Variante:** Controlar stock individual por combinación de atributos
4. **Búsqueda Filtrada:** Filtrar por atributos específicos (ej: "Todas las zapatillas talla 40")
5. **Historial:** Guardar atributos en órdenes completadas

---

**Versión:** 1.0  
**Última Actualización:** 8 de diciembre de 2025
