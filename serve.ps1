$port = 8080
$ip = [System.Net.IPAddress]::Loopback
$listener = New-Object System.Net.Sockets.TcpListener($ip, $port)
$listener.Start()
Write-Output "Zentro Server running at http://localhost:$port/"

$baseDir = $PSScriptRoot

while ($true) {
    try {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = New-Object System.IO.StreamReader($stream)
        
        $requestLine = $reader.ReadLine()
        if (-not $requestLine) {
            $client.Close()
            continue
        }

        # Read remaining headers and check for Range header
        $rangeHeader = $null
        while ($line = $reader.ReadLine()) {
            if ($line.Trim() -eq "") { break }
            if ($line -match "(?i)^Range:\s*bytes=(\d*)-(\d*)") {
                $rangeHeader = $line
            }
        }

        $parts = $requestLine.Split(" ")
        $method = $parts[0]
        $rawUrl = if ($parts.Length -gt 1) { $parts[1] } else { "/" }

        $urlPath = $rawUrl.Split("?")[0]
        if ($urlPath -eq "/" -or [string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = "/index.html"
        }

        $relPath = $urlPath.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
        $filePath = Join-Path $baseDir $relPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mimeType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                ".webp" { "image/webp" }
                ".mp4"  { "video/mp4" }
                ".webm" { "video/webm" }
                ".ico"  { "image/x-icon" }
                default { "application/octet-stream" }
            }

            $fileInfo = New-Object System.IO.FileInfo($filePath)
            $totalBytes = $fileInfo.Length

            if ($rangeHeader -and ($rangeHeader -match "(?i)Range:\s*bytes=(\d*)-(\d*)")) {
                $startStr = $matches[1]
                $endStr = $matches[2]
                
                $start = if ([string]::IsNullOrWhiteSpace($startStr)) { 0L } else { [long]$startStr }
                $end = if ([string]::IsNullOrWhiteSpace($endStr)) { $totalBytes - 1L } else { [long]$endStr }
                
                if ($end -ge $totalBytes) { $end = $totalBytes - 1L }
                
                if ($start -gt $end -or $start -ge $totalBytes) {
                    $header = "HTTP/1.1 416 Range Not Satisfiable`r`nContent-Range: bytes */$totalBytes`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                } else {
                    $chunkLength = ($end - $start) + 1L
                    $header = "HTTP/1.1 206 Partial Content`r`nContent-Type: $mimeType`r`nContent-Range: bytes $start-$end/$totalBytes`r`nContent-Length: $chunkLength`r`nAccept-Ranges: bytes`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)

                    $fs = [System.IO.File]::OpenRead($filePath)
                    $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
                    $buffer = New-Object byte[] 65536
                    $remaining = $chunkLength
                    while ($remaining -gt 0L) {
                        $toRead = if ($remaining -gt 65536L) { 65536 } else { [int]$remaining }
                        $read = $fs.Read($buffer, 0, $toRead)
                        if ($read -le 0) { break }
                        $stream.Write($buffer, 0, $read)
                        $remaining -= $read
                    }
                    $fs.Close()
                }
            } else {
                $header = "HTTP/1.1 200 OK`r`nContent-Type: $mimeType`r`nContent-Length: $totalBytes`r`nAccept-Ranges: bytes`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                $stream.Write($headerBytes, 0, $headerBytes.Length)
                
                $fs = [System.IO.File]::OpenRead($filePath)
                $buffer = New-Object byte[] 65536
                while (($read = $fs.Read($buffer, 0, 65536)) -gt 0) {
                    $stream.Write($buffer, 0, $read)
                }
                $fs.Close()
            }
        } else {
            $notFound = "<h1>404 Not Found</h1>"
            $nfBytes = [System.Text.Encoding]::UTF8.GetBytes($notFound)
            $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/html`r`nContent-Length: $($nfBytes.Length)`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
            
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($nfBytes, 0, $nfBytes.Length)
        }

        $stream.Flush()
        $client.Close()
    } catch {
        # ignore transient socket errors
    }
}
