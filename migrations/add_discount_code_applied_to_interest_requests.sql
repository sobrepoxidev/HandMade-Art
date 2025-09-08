-- Migración: Agregar campo discount_code_applied a la tabla interest_requests
-- Fecha: 2025-01-16
-- Descripción: Agrega un campo JSONB para almacenar información del código de descuento aplicado

-- Habilitar extensión pg_trgm si no está habilitada (opcional para búsquedas de texto)
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Agregar la columna discount_code_applied
ALTER TABLE interest_requests 
ADD COLUMN IF NOT EXISTS discount_code_applied JSONB DEFAULT NULL;

-- Agregar comentario explicativo
COMMENT ON COLUMN interest_requests.discount_code_applied IS 'Información del código de descuento aplicado al crear la solicitud. Contiene: code, discount_type, discount_value, description';

-- Crear índice para búsquedas por código de descuento
-- Opción 1: Índice GIN con pg_trgm (requiere extensión pg_trgm)
-- CREATE INDEX IF NOT EXISTS idx_interest_requests_discount_code ON interest_requests USING GIN ((discount_code_applied->>'code') gin_trgm_ops);

-- Opción 2: Índice B-tree simple (recomendado para búsquedas exactas)
CREATE INDEX IF NOT EXISTS idx_interest_requests_discount_code ON interest_requests ((discount_code_applied->>'code'));