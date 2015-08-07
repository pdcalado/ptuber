#!/bin/bash

if [ "$1" == "" ]
then
    echo "Missing argument name"
    exit 1
fi

if [ "$2" == "" ]
then
    echo "Missing argument remote path"
    exit 1
fi

if [ "$3" == "" ]
then
    echo "Missing argument pass"
    exit 1
fi

hash_name=$(echo -n "$1" | md5sum - | cut -d' ' -f1)

# Check if encrypted file already exists
nulled=$(stat crypted/$hash_name.enc >> /dev/null 2>&1)

rc=$?

if [ $rc -ne 0 ]
then
    echo "File crypted/$hash_name.enc not found"
    exit 1
fi

# Check if thumbs already exist
nulled=$(stat crypted/$hash_name.tar.gz >> /dev/null 2>&1)

rc=$?

thumbs=""

if [ $rc -eq 0 ]
then
    thumbs="$hash_name.tar.gz"
else
    echo "Thumbs not found"
fi

# Upload file using skicka
skicka upload crypted/$hash_name.enc Brno/

if [ -n $thumbs ]
then
    skicka upload crypted/$hash_name.tar.gz Brno/
fi

rc=$?

if [ $rc -ne 0 ]
then
    echo "Upload failed!"
    exit 1
fi

# register uploaded file in db
curl -f --data "{\"id\": \"$hash_name\", \"path\": \"$2\", \"password\": \"$3\", \"thumbs\": \"$thumbs\"}" localhost:3000/uploaded

rc=$?

if [ $rc -ne 0 ]
then
    echo "Curl failed!"
    exit 1
fi
