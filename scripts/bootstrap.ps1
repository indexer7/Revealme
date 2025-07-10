<# 
  .SYNOPSIS
    Bootstraps Revealme on Windows with Docker Desktop.
#>
$ErrorActionPreference = 'Stop'
if (-Not (Test-Path -Path '.env')) {
  Copy-Item -Path '.env.example' -Destination '.env'
}
$dirs = @('data\postgres','data\spiderfoot','data\reports')
foreach ($d in $dirs) {
  if (-Not (Test-Path -Path $d)) {
    New-Item -ItemType Directory -Path $d | Out-Null
  }
}
docker-compose up -d 