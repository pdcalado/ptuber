#!/bin/bash

# $2 is password

output=$(echo -n "$1" | md5sum - | cut -d' ' -f1)

openssl aes-256-cbc -a -salt -in $1 -out "$output.enc" -k $2

echo "Encrypted to $output.enc"
