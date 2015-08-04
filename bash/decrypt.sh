#!/bin/bash

# $2 is password and $3 is output

openssl aes-256-cbc -d -a -salt -in $1 -out $3 -k $2

echo "Decrypted to $3"
