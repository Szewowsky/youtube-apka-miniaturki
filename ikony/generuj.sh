#!/bin/sh
# Generuje Ikony Wtyczki (16/32/48/128 px) z jednego rysunku 512 px.
# Wymaga ImageMagick (`magick`). Uruchamiane ręcznie tylko przy zmianie wyglądu ikony.
set -e
cd "$(dirname "$0")"
magick -size 512x512 xc:none \
  -fill '#e62117' -draw 'roundrectangle 16,16 496,496 112,112' \
  -fill none -stroke white -strokewidth 36 -draw 'roundrectangle 88,104 424,304 32,32' \
  -strokewidth 44 -draw 'stroke-linecap round stroke-linejoin round line 256,280 256,400' \
  -draw 'stroke-linecap round stroke-linejoin round polyline 192,344 256,408 320,344' \
  ikona-512.png
for s in 16 32 48 128; do
  magick ikona-512.png -filter Lanczos -resize ${s}x${s} ikona-$s.png
done
rm ikona-512.png
