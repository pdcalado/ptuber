#!/bin/bash

hash=$(echo -n "$1" | md5sum - | cut -d' ' -f1)

mkdir -p thumbs

for perc in `seq 10 10 90`
do
    name=$(echo -n "$hash-$perc")
    ffmpegthumbnailer -i $1 -c png -s 500 -t $perc -o thumbs/$name.png
done

echo "Wrote to thumbs/$hash-*.png"
