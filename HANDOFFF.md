# HANDOFFF.md — HandMade-Art → flujo 100% cotizaciones

> Documento de traspaso. Léelo primero si vuelves a este repo en una
> nueva sesión. Resume el problema, lo que se hizo, el estado actual y
> lo que falta. Asume que eres el orquestador con permisos plenos y
> que puedes leer la documentación existente (`AGENTS.md`, `CLAUDE.md`,
> `DESIGN.md`, `.impeccable.md`).

---

## 1. El problema (en una línea)

HandMade-Art era un e-commerce de compra directa; ahora **todo es por
encargo** y los pedidos pasan por una cotización que evalúa Don
Mauricio antes de cobrar. El flujo de carrito/PayPal directo había
quedado obsoleto, el SEO estaba en mínimos históricos y dos marcas
(Handmade Art + Cautiva) comparten stack pero el de cotizaciones solo
lo usa Handmade Art. La integración con WhatsApp de Mauricio
(vivienda + asistente) tampoco estaba cableada.

## 2. Decisiones cerradas (no re-abrir sin motivo)

- **Eliminar carrito y compra directa por completo.** `/products` absorbe la tienda con búsqueda; `/catalog`, `/cart`, `/checkout`, `/pay`, `/payment-success`, `/payment-cancel`, `/order-confirmation` redirigen a `/products` o son noindex.
- **Cotización primero, pago después.** El cliente arma una lista de interés en `/products`, abre el drawer, envía la solicitud. El admin pone precio en `/admin/quotes`, marca `sent_to_client`, y el cliente paga en `/quote/{slug}` (PayPal sandbox o SINPE Móvil).
- **Bi-dominio.** `artehechoamano.com → /es`, `handmadeart.store → /en`. hreflang y sitemap respetan dominios separados.
- **WhatsApp único a nivel producto:** 506 8585 0000 (Mauricio). Reemplaza cualquier 8423-7555 que aparezca suelto.

## 3. Lo que se hizo (fases 0 → 4 + cleanup)

### Fase 0 — Guardias SEO transaccionales
- `src/app/robots.ts`: disallow `/quote`, `/direct-quote`, `/pay`, `/payment-success`, `/payment-cancel`, `/order-confirmation`, `/login`, `/register`, `/viewed-history`, `/catalog/gracias`, `/qr`.
- `src/app/[locale]/quote/[slug]/page.tsx`: `generateMetadata` ahora devuelve título genérico + `robots:{index:false, follow:false}`. **Antes filtraba nombre y monto del cliente en title/description.**
- `pay/page.tsx`, `pay/[amount]/page.tsx`, `payment-success/page.tsx`, `payment-cancel/page.tsx`: `robots:{index:false}`.
- `fiestas-patronales-de-san-ramon/page.tsx`: usa `buildMetadata` (canonical + hreflang correctos); WhatsApp canónico a 506 8585 0000.

### Fase 1 — `/products` absorbe la tienda de cotizaciones
- `ProductsPageContent.tsx`, `SearchResultsPage.tsx`: instancian `useInterestList` + drawer + barra sticky inferior (mismo patrón del catálogo).
- `ProductCard.tsx`: botón de carrito reemplazado por toggle agregar/quitar de lista; etiqueta "Por encargo"; CTAs "Solicitar cotización".
- `AddToListButton.tsx` (nuevo): reemplaza `AddToCartButton` en `RelatedProductCard.tsx`.
- `ProductDetail.tsx`: CTA primario "Solicitar cotización" (Send, gold), WhatsApp como secundario, sin escritura a `cart_items`. `useInterestList.addItem` ahora acepta `qty`.
- `cart/page.tsx`, `checkout/page.tsx`, `catalog/page.tsx`: `redirect('/${locale}/products')`.
- `pay/[amount]/page.tsx`: redirect a productos + `robots:{index:false}`.
- `Navbar.tsx` + `NavbarClient.tsx`: removido ícono/badge/enlaces de carrito; botón "Cotizar" a `/products`.
- `src/app/layout.tsx`: removido `CartProvider` (muerto).
- **Archivos borrados:** `AddToCartButton.tsx` (home + products), `ProductModal.tsx`, `ProductModalWithTracking.tsx`, `ClientComponents.tsx`, `RelatedProductsClient.tsx`, `quote/PaymentSuccessMessage.tsx`, `CartContext.tsx`, `home/AddToCartButton.tsx`.

### Fase 2 — Retirar compra directa
- Borrados: `checkout/StepOne|StepTwo|PaymentForm|PayPalCardMethod.tsx`, `api/checkout/orders/route.ts`.
- **Conservados:** `GET orders/[orderId]`, paypal create/capture, `sinpe/reference`, cron expire-reservations, todo `lib/checkout/*` (los usa `QuotePaymentPage`).
- Cupones de carrito mueren solos; `useDiscountCode` de cotizaciones queda intacto.

