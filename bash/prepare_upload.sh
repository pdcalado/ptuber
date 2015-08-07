#!/bin/bash

if [ "$2" == "" ]
then
    echo "Missing argument folder"
    exit 1
fi

if [ "$3" == "" ]
then
    echo "Missing argument password"
    exit 1
fi

hash_name=$(echo -n "$1" | md5sum - | cut -d' ' -f1)

pass=$3

# Check if encrypted file already exists
nulled=$(stat $2/$hash_name.enc >> /dev/null 2>&1)

rc=$?

if [ $rc -eq 0 ]
then
    echo "File $2/$hash_name already exists"
    exit 1
fi

# Check if thumbs already exist
nulled=$(stat thumbs/$hash_name-* >> /dev/null 2>&1)

rc=$?
if [ $rc -eq 0 ]
then
    echo "Thumbs already exist"
else
    # Create thumbs
    bash thumbs.sh $1
fi

# encrypt file
bash encrypt.sh $1 $pass $2/$hash_name.enc

tar -czf $hash_name.temporary.tar.gz thumbs/$hash_name-*

bash encrypt.sh $hash_name.temporary.tar.gz $pass $2/$hash_name.tar.gz

rm -f $hash_name.temporary.tar.gz

# register encrypted file in db
curl -f --data "{\"id\": \"$hash_name\", \"name\": \"$1\", \"password\": \"$pass\", \"path\": \"$PWD/$1\"}" localhost:3000/encrypted

rc=$?

if [ $rc -ne 0 ]
then
    echo "Curl failed!"
    exit 1
fi
