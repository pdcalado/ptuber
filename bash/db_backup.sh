#!/bin/bash

suffix=$(date --utc +"%s")

openssl aes-256-cbc -a -salt -in $1 -out backup/bak-$suffix -k $2$suffix

skicka upload backup/bak-$suffix Porto/
