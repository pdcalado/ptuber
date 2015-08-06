#!/bin/bash

# $2 is password

openssl aes-256-cbc -a -salt -in $1 -out $3 -k $2

echo "Encrypted to $3"
