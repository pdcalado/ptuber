#!/bin/bash

suffix=$(date --utc +"%s")

openssl aes-256-cbc -a -salt -in $1 -out bak-$suffix -k $2
