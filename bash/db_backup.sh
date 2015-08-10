#!/bin/bash

suffix=$(date --utc +"%s")

openssl aes-256-cbc -a -salt -in $1 -out $BACKUP_FOLDER/bak-$suffix -k $2$suffix

skicka upload $BACKUP_FOLDER/bak-$suffix Porto/
