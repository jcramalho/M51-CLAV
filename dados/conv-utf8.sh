#!/bin/bash
# make sure you always put $f in double quotes to avoid any nasty surprises i.e. "$f"
for f in $*
do
  echo "Processing $f file..."
  fout="${f%.*}-utf8.csv"
  iconv -f MACINTOSH -t utf8 "$f" | tr '\r' '\n' > "$fout"
  rm "$f"
done