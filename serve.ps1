# Tiny static server for the intro site: .\serve.ps1 [-Port 8090]
param([int]$Port = 8090)
$root = $PSScriptRoot
$types = @{ '.html'='text/html'; '.css'='text/css'; '.js'='text/javascript'; '.jpg'='image/jpeg'; '.svg'='image/svg+xml' }
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
Write-Host "Serving $root at http://localhost:$Port/"
while ($l.IsListening) {
  $c = $l.GetContext()
  $p = $c.Request.Url.LocalPath.TrimStart('/')
  if ($p -eq '') { $p = 'index.html' }
  $f = Join-Path $root $p
  if ((Test-Path $f -PathType Leaf) -and ((Resolve-Path $f).Path.StartsWith($root))) {
    $c.Response.ContentType = $types[[IO.Path]::GetExtension($f)]
    $b = [IO.File]::ReadAllBytes($f)
    $c.Response.OutputStream.Write($b, 0, $b.Length)
  } else { $c.Response.StatusCode = 404 }
  $c.Response.Close()
}
