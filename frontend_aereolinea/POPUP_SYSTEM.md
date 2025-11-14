# Sistema de Popups Personalizados

Este proyecto utiliza un sistema de popups personalizados en lugar de las alertas nativas de JavaScript (`alert`, `confirm`, `prompt`) para proporcionar una mejor experiencia de usuario.

## Componentes

### CustomPopup
Componente de popup reutilizable ubicado en `src/app/components/CustomPopup.js`.

**Características:**
- Diseño moderno y responsivo
- Soporte para múltiples tipos (success, error, warning, info, confirm)
- Animaciones suaves
- Bloqueo del scroll del body cuando está activo
- Cierre al hacer clic fuera del popup

### usePopup Hook
Hook personalizado ubicado en `src/app/hooks/usePopup.js` que simplifica el uso de popups.

## Uso

### 1. Importar el hook y el componente

```javascript
import CustomPopup from './components/CustomPopup';
import usePopup from './hooks/usePopup';
```

### 2. Inicializar el hook en tu componente

```javascript
export default function MyComponent() {
  const { popupState, showAlert, showSuccess, showError, showWarning, showConfirm, closePopup } = usePopup();
  
  // ... resto del código
}
```

### 3. Agregar el componente CustomPopup al JSX

```javascript
return (
  <div>
    {/* Tu contenido */}
    
    <CustomPopup
      isOpen={popupState.isOpen}
      onClose={closePopup}
      title={popupState.title}
      message={popupState.message}
      type={popupState.type}
      onConfirm={popupState.onConfirm}
      confirmText={popupState.confirmText}
      cancelText={popupState.cancelText}
    />
  </div>
);
```

## Métodos Disponibles

### showAlert(message, type, title)
Muestra un popup de alerta simple.

```javascript
showAlert('Operación completada', 'info', 'Información');
```

### showSuccess(message, title)
Muestra un popup de éxito.

```javascript
showSuccess('Usuario creado exitosamente', '¡Éxito!');
```

### showError(message, title)
Muestra un popup de error.

```javascript
showError('No se pudo conectar al servidor', 'Error');
```

### showWarning(message, title)
Muestra un popup de advertencia.

```javascript
showWarning('Por favor completa todos los campos', 'Advertencia');
```

### showConfirm(message, onConfirm, title, confirmText, cancelText)
Muestra un popup de confirmación con botones de acción.

```javascript
showConfirm(
  '¿Estás seguro de eliminar este elemento?',
  () => {
    // Código a ejecutar si el usuario confirma
    deleteItem();
  },
  'Confirmar Eliminación',
  'Sí, eliminar',
  'Cancelar'
);
```

## Tipos de Popup

- **success**: Muestra un icono verde de check ✓
- **error**: Muestra un icono rojo de X
- **warning**: Muestra un icono amarillo de advertencia ⚠
- **info**: Muestra un icono azul de información ℹ
- **confirm**: Muestra un icono azul de pregunta con botones de acción

## Ejemplos Prácticos

### Ejemplo 1: Validación de formulario
```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!formData.email) {
    showWarning('Por favor ingresa tu correo electrónico');
    return;
  }
  
  // Procesar formulario
};
```

### Ejemplo 2: Operación exitosa
```javascript
const createUser = async () => {
  try {
    await api.createUser(userData);
    showSuccess('Usuario creado correctamente');
    router.push('/users');
  } catch (error) {
    showError('Error al crear usuario: ' + error.message);
  }
};
```

### Ejemplo 3: Confirmación de eliminación
```javascript
const handleDelete = (itemId) => {
  showConfirm(
    '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.',
    async () => {
      try {
        await api.deleteItem(itemId);
        showSuccess('Elemento eliminado exitosamente');
        loadItems();
      } catch (error) {
        showError('Error al eliminar: ' + error.message);
      }
    },
    'Confirmar Eliminación',
    'Sí, eliminar',
    'Cancelar'
  );
};
```

## Estilos

Los estilos del popup están completamente integrados con Tailwind CSS y son responsivos. Las animaciones están definidas en `globals.css`:

- Animación de entrada suave
- Backdrop con blur
- Diseño centrado y responsivo
- Colores adaptados al tipo de mensaje

## Buenas Prácticas

1. **Títulos descriptivos**: Usa títulos claros que indiquen el tipo de acción o información.
2. **Mensajes concisos**: Mantén los mensajes cortos y directos.
3. **Confirmaciones para acciones destructivas**: Siempre usa `showConfirm` para operaciones que no se pueden deshacer.
4. **Feedback inmediato**: Muestra popups de éxito o error inmediatamente después de operaciones importantes.
5. **Redirecciones con delay**: Al mostrar un popup de éxito antes de redirigir, usa un pequeño delay para que el usuario pueda leer el mensaje.

```javascript
showSuccess('¡Inicio de sesión exitoso!');
setTimeout(() => {
  router.push('/dashboard');
}, 1500);
```

## Archivos Modificados

Los siguientes archivos han sido actualizados para usar el nuevo sistema de popups:

- `src/app/page.js` - Página principal
- `src/app/login/page.js` - Inicio de sesión
- `src/app/login/reset/page.js` - Restablecer contraseña
- `src/app/admin/flights/page.js` - Gestión de vuelos
- `src/app/admin/routes/page.js` - Gestión de rutas
- `src/app/root/dashboard/page.js` - Dashboard de root
- `src/app/components/AdminCard.js` - Tarjeta de administrador
- `src/app/components/RootProtectedRoute.js` - Ruta protegida de root

## Migración desde alertas nativas

Si encuentras código antiguo con alertas nativas:

**Antes:**
```javascript
alert('Mensaje de error');
```

**Después:**
```javascript
showError('Mensaje de error');
```

**Antes:**
```javascript
if (confirm('¿Estás seguro?')) {
  deleteItem();
}
```

**Después:**
```javascript
showConfirm('¿Estás seguro?', () => {
  deleteItem();
});
```

## Soporte

Para cualquier duda o mejora del sistema de popups, revisa los componentes en:
- `src/app/components/CustomPopup.js`
- `src/app/hooks/usePopup.js`
