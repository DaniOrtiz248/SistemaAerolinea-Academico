# 💳 Tarjetas de Prueba de Stripe - Referencia Rápida

## ✅ Pago Exitoso

### Tarjeta Principal (Usar Esta)
```
Número:  4242 4242 4242 4242
Fecha:   12/34
CVC:     123
ZIP:     12345
```

### Tarjetas Alternativas (También Funcionan)
```
Visa:              4242 4242 4242 4242
Visa (debit):      4000 0566 5566 5556
Mastercard:        5555 5555 5555 4444
Mastercard (debit): 5200 8282 8282 8210
American Express:   3782 822463 10005
Discover:          6011 1111 1111 1117
Diners Club:       3056 9300 0902 0004
JCB:               3566 0020 2036 0505
```

---

## ❌ Errores de Pago

### Fondos Insuficientes
```
4000 0000 0000 9995
```
**Mensaje**: "Your card has insufficient funds"

### Tarjeta Declinada (Genérico)
```
4000 0000 0000 0002
```
**Mensaje**: "Your card was declined"

### Tarjeta Perdida
```
4000 0000 0000 9987
```
**Mensaje**: "Your card has been reported as lost"

### Tarjeta Robada
```
4000 0000 0000 9979
```
**Mensaje**: "Your card has been reported as stolen"

### Error de Procesamiento
```
4000 0000 0000 0119
```
**Mensaje**: "An error occurred while processing your card"

### CVC Incorrecto
```
4000 0000 0000 0127
```
**Mensaje**: "Your card's security code is incorrect"

### Tarjeta Vencida
```
4000 0000 0000 0069
```
**Mensaje**: "Your card has expired"

---

## 🔐 Autenticación 3D Secure

### Requiere Autenticación (Exitosa)
```
4000 0027 6000 3184
```
**Comportamiento**: Muestra popup de autenticación, luego aprueba

### Requiere Autenticación (Fallida)
```
4000 0000 0000 3220
```
**Comportamiento**: Muestra popup de autenticación, luego rechaza

---

## 💡 Tips de Uso

### Para CUALQUIER Tarjeta de Prueba:
- **Fecha de Expiración**: Cualquier fecha futura (ej: 12/34, 01/30)
- **CVC**: Cualquier 3 dígitos (ej: 123, 456, 789)
- **Código Postal**: Cualquier código (ej: 12345, 10001)
- **Nombre**: Cualquier nombre

### Comportamiento Esperado:
✅ Stripe NO valida el nombre en test mode
✅ Stripe NO valida el código postal en test mode
✅ La fecha solo debe ser futura
✅ El CVC puede ser cualquier número de 3 dígitos

---

## 📋 Testing Checklist

Prueba estos escenarios:

- [ ] Pago exitoso con `4242 4242 4242 4242`
- [ ] Pago declinado con `4000 0000 0000 0002`
- [ ] Fondos insuficientes con `4000 0000 0000 9995`
- [ ] Autenticación 3D Secure con `4000 0027 6000 3184`
- [ ] Usuario cancela el pago (click en X)
- [ ] Verificar pago en Stripe Dashboard
- [ ] Verificar que se envían correos
- [ ] Verificar que reserva cambia a PAGADA

---

## 🌐 Más Tarjetas

Stripe tiene MUCHAS más tarjetas de prueba. Ver:
https://stripe.com/docs/testing#cards

### Tarjetas por País:
- Argentina: `4000 0000 4000 0008`
- Brasil: `4000 0076 4000 0002`
- México: `4000 0484 0000 0002`
- Colombia: `4000 0170 0000 0007`

### Tarjetas por Método:
- Apple Pay: Usar Safari en iOS/macOS
- Google Pay: Usar Chrome
- Link: test@stripe.com

---

## 🚨 Recuerda

⚠️ **NUNCA uses tarjetas reales en test mode**
⚠️ **NUNCA uses estas tarjetas en producción**
✅ **Solo funcionan con tu cuenta de Stripe en test mode**
✅ **No se procesa dinero real**

---

📖 **Documentación Completa**: https://stripe.com/docs/testing
