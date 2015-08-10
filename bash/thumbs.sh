#!/bin/bash

hash=$(echo -n "$1" | md5sum - | cut -d' ' -f1)

mkdir -p $THUMBS_FOLDER

for perc in `seq 10 10 90`
do
    name=$(echo -n "$hash-$perc")
    ffmpegthumbnailer -i $1 -c png -s 500 -t $perc -o $THUMBS_FOLDER/$name.png
done

echo "Wrote to $THUMBS_FOLDER/$hash-*.png"
