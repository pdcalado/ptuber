#!/bin/bash

if [ "$2" == "" ]
then
    echo "Missing argument password"
    exit 1
fi

hash_name=$(bash hash_name.sh $1)

pass=$2

# Check if encrypted file already exists
nulled=$(stat $CRYPTED_FOLDER/$hash_name.enc >> /dev/null 2>&1)

rc=$?

if [ $rc -eq 0 ]
then
    echo "File $CRYPTED_FOLDER/$hash_name already exists"
    exit 1
fi

# Check if thumbs already exist
nulled=$(stat $THUMBS_FOLDER/$hash_name-* >> /dev/null 2>&1)

rc=$?
if [ $rc -eq 0 ]
then
    echo "Thumbs already exist"
else
    # Create thumbs
    bash thumbs.sh $1
fi

# encrypt file
bash encrypt.sh $1 $pass $CRYPTED_FOLDER/$hash_name.enc

tar -czf $hash_name.temporary.tar.gz $THUMBS_FOLDER/$hash_name-*

bash encrypt.sh $hash_name.temporary.tar.gz $pass $CRYPTED_FOLDER/$hash_name.tar.gz

rm -f $hash_name.temporary.tar.gz

# register encrypted file in db
curl -f --data "{\"id\": \"$hash_name\", \"name\": \"$1\", \"password\": \"$pass\", \"path\": \"$PWD/$1\"}" $DB_URL/encrypted

rc=$?

if [ $rc -ne 0 ]
then
    echo "Curl failed!"
    exit 1
fi
