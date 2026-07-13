# Backup automático de Referix D1 Database
# Programar en Task Scheduler: diario a las 2:00 AM
param(
  [string]$OutputDir = "C:\Projects\Referix\backups"
)
$date = Get-Date -Format "yyyy-MM-dd-HHmm"
$file = Join-Path $OutputDir "backup-$date.sql"
Write-Host "🔄 Creando backup: $file"
npx wrangler d1 export referix-db --remote --output="$file" 2>&1
if ($?) { Write-Host "✅ Backup completado: $file" } else { Write-Host "❌ Error en backup" }