### Fase 3 — Arreglos de cotización
- **Bug reenvío:** `api/send-quote-email` seleccionaba `product_snapshot` pero leía `item.snapshot` → ítems salían en $0. Corregido.
- **SINPE Móvil en `QuotePaymentPage.tsx`:** selector PayPal | SINPE; lista de bancos extraída a constante; backend ya aceptaba `'sinpe'` en `POST api/checkout/quotes/[quoteId]/orders`.
- **Notificación al manager siempre:** `getManagerNotificationEmail()` usa `process.env.MANAGER_NOTIFICATION_EMAIL` con fallback `sobrepoxidev@gmail.com`. ⚠️ **Env var a configurar en Vercel** (ver §6).
- **Webhook a aisolutions-saas:** `create-interest-request` hace `fetch` fire-and-forget (5s timeout, try/catch) a `NOTIFY_WEBHOOK_URL` con `Authorization: Bearer ${NOTIFY_WEBHOOK_TOKEN}`. **El receptor está en el otro repo (ver §4).**
- **Anti-spam:** honeypot `website` + rate limit per-IP 5/10min en memoria.
- **`QuotesManagement.tsx`:** filtro de estados corregido a `received/priced/sent_to_client/closed_won/closed_lost` (los reales del enum).

### Fase 4 — Limpieza técnica SEO
- **Legacy IDs en `product/[slug]/page.tsx`:** si el slug es numérico, lookup por id + 308 redirect a `encodeURIComponent(name)`. Recupera URLs tipo `/product/105` que hoy dan 404 y aparecen indexadas en GSC.
- **`sitemap.ts`:** quitados `/search`, `/account`, `/qr`; `encodeURIComponent(product.name)`; sin `new Date()` global.
- **www→apex:** redirect 301 en `middleware.tsx` antes del manejo de locale.
- **`ProductJsonLd.tsx`:** `availability: 'https://schema.org/MadeToOrder'`; removidos `MerchantReturnPolicy` y `OfferShippingDetails` fabricados.
- **`fiestas-patronales`:** metadata correcta; sigue indexable (es el activo estacional mejor posicionado, pos. 5.12).
- WhatsApp en `contact` y CTAs unificado a 506 8585 0000.

### Cleanup adicional
- `src/lib/checkout/orders.ts`: borradas funciones muertas de carrito (`createCartCheckoutOrder`, `normalizeQuantity`, `normalizeEmail`, `getLinePrice`, `calculateDiscountAmount`, `validateDiscount`, `consumeDiscount`, `ProductForCheckout`, `DiscountCodeRow`, `SHIPPING_AMOUNT_USD`, `ValidatedDiscount`). `CreateQuoteOrderInput` trim a `{ quoteId, quoteSlug, paymentMethod, shippingAddress }`.

## 4. El endpoint en aisolutions-saas (pendiente de commit ahí)

