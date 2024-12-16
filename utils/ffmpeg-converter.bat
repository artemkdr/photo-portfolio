@echo off
mkdir output
for %%i in (source\*.jpeg source\*.jpg source\*.bmp source\*.arw source\*.raw) do (
  ffmpeg -i "%%i" -vf "scale=if(gte(a\,1600/1200)\,min(1600\,iw)\,-2):if(gte(a\,1600/1200)\,-2\,min(1200\,ih))" -c:v libwebp -qscale:v 75 "output\%%~ni.webp"  
)