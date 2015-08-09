#!/bin/bash

preview=0

if [ "$2" == "--preview" ]
then
    preview=1
    echo "Preview mode!"
fi

uprow=$(curl -f localhost:3000/uploaded?id="$1")

rc=$?

if [ $rc -ne 0 ]
then
    echo "Failed to get uploaded row"
    exit 1
fi

encrow=$(curl -f localhost:3000/encrypted?id="$1")

rc=$?

if [ $rc -ne 0 ]
then
    echo "Failed to get encrypted row"
    exit 1
fi

filepath=$(echo $uprow | jq '.path' | sed -e 's/^"//'  -e 's/"$//')
filename=$(echo $encrow | jq '.name' | sed -e 's/^"//'  -e 's/"$//')
password=$(echo $uprow | jq '.password' | sed -e 's/^"//'  -e 's/"$//')

if [ $preview -ne 1 ]
then
    skicka download $filepath$1.enc crypted/
    bash decrypt.sh crypted/$1.enc $password decrypted/$filename
fi

skicka download $filepath$1.tar.gz crypted/
bash decrypt.sh crypted/$1.tar.gz $password temporary.tar.gz
tar -zxf temporary.tar.gz

if [ $preview -eq 1 ]
then
    gpicview thumbs/$1-*
fi
