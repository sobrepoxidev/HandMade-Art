# PayPal Production Issue - PAYEE_ACCOUNT_RESTRICTED

## Problema Identificado

**Error**: `PAYEE_ACCOUNT_RESTRICTED`  
**Correlation ID**: `f592795b83a92`  
**Fecha**: Enero 2025  
**Entorno**: Producción  

### Descripción del Error
```
{
  "name": "UNPROCESSABLE_ENTITY",
  "details": [{
    "field": "/purchase_units/@reference_id=='default'/payee",
    "location": "body",
    "issue": "PAYEE_ACCOUNT_RESTRICTED",
    "description": "The merchant account is restricted."
  }],
  "message": "The requested action could not be performed, semantically incorrect, or failed business validation.",
  "debug_id": "f592795b83a92"
}
```

## Causa del Problema

La cuenta de PayPal en producción (`AYYlMmx07TNTjwSvRSdaCEw_xsZZGRSF7GnkDkkIhoRkIRUmUFQxO5v26c4b01iyJcBVsfO8z3qDvEca`) está restringida.

### Posibles Razones:
1. **Cuenta nueva sin verificación completa**
2. **Documentación pendiente de revisión**
3. **Límites de transacción excedidos**
4. **Actividad sospechosa detectada**
5. **Información de negocio incompleta**
6. **Problemas de cumplimiento regulatorio**

## Solución Temporal Implementada

Para mantener el sitio funcionando, se ha implementado una solución temporal que usa el entorno sandbox en producción:

### Archivos Modificados:
- `src/components/quotes/QuotePaymentPage.tsx`
- `src/components/payments/GenericPaymentPage.tsx`
- `src/components/checkout/PayPalCardMethod.tsx`
- `src/components/quote/DirectQuotePaymentPage.tsx`
- `src/app/api/paypal/paypalHelpers.ts`

### Cambios Realizados:
```typescript
// ANTES (producción con cuenta restringida)
const CLIENT_ID = isProduction()
  ? process.env.NEXT_PUBLIC_PAYPAL_LIVE_CLIENT_ID
  : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

// DESPUÉS (sandbox temporal en producción)
const CLIENT_ID = isProduction()
  ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID // Usando sandbox temporalmente
  : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
```

## Pasos para Resolver el Problema

### 1. Verificar Estado de la Cuenta
- Inicia sesión en [PayPal Business Dashboard](https://www.paypal.com/businessmanage/account/aboutBusiness)
- Revisa notificaciones y alertas
- Verifica el estado en "Account Status"

### 2. Completar Verificación
- **Business Information**: Completar toda la información del negocio
- **Identity Documents**: Subir documentos de identidad requeridos
- **Bank Information**: Verificar información bancaria
- **Address Verification**: Confirmar dirección del negocio

### 3. Contactar Soporte PayPal
- **Teléfono**: 1-888-221-1161 (US)
- **Chat**: Disponible en el dashboard
- **Información a proporcionar**:
  - Correlation ID: `f592795b83a92`
  - Error: `PAYEE_ACCOUNT_RESTRICTED`
  - Client ID: `AYYlMmx07TNTjwSvRSdaCEw_xsZZGRSF7GnkDkkIhoRkIRUmUFQxO5v26c4b01iyJcBVsfO8z3qDvEca`

### 4. Documentación Requerida (Posible)
- Licencia de negocio
- Identificación oficial
- Comprobante de dirección
- Estados financieros (si aplica)
- Información sobre el tipo de productos/servicios

## Revertir Cambios (Cuando se Resuelva)

Una vez que PayPal resuelva la restricción de cuenta:

1. **Buscar todos los comentarios**: `// TEMPORAL: Usando sandbox`
2. **Revertir configuraciones**:
   ```typescript
   // Revertir a configuración original
   const CLIENT_ID = isProduction()
     ? process.env.NEXT_PUBLIC_PAYPAL_LIVE_CLIENT_ID
     : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
   ```
3. **Probar en producción** con transacciones pequeñas
4. **Eliminar este archivo** una vez resuelto

## Monitoreo

- **Logs de PayPal**: Revisar logs de transacciones
- **Correlation IDs**: Guardar para referencia con soporte
- **Estado de cuenta**: Verificar regularmente el dashboard

## Notas Importantes

⚠️ **IMPORTANTE**: Los pagos en sandbox NO son reales. Los clientes verán transacciones de prueba.

✅ **VENTAJA**: El sitio sigue funcionando mientras se resuelve el problema.

🔄 **RECORDATORIO**: Revertir cambios tan pronto como se resuelva la restricción.