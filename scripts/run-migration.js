// Script temporal para ejecutar la migración de discount_code_applied
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Leer variables de entorno desde .env.local
function loadEnvVars() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim().replace(/["']/g, '');
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error leyendo .env.local:', error.message);
    return {};
  }
}

async function runMigration() {
  const envVars = loadEnvVars();
  
  const supabase = createClient(
    envVars.NEXT_PUBLIC_SUPABASE_URL,
    envVars.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('Ejecutando migración: agregar campo discount_code_applied...');

  try {
    // Verificar conexión
    console.log('Verificando conexión a la base de datos...');
    const { data: testData, error: testError } = await supabase
      .from('interest_requests')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('Error conectando a la base de datos:', testError);
      process.exit(1);
    }
    
    console.log('✅ Conexión exitosa');
    
    // Verificar si la columna ya existe
    console.log('Verificando si la columna discount_code_applied ya existe...');
    const { data: columns, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'interest_requests')
      .eq('column_name', 'discount_code_applied');
    
    if (columnError) {
      console.log('No se pudo verificar la columna, procediendo con la migración...');
    } else if (columns && columns.length > 0) {
      console.log('✅ La columna discount_code_applied ya existe');
      process.exit(0);
    }
    
    console.log('La columna no existe, ejecutando migración manual...');
    console.log('Por favor, ejecuta el siguiente SQL en tu consola de Supabase:');
    console.log('\n--- INICIO DEL SQL ---');
    console.log(`-- Agregar la columna discount_code_applied
ALTER TABLE interest_requests 
ADD COLUMN IF NOT EXISTS discount_code_applied JSONB DEFAULT NULL;

-- Agregar comentario explicativo
COMMENT ON COLUMN interest_requests.discount_code_applied IS 'Información del código de descuento aplicado al crear la solicitud. Contiene: code, discount_type, discount_value, description';

-- Crear índice para búsquedas por código de descuento (B-tree simple)
CREATE INDEX IF NOT EXISTS idx_interest_requests_discount_code ON interest_requests ((discount_code_applied->>'code'));`);
    console.log('--- FIN DEL SQL ---\n');
    
    console.log('✅ Script completado. Ejecuta el SQL manualmente en Supabase.');
    
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

runMigration();