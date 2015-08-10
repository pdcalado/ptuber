#!/bin/bash

preview=0

if [ "$2" == "--preview" ]
then
    preview=1
    echo "Preview mode!"
fi

uprow=$(curl -f $DB_URL/uploaded?id="$1")

rc=$?

if [ $rc -ne 0 ]
then
    echo "Failed to get uploaded row"
    exit 1
fi

encrow=$(curl -f $DB_URL/encrypted?id="$1")

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
    skicka download $filepath$1.enc $CRYPTED_FOLDER/
    bash decrypt.sh $CRYPTED_FOLDER/$1.enc $password $DECRYPTED_FOLDER/$filename
fi

skicka download $filepath$1.tar.gz $CRYPTED_FOLDER/
bash decrypt.sh $CRYPTED_FOLDER/$1.tar.gz $password temporary.tar.gz
tar -zxf temporary.tar.gz

if [ $preview -eq 1 ]
then
    gpicview $THUMBS_FOLDER/$1-*
fi
