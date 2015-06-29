#!/bin/bash

openssl aes-256-cbc -d -a -salt -in $1 -out $2 -k $3