**Archivo nuevo en `C:\dev\Proyectos\aisolutions-saas\apps\web\app\api\integrations\handmade-art\`:**
- `route.ts` — POST valida `Authorization: Bearer <HANDMADE_ART_WEBHOOK_SECRET>` con `timingSafeEqual`, valida body con Zod (schema real del emisor: `type`, `request_id`, `requester_name`, `organization`, `email`, `phone`, `notes`, `total_amount_usd`, `items[].{name, quantity, unit_price_usd}`, `created_at`), inserta en `integrations.notification_outbox` con `delivery_bot_id='aisolutions-internal-1'`, `source_organization_id=90a9676f...` (Mauricio), `recipient_target=+50685850000` (hardcoded, sin migración), `org_slug='handmade-art'`, `event_kind='handmade_art.interest_request_new'`, `dedup_key` por minuto, audit `logSystemAuditEvent`, fail-soft 200 (nunca 5xx).
- `README.md` — contrato documentado.

**Modificado:** `aisolutions-saas/.env.example` → añadida `HANDMADE_ART_WEBHOOK_SECRET=`.

**⚠️ Estado de git en aisolutions-saas:** la rama de trabajo actual es `057-lodging-ops-whatsapp` con su propio spec/plan. El endpoint del webhook se commitea en una rama aparte `feat/handmade-art-webhook` desde `master` para no mezclar trabajo no relacionado.

**Por qué hardcoded `+50685850000`:** `platform_core.notification_recipient` no tiene fila para Mauricio/Handmade-Art hoy (solo Bryam en 4 orgs top-level). Si Mauricio cambia de número, se actualiza el endpoint. La alternativa data-driven (migración que registre recipient con `event_kinds` que matcheen `handmade_art.*`) queda como follow-up.

## 5. Estado actual del repo (verificado en sesión 2026-08-26)

- `git status` en `master` muestra **cambios no commiteados** de las fases 0–4: 8 archivos borrados (los del cleanup de cart) + untracked `SEO 08-26/`, `.zcode/`, `qr-output/`, `public/qr/cautiva-logo.webp`.
- Última rama activa: `master`. Commits previos de esta sesión: `b1c3eee feat(footer)...`, `48cd50c feat(qr)...`, `e6c4046 feat(qr)...`, `9b11f3e feat(qr)...`, `54083ab feat(qr)...`. Los cambios de fase 0–4 quedaron en working tree al pedir el handoff.
- Builds: asumes que corrieron limpios durante la fase de implementación. **No se ha corrido `npm run build` después de los cambios de cleanup** — revalidar antes de deploy.

## 6. Variables de entorno (pendientes en Vercel)

### aisolutions-saas (Vercel)
```
HANDMADE_ART_WEBHOOK_SECRET=729333b75c68f7eb15d41316a7485270e8019a05d79f45b789086a920cd52c8c
```

### HandMade-Art (Vercel)
```
NOTIFY_WEBHOOK_TOKEN=729333b75c68f7eb15d41316a7485270e8019a05d79f45b789086a920cd52c8c
NOTIFY_WEBHOOK_URL=https://<HOST-VERCEL-DE-AISOLUTIONS-SAAS>/api/integrations/handmade-art
MANAGER_NOTIFICATION_EMAIL=sobrepoxidev@gmail.com  (opcional, ese es el fallback)
```

Las dos copias del secret DEBEN ser idénticas. Generadas con `openssl rand -hex 32` en la sesión del 2026-08-26.

## 7. Lo que falta (orden sugerido)

1. **Commit + push en HandMade-Art** (fases 0–4 + este handoff) a `master`. La máquina donde se trabajó se va a reiniciar.
2. **En aisolutions-saas:** crear rama `feat/handmade-art-webhook` desde `master`, commitear los 2 archivos nuevos + la línea de `.env.example`, push.
3. **Deploy aisolutions-saas** → confirmar que `/api/integrations/handmade-art` existe en Vercel → Functions.
4. **Deploy HandMade-Art** con las env vars.
5. **Smoke test end-to-end:**
   - `curl` al endpoint con el secret → 200 + fila en `notification_outbox` con `event_kind='handmade_art.interest_request_new'`.
   - En ≤60s el cron `ai-solutions-internal-dispatch-v1` entrega WhatsApp a `+50685850000`.
   - Disparar el flujo real desde `/products` en HandMade-Art → Mauricio recibe el WhatsApp.
6. **Verificar en GSC** que `/quote/*` deja de aparecer en cobertura tras el próximo crawl.
7. (Opcional) **Migración `notification_recipient`** en aisolutions-saas para que el recipient sea data-driven. 1 INSERT.

## 8. Riesgos / cosas que no se verifican automáticamente

- **Realtime del SEO:** los disallows y noindex tardan semanas en hacer efecto en GSC. No hay acción de código.
- **PayPal live vs sandbox:** el modo live NO se ha activado. Cualquier cobro real requiere las credenciales live en Vercel.
- **El flow de SINPE sigue siendo manual:** Don Mauricio tiene que verificar la referencia y marcarla pagada en admin; sin esa marca el cliente ve `pending`.
- **El `client as unknown as {...}` del endpoint** es un cast defensivo porque la unión `Database` types de aisolutions-saas no incluye `integrations.notification_outbox`. Funciona, pero si más adelante quieres tipado estricto hay que extender el tipo.
- **Hardcoded `+50685850000`:** si Mauricio se muda, hay que tocar el endpoint. Migración de recipient es la solución data-driven.

## 9. Si vuelves a esta sesión

1. Lee `AGENTS.md` (reglas de commits, env vars, migraciones).
2. Lee este handoff completo.
3. Mira `git status` en ambos repos. En HandMade-Art master hay cambios sin commitear. En aisolutions-saas hay una rama `feat/handmade-art-webhook` (o no, si no llegaste a crearla).
4. El orden de trabajo es: terminar commits/push → configurar Vercel → smoke test → opcional migración de recipient.
5. Si la pregunta es "¿qué sigue?" → paso 1 de la §7.

## 10. Archivos de referencia

- Plan completo (sesión anterior, en `.zcode/plans/plan-sess_5b093577-c9b8-4615-a23a-629c72c51da9.md`) — el "qué" y "por qué" de cada fase.
- `AGENTS.md`, `CLAUDE.md`, `DESIGN.md` — reglas del repo HandMade-Art.
- `AGENTS.md` de aisolutions-saas — reglas de ese repo (rama activa, no borrar de Supabase sin confirmar, push con impacto verificado).
- `docs/architecture/secrets-and-env-vars-convention.md` (en aisolutions-saas) — convención de nombres de env vars.
