Add-Type -AssemblyName System.Drawing
$files = Get-ChildItem "assets\media" -Include *.jpg,*.jpeg,*.png -File -Name

foreach ($name in $files) {
    try {
        $src = [System.IO.Path]::Combine((Get-Location).Path, "assets\media\$name")
        $tmp = [System.IO.Path]::Combine((Get-Location).Path, "assets\media\tmp_$name")
        
        $bmp = [System.Drawing.Image]::FromFile($src)
        
        # Determine scale to max width 1000px
        $ratio = 1.0
        if ($bmp.Width -gt 1000) {
            $ratio = 1000.0 / $bmp.Width
        }
        
        # If it's already small enough, maybe don't even process it unless applying quality compression
        $newWidth = [int]($bmp.Width * $ratio)
        $newHeight = [int]($bmp.Height * $ratio)
        
        $newBmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($newBmp)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        
        if ($name.EndsWith(".png")) {
            $graphics.Clear([System.Drawing.Color]::White)
        }
        
        $graphics.DrawImage($bmp, 0, 0, $newWidth, $newHeight)
        $graphics.Dispose()
        $bmp.Dispose()
        
        # We save everything as heavily compressed JPEG
        $codecs = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()
        $jpegCodec = $codecs | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 65L)
        
        $newBmp.Save($tmp, $jpegCodec, $encoderParams)
        $newBmp.Dispose()
        
        Remove-Item $src -Force
        Move-Item $tmp $src -Force
        
        Write-Host "Successfully compressed $name"
    } catch {
        Write-Host "Failed to compress $name : $_"
    }
}
