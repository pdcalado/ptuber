#!/bin/bash

for item in $*; do
    echo "-- Processing $item --"
    pass=$(bash gen_passwd.sh)
    bash prepare_upload.sh $item crypted $pass
    bash upload.sh $item Brno/ $pass
    echo "-- Ending --"
done
