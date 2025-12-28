# FLABEF E-Commerce - Guía de Administración

## 🔐 Acceso de Administrador

### Código de Acceso
- **Código Secret:** `admin-secret-2024`
- **Ubicación:** Ícono de candado en la esquina superior derecha del navbar

### Pasos para Acceder
1. Haz clic en el ícono de candado (🔒) en el navbar
2. Se abrirá un modal pidiendo el código
3. Ingresa: `admin-secret-2024`
4. Presiona "Acceder" o Enter
5. Serás redirigido al panel de administración

## 📋 Panel de Administración

El panel tiene 3 pestañas principales:

### 1. Configuración General
Aquí puedes editar:
- **Nombre de la Tienda:** El nombre que aparece en todo el sitio
- **Número de WhatsApp:** El número a donde se enviarán los pedidos
  - Formato: Con código de país (ej: 51912345678 para Perú)
- **Descripción de la Tienda:** Texto descriptivo de tu negocio

### 2. Diseño (Personalización de Colores)
Edita los colores de:
- **Navbar:** Color del encabezado/menú superior
- **Footer:** Color del pie de página
- **Color Primario:** Color de botones, links y elementos destacados

- Usa el selector de color interactivo o ingresa códigos hexadecimales
- Verás una vista previa en tiempo real

### 3. Métodos de Pago
Administra los 4 métodos de pago disponibles:

#### Yape (💳)
- Habilitar/Deshabilitar
- Ingresa tu número de teléfono asociado a Yape

#### Plin (📱)
- Habilitar/Deshabilitar
- Ingresa tu número de teléfono asociado a Plin

#### Pago en Efectivo (💵)
- Habilitar/Deshabilitar
- Se coordinará con el cliente por WhatsApp

#### Transferencia Bancaria (🏦)
- Habilitar/Deshabilitar
- Ingresa tu número de cuenta bancaria

## 🛒 Flujo de Compra del Cliente

1. Cliente navega por el catálogo
2. Agrega productos al carrito
3. Va al checkout
4. Completa sus datos:
   - Nombre completo
   - Email
   - Teléfono
   - Dirección y ciudad
5. **Selecciona un método de pago**
6. Presiona "Comprar por WhatsApp"
7. Se abre automáticamente WhatsApp con:
   - Detalles del cliente
   - Lista de productos
   - Total de la compra
   - **Método de pago seleccionado**
8. El cliente confirma el pedido por WhatsApp

## 📱 Cambios en el Navbar

### Antes
- Botón de "Iniciar Sesión / Registrarse"
- Menú con datos del usuario

### Ahora
- ❌ Sin opción de login/signup en el navbar
- 🔒 Ícono de candado para acceso admin
- 🛒 Carrito de compras (siempre visible)
- 📂 Menú de categorías

## 📄 Footer

Se ha agregado un footer completo a todas las páginas con:
- Información de la tienda
- Enlaces de navegación
- Redes sociales
- Información de contacto
- Derechos de autor

El footer aparece en:
- Página de inicio
- Catálogo de productos
- Carrito
- Checkout

## 🔄 Edición de Página Completa

Para editar toda la página desde arriba hasta abajo:

1. **Navbar:** Usa el panel admin (colores)
2. **Contenido Principal:** Modifica directamente en el código
3. **Footer:** Usa el panel admin (colores) o edita el archivo `Footer.tsx`

## 📁 Ubicaciones de Archivos Importantes

- **Navbar:** `client/src/components/layout/Navbar.tsx`
- **Footer:** `client/src/components/layout/Footer.tsx`
- **Panel Admin:** `client/src/pages/admin/AdminPanel.tsx`
- **Checkout:** `client/src/pages/store/Checkout.tsx`
- **Schema de Base de Datos:** `shared/schema.ts`

## ⚠️ Notas Importantes

1. El sistema actualmente usa almacenamiento en sesión para la autenticación de admin
2. El número de WhatsApp es el que recibirá todos los pedidos
3. Los colores se guardan en el estado del componente (para implementación completa, necesitarás conectar a una base de datos)
4. Los métodos de pago están habilitados por defecto

## 🚀 Próximos Pasos Recomendados

Para una implementación completa:
1. Conectar el panel admin a una base de datos real
2. Guardar la configuración de forma persistente
3. Agregar validación más robusta
4. Implementar almacenamiento de órdenes en base de datos
5. Crear un sistema de notificaciones por email
