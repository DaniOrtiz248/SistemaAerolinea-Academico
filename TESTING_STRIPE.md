# 🧪 Guía Rápida de Prueba - Stripe

## ✅ Prueba en 5 Minutos

### 1️⃣ Iniciar el Servidor
```bash
cd frontend_aereolinea
npm run dev
```

### 2️⃣ Crear una Reserva
1. Ve a http://localhost:3000
2. Busca un vuelo
3. **Importante**: Click en "Reservar" (NO en "Comprar")
4. Llena datos de pasajeros
5. Completa la reserva

### 3️⃣ Ir a Reservas Activas
1. Ve a "Mi Cuenta" → "Reservas Activas"
2. Verás tu reserva con estado "PENDIENTE PAGO"
3. Verás un botón verde: **"💳 Pagar con Stripe"**

### 4️⃣ Procesar el Pago
1. Click en "💳 Pagar con Stripe"
2. Te redirigirá a la pasarela de Stripe (oficial)
3. Llenar datos:
   ```
   Tarjeta: 4242 4242 4242 4242
   MM/YY:   12/34
   CVC:     123
   Nombre:  Tu nombre
   Email:   tu@email.com
   ```
4. Click en "Pay"

### 5️⃣ ¡Pago Exitoso! 🎉
- Verás pantalla de éxito
- Número de correos enviados
- Código de reserva
- Monto pagado

### 6️⃣ Verificar en Stripe
1. Abre: https://dashboard.stripe.com/test/payments
2. Verás el pago registrado
3. Click para ver detalles (metadata incluye ID de reserva)

---

## 🎯 Escenarios de Prueba

### ✅ Pago Exitoso
**Tarjeta**: `4242 4242 4242 4242`
**Resultado**: Pago aprobado, reserva marcada como PAGADA, correos enviados

### ❌ Pago Rechazado (Fondos Insuficientes)
**Tarjeta**: `4000 0000 0000 9995`
**Resultado**: Stripe muestra error "Tu tarjeta no tiene fondos suficientes"

### 🔐 Requiere Autenticación 3D Secure
**Tarjeta**: `4000 0027 6000 3184`
**Resultado**: Stripe solicita verificación adicional (popup de autenticación)

### ⛔ Tarjeta Declinada (Perdida)
**Tarjeta**: `4000 0000 0000 9987`
**Resultado**: Stripe rechaza con mensaje "Tu tarjeta fue reportada como perdida"

### ↩️ Usuario Cancela el Pago
1. En Stripe Checkout, click en la "X" (cerrar)
2. Redirige a `/payment/cancel`
3. Reserva permanece ACTIVA
4. Puede intentar pagar nuevamente

---

## 📱 Qué Esperar en Cada Pantalla

### Pantalla: Reservas Activas
```
┌─────────────────────────────────────┐
│ 🎫 Mis Reservas Activas             │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Reserva #RES-20251127-00001     │ │
│ │ PENDIENTE PAGO                  │ │
│ │                                 │ │
│ │ Total: $500                     │ │
│ │                                 │ │
│ │ [💳 Pagar con Stripe]           │ │
│ │ [❌ Cancelar Reserva]           │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Stripe Checkout (Hosted Page)
```
┌─────────────────────────────────────┐
│          Stripe Checkout            │
│                                     │
│ Pay Sistema Aerolinea              │
│ $500.00 USD                        │
│                                     │
│ Card information                    │
│ ┌─────────────────────────────────┐ │
│ │ 4242 4242 4242 4242            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────┐ ┌───┐                      │
│ │12/34│ │123│                      │
│ └─────┘ └───┘                      │
│                                     │
│ Name on card                        │
│ ┌─────────────────────────────────┐ │
│ │ Daniel Test                     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Email                               │
│ ┌─────────────────────────────────┐ │
│ │ test@example.com                │ │
│ └─────────────────────────────────┘ │
│                                     │
│        [Pay]                        │
└─────────────────────────────────────┘
```

### Pantalla: Pago Exitoso
```
┌─────────────────────────────────────┐
│         ✅ ¡Pago Exitoso! 🎉        │
│                                     │
│ Tu reserva ha sido confirmada       │
│                                     │
│ Código: #RES-20251127-00001         │
│ Monto: $500.00 USD                  │
│                                     │
│ ℹ️ Se enviaron 2 correos            │
│                                     │
│ [Ver Historial] [Buscar Vuelos]    │
└─────────────────────────────────────┘
```

---

## 🐛 Solución de Problemas

### Error: "Stripe is not defined"
**Solución**: Verifica que `.env.local` existe con las claves

### Error: "Cannot create session"
**Solución**: 
1. Verifica que el backend esté corriendo
2. Revisa la consola del navegador (F12)
3. Verifica las claves en `.env.local`

### No redirige a Stripe
**Solución**: 
1. Abre consola del navegador (F12)
2. Ve a Network tab
3. Busca la llamada a `/api/create-checkout-session`
4. Revisa la respuesta

### Pago exitoso pero no se envían correos
**Solución**: 
1. Verifica que el backend tenga configurado nodemailer
2. Revisa los logs del backend
3. Verifica que `reservationService.procesarPago()` funcione

---

## 📊 Dashboard de Stripe

### Qué Ver:
1. **Payments**: Todos los pagos de prueba
2. **Customers**: Emails de los clientes
3. **Products**: (Vacío, usamos price_data dinámico)
4. **Logs**: Todas las llamadas API

### Metadata en el Pago:
- `reserva_id`: ID de la reserva en tu DB
- `codigo_reserva`: Código legible (ej: RES-20251127-00001)
- `cantidad_viajeros`: Número de pasajeros

---

## 🎓 Tips Adicionales

1. **Usa múltiples ventanas**: Una con tu app, otra con Stripe Dashboard
2. **Modo incógnito**: Para probar como usuario nuevo
3. **Console logs**: Revisa la consola para ver el flujo completo
4. **Network tab**: Ver las llamadas API en tiempo real

---

✨ **¡Listo para probar!** Cualquier duda, revisa `STRIPE_INTEGRATION.md` para más detalles técnicos.
