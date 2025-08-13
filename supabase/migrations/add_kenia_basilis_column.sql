-- Agregar columna kenia_basilis_followed a la tabla leads
ALTER TABLE leads 
ADD COLUMN kenia_basilis_followed BOOLEAN DEFAULT FALSE;

-- Crear un índice para mejorar el rendimiento si es necesario
CREATE INDEX IF NOT EXISTS idx_leads_kenia_basilis_followed ON leads(kenia_basilis_followed);