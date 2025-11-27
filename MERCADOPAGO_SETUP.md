# Integración con MercadoPago - Guía de Configuración

## Estado Actual
✅ Service frontend creado (`mercadoPagoService.js`)
⏳ Pendiente: Credenciales de sandbox y endpoints backend

## Pasos para Completar la Integración

### 1. Obtener Credenciales de MercadoPago

Una vez que tu identidad sea validada en MercadoPago:

1. Ir a [https://www.mercadopago.com/developers](https://www.mercadopago.com/developers)
2. Navegar a "Tus integraciones" > "Credenciales"
3. Obtener las credenciales de **Sandbox** (para pruebas):
   - **Public Key**: `TEST-xxxxx`
   - **Access Token**: `TEST-xxxxx`

### 2. Configurar Backend

Crear archivo `backend_aerolinea/.env` (si no existe) y agregar:

```env
# MercadoPago Credentials (Sandbox)
MERCADOPAGO_ACCESS_TOKEN=TEST-tu-access-token-aqui
MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-aqui

# URLs de retorno
MERCADOPAGO_SUCCESS_URL=http://localhost:3000/payment/success
MERCADOPAGO_FAILURE_URL=http://localhost:3000/payment/failure
MERCADOPAGO_PENDING_URL=http://localhost:3000/payment/pending
MERCADOPAGO_NOTIFICATION_URL=http://localhost:3001/api/v1/pagos/webhook
```

### 3. Instalar SDK de MercadoPago en Backend

```bash
cd backend_aerolinea
npm install mercadopago
```

### 4. Crear Service en Backend

Crear archivo: `backend_aerolinea/src/services/mercadopagoService.js`

```javascript
import mercadopago from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

// Configurar MercadoPago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

export class MercadoPagoService {
  
  /**
   * Crear preferencia de pago
   */
  static async crearPreferencia(reservaId, monto, descripcion, payerInfo) {
    try {
      const preference = {
        items: [
          {
            title: descripcion,
            unit_price: Number(monto),
            quantity: 1,
          }
        ],
        payer: {
          name: payerInfo.nombre,
          surname: payerInfo.apellido,
          email: payerInfo.email,
          phone: {
            number: payerInfo.telefono
          },
          identification: {
            type: 'DNI',
            number: payerInfo.dni
          }
        },
        external_reference: String(reservaId),
        back_urls: {
          success: process.env.MERCADOPAGO_SUCCESS_URL,
          failure: process.env.MERCADOPAGO_FAILURE_URL,
          pending: process.env.MERCADOPAGO_PENDING_URL
        },
        auto_return: 'approved',
        notification_url: process.env.MERCADOPAGO_NOTIFICATION_URL,
        statement_descriptor: 'AERO PENGUIN',
        payment_methods: {
          installments: 12
        }
      };

      const response = await mercadopago.preferences.create(preference);
      return {
        preferenceId: response.body.id,
        initPoint: response.body.init_point,
        sandboxInitPoint: response.body.sandbox_init_point
      };
    } catch (error) {
      console.error('Error creando preferencia:', error);
      throw new Error('Error al crear preferencia de pago');
    }
  }

  /**
   * Verificar estado de un pago
   */
  static async verificarPago(paymentId) {
    try {
      const payment = await mercadopago.payment.findById(paymentId);
      return {
        id: payment.body.id,
        status: payment.body.status,
        status_detail: payment.body.status_detail,
        transaction_amount: payment.body.transaction_amount,
        external_reference: payment.body.external_reference
      };
    } catch (error) {
      console.error('Error verificando pago:', error);
      throw new Error('Error al verificar pago');
    }
  }

  /**
   * Procesar webhook de notificación
   */
  static async procesarWebhook(data) {
    try {
      if (data.type === 'payment') {
        const payment = await this.verificarPago(data.data.id);
        
        if (payment.status === 'approved') {
          // Actualizar reserva a PAGADA
          const reservaId = payment.external_reference;
          return {
            success: true,
            reservaId: reservaId,
            paymentId: payment.id
          };
        }
      }
      
      return { success: false };
    } catch (error) {
      console.error('Error procesando webhook:', error);
      throw error;
    }
  }
}
```

### 5. Crear Routes en Backend

Crear archivo: `backend_aerolinea/src/routes/mercadopagoRoutes.js`

```javascript
import { Router } from 'express';
import { MercadoPagoController } from '../controllers/mercadopagoController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Crear preferencia de pago
router.post('/crear-preferencia', authMiddleware, MercadoPagoController.crearPreferencia);

// Verificar pago
router.get('/verificar/:paymentId', authMiddleware, MercadoPagoController.verificarPago);

// Webhook para notificaciones de MercadoPago
router.post('/webhook', MercadoPagoController.webhook);

// Obtener preferencia
router.get('/preferencia/:preferenceId', authMiddleware, MercadoPagoController.obtenerPreferencia);

export default router;
```

### 6. Crear Controller en Backend

Crear archivo: `backend_aerolinea/src/controllers/mercadopagoController.js`

```javascript
import { MercadoPagoService } from '../services/mercadopagoService.js';
import { ReservaService } from '../services/reservaService.js';

export class MercadoPagoController {
  
  static async crearPreferencia(req, res) {
    try {
      const { reservaId, payerInfo } = req.body;
      
      // Obtener reserva
      const reserva = await ReservaService.getById(reservaId);
      
      if (!reserva) {
        return res.status(404).json({
          success: false,
          message: 'Reserva no encontrada'
        });
      }

      if (reserva.estado_reserva === 'PAGADA') {
        return res.status(400).json({
          success: false,
          message: 'Esta reserva ya está pagada'
        });
      }

      const descripcion = `Reserva ${reserva.codigo_reserva} - ${reserva.cantidad_viajeros} pasajero(s)`;
      
      const resultado = await MercadoPagoService.crearPreferencia(
        reservaId,
        reserva.precio_total,
        descripcion,
        payerInfo
      );

      res.status(200).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error en crearPreferencia:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async verificarPago(req, res) {
    try {
      const { paymentId } = req.params;
      const resultado = await MercadoPagoService.verificarPago(paymentId);

      res.status(200).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error en verificarPago:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async webhook(req, res) {
    try {
      const resultado = await MercadoPagoService.procesarWebhook(req.body);
      
      if (resultado.success) {
        // Actualizar reserva a PAGADA
        await ReservaService.procesarPago(resultado.reservaId);
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('Error en webhook:', error);
      res.status(500).send('Error');
    }
  }

  static async obtenerPreferencia(req, res) {
    try {
      const { preferenceId } = req.params;
      // Implementar si es necesario
      res.status(200).json({
        success: true,
        data: { preferenceId }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}
```

### 7. Registrar Rutas en app.js

En `backend_aerolinea/src/app.js`, agregar:

```javascript
import mercadopagoRoutes from './routes/mercadopagoRoutes.js';

// ... otras rutas ...
app.use('/api/v1/pagos/mercadopago', mercadopagoRoutes);
```

### 8. Crear Páginas de Retorno en Frontend

Crear tres páginas en `frontend_aereolinea/src/app/payment/`:

- `success/page.js` - Pago exitoso
- `failure/page.js` - Pago rechazado
- `pending/page.js` - Pago pendiente

### 9. Integrar en Página de Reservas

En la página donde el usuario paga, usar el service:

```javascript
import { mercadoPagoService } from '../../services/mercadoPagoService';

const handlePagar = async () => {
  try {
    const paymentData = {
      reservaId: reserva.id_reserva,
      monto: reserva.precio_total,
      descripcion: `Reserva ${reserva.codigo_reserva}`,
      payer: {
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        dni: user.dni
      }
    };

    const response = await mercadoPagoService.crearPreferencia(paymentData);
    
    // Redirigir a MercadoPago
    mercadoPagoService.redirigirACheckout(response.data.sandboxInitPoint);
  } catch (error) {
    console.error('Error:', error);
    showError('Error al iniciar el pago');
  }
};
```

## URLs de Prueba (Sandbox)

- Tarjetas de prueba: [https://www.mercadopago.com/developers/es/docs/testing/test-cards](https://www.mercadopago.com/developers/es/docs/testing/test-cards)

### Tarjetas de Prueba Comunes:

**Aprobada:**
- Número: `5031 7557 3453 0604`
- CVV: `123`
- Fecha: `11/25`

**Rechazada:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Fecha: `11/25`

**Pendiente:**
- Número: `5031 3530 5624 0375`
- CVV: `123`
- Fecha: `11/25`

## Notas Importantes

1. **Sandbox vs Producción**: Cambiar credenciales cuando pases a producción
2. **Webhook**: Configurar URL pública para recibir notificaciones (usar ngrok para desarrollo)
3. **Seguridad**: Nunca exponer el Access Token en el frontend
4. **Testing**: Probar todos los escenarios (aprobado, rechazado, pendiente)

## Checklist de Implementación

- [ ] Obtener credenciales de sandbox
- [ ] Configurar variables de entorno
- [ ] Instalar SDK de MercadoPago
- [ ] Crear service backend
- [ ] Crear controller backend
- [ ] Crear routes backend
- [ ] Registrar routes en app.js
- [ ] Crear páginas de retorno
- [ ] Integrar en flujo de pago
- [ ] Probar con tarjetas de prueba
- [ ] Configurar webhook (ngrok)
- [ ] Validar todos los flujos
