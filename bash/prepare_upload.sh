#!/bin/bash

hash_name=$(echo -n "$1" | md5sum - | cut -d' ' -f1)

pass=$(bash gen_passwd.sh)

nulled=$(stat $2/$hash_name >> /dev/null 2>&1)

rc=$?
if [ $rc -eq 0 ]
then
    echo "File $2/$hash_name already exists"
    exit 1
fi

# encrypt file
bash encrypt.sh $1 $pass $2/$hash_name

# register encrypted file in db
echo "{\"id\": \"$hash_name\", \"name\": \"$1\", \"password\": \"$pass\", \"path\": \"$PWD$1\"}"
