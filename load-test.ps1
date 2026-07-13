# Referix Load Test
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   REFERIX - TEST DE CARGA" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$BASE = "https://referix-api.reto-diario.workers.dev"
$HEADERS = @{"X-Tenant-Id"="interplay";"Content-Type"="application/json"}
$CONCURRENT = 10  # usuarios simultáneos
$REQUESTS = 50    # total de requests

# Endpoints a probar
$ENDPOINTS = @(
    @{name="Dashboard"; url="/api/v1/dashboard"; method="GET"},
    @{name="Catálogo"; url="/api/v2/admin/plans"; method="GET"},
    @{name="Zonas"; url="/api/v2/catalog/zones"; method="GET"},
    @{name="Usuarios"; url="/api/v1/users"; method="GET"},
    @{name="Login"; url="/api/v1/auth/login"; method="POST"; body='{"email":"mileribata@gmail.com","password":"admin123"}'}
)

function Test-Endpoint {
    param($ep)
    $start = Get-Date
    try {
        if ($ep.method -eq "POST") {
            $r = Invoke-RestMethod -Uri ($BASE + $ep.url) -Method POST -Body $ep.body -ContentType "application/json" -Headers $HEADERS -ErrorAction Stop
        } else {
            $r = Invoke-RestMethod -Uri ($BASE + $ep.url) -Method GET -Headers $HEADERS -ErrorAction Stop
        }
        $ms = [math]::Round(((Get-Date) - $start).TotalMilliseconds, 1)
        return @{ok=$true; ms=$ms; error=$null}
    } catch {
        $ms = [math]::Round(((Get-Date) - $start).TotalMilliseconds, 1)
        return @{ok=$false; ms=$ms; error=$_.Exception.Message}
    }
}

# Test secuencial primero
Write-Host "📊 PRUEBA SECUENCIAL (1 request c/u)`n" -ForegroundColor Yellow
foreach ($ep in $ENDPOINTS) {
    $r = Test-Endpoint $ep
    $status = if ($r.ok) { "✅" } else { "❌" }
    $color = if ($r.ok) { "Green" } else { "Red" }
    Write-Host "  $status $($ep.name): $($r.ms)ms" -ForegroundColor $color
}

# Test concurrente
Write-Host "`n📊 PRUEBA CONCURRENTE ($CONCURRENT usuarios simultáneos, $REQUESTS requests)`n" -ForegroundColor Yellow

$results = @()
$totalStart = Get-Date
$completed = 0
$lock = [System.Threading.Mutex]::new()

for ($i = 0; $i -lt $REQUESTS; $i++) {
    $ep = $ENDPOINTS | Get-Random
    $job = Start-Job -ScriptBlock {
        param($url, $method, $body, $headers, $base)
        $start = Get-Date
        try {
            if ($method -eq "POST") {
                $r = Invoke-RestMethod -Uri ($base + $url) -Method POST -Body $body -ContentType "application/json" -Headers $headers -ErrorAction Stop
            } else {
                $r = Invoke-RestMethod -Uri ($base + $url) -Method GET -Headers $headers -ErrorAction Stop
            }
            $ms = [math]::Round(((Get-Date) - $start).TotalMilliseconds, 1)
            return @{ok=$true; ms=$ms}
        } catch {
            $ms = [math]::Round(((Get-Date) - $start).TotalMilliseconds, 1)
            return @{ok=$false; ms=$ms}
        }
    } -ArgumentList $ep.url, $ep.method, $ep.body, $HEADERS, $BASE

    $results += @{job=$job; ep=$ep.name}
    
    # Esperar si ya tenemos suficientes concurrentes
    while ((Get-Job -State Running).Count -ge $CONCURRENT) {
        Start-Sleep -Milliseconds 100
    }
}

# Esperar todos los jobs
Write-Host "  Esperando resultados..." -NoNewline
while ((Get-Job -State Running).Count -gt 0) {
    Start-Sleep -Milliseconds 200
}
$totalTime = [math]::Round(((Get-Date) - $totalStart).TotalSeconds, 1)
Write-Host " ✅`n" -ForegroundColor Green

# Procesar resultados
$success = 0
$fail = 0
$times = @()
foreach ($r in $results) {
    $j = Receive-Job $r.job -Wait -ErrorAction SilentlyContinue
    Remove-Job $r.job -Force -ErrorAction SilentlyContinue
    if ($j -and $j.ok) { $success++; $times += $j.ms } else { $fail++ }
}
$avg = if ($times.Count -gt 0) { [math]::Round(($times | Measure-Object -Average).Average, 1) } else { 0 }
$max = if ($times.Count -gt 0) { [math]::Round(($times | Measure-Object -Maximum).Maximum, 1) } else { 0 }
$min = if ($times.Count -gt 0) { [math]::Round(($times | Measure-Object -Minimum).Minimum, 1) } else { 0 }
$p95 = if ($times.Count -gt 0) { [math]::Round(($times | Sort-Object)[[math]::Floor($times.Count * 0.95)], 1) } else { 0 }
$rps = if ($totalTime -gt 0) { [math]::Round($REQUESTS / $totalTime, 1) } else { 0 }

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   RESULTADOS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "  Total requests: $REQUESTS" -ForegroundColor White
Write-Host "  Concurrencia:   $CONCURRENT" -ForegroundColor White
Write-Host "  Tiempo total:   ${totalTime}s" -ForegroundColor White
Write-Host "  Requests/seg:   $rps req/s`n" -ForegroundColor White
Write-Host "  ✅ Exitosos:    $success" -ForegroundColor Green
Write-Host "  ❌ Fallos:      $fail`n" -ForegroundColor Red
Write-Host "  ⚡ Tiempos de respuesta:" -ForegroundColor Yellow
Write-Host "     Mínimo:     ${min}ms" -ForegroundColor White
Write-Host "     Promedio:   ${avg}ms" -ForegroundColor White
Write-Host "     Máximo:     ${max}ms" -ForegroundColor White
Write-Host "     P95:        ${p95}ms`n" -ForegroundColor White

if ($fail -eq 0 -and $avg -lt 2000) {
    Write-Host "🎯 VEREDICTO: ✅ La plataforma responde bien bajo carga" -ForegroundColor Green
} elseif ($fail -eq 0 -and $avg -lt 5000) {
    Write-Host "⚠️ VEREDICTO: 🟡 Responde pero lento, revisar consultas lentas" -ForegroundColor Yellow
} else {
    Write-Host "❌ VEREDICTO: 🔴 No soporta la carga, optimizar endpoints" -ForegroundColor Red
}
Write-Host "`n========================================`n" -ForegroundColor Cyan
